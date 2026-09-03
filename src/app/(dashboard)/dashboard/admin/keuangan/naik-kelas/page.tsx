"use client";

import { useState, useEffect } from "react";
import { ArrowUpCircle, Loader2, AlertTriangle, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Mapping kenaikan kelas: extract tingkat dari nama kelas
function promoteKelas(namaKelas: string): string | null {
  if (namaKelas.toUpperCase().startsWith("XII")) return null; // Lulus
  if (namaKelas.toUpperCase().startsWith("XI")) return namaKelas.replace(/^XI/i, "XII");
  if (namaKelas.toUpperCase().startsWith("X")) {
    // Handle "X TKJ 1" -> "XI TKJ 1", but not "XII" -> "XIII"
    return namaKelas.replace(/^X(?!I)/i, "XI ");
  }
  return null;
}

export default function NaikKelasPage() {
  const [siswaData, setSiswaData] = useState<any[]>([]);
  const [kategoriData, setKategoriData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [processLog, setProcessLog] = useState<string[]>([]);

  const [tahunAjaranBaru, setTahunAjaranBaru] = useState<string>("");
  const [tahunOptions, setTahunOptions] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch master tahun ajaran
      const { data: taData } = await supabase
        .from("master_tahun_ajaran")
        .select("nama_tahun, is_active")
        .order("nama_tahun", { ascending: false });
        
      if (taData && taData.length > 0) {
        setTahunOptions(taData.map(t => t.nama_tahun));
        const active = taData.find(t => t.is_active);
        // Jika ada yang aktif, otomatis sarankan tahun depannya jika belum ada di list?
        // Tapi karena master datanya sudah ada (harus ditambahkan manual oleh admin),
        // Pilih saja yang teratas (terbaru) atau biarkan user pilih.
        // Kita default ke opsi pertama dari master data.
        setTahunAjaranBaru(taData[0].nama_tahun);
      }
      const { data: siswa } = await supabase
        .from("siswa").select("id, nama, nis, kelas, jurusan").order("kelas").order("nama");
      setSiswaData(siswa || []);

      const { data: kategori } = await supabase
        .from("kategori_tagihan").select("id, nama_kategori, nominal_default").order("created_at");
      setKategoriData(kategori || []);
      // Default: select all categories
      setSelectedKategori((kategori || []).map((k: any) => k.id));
    } catch {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKategori = (id: string) => {
    setSelectedKategori(prev =>
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  // Group students by promotion status
  const naikSiswa = siswaData.filter(s => s.kelas && promoteKelas(s.kelas) !== null);
  const lulusSiswa = siswaData.filter(s => s.kelas && s.kelas.toUpperCase().startsWith("XII"));
  const naikPreview = naikSiswa.filter(s => !s.kelas.toUpperCase().startsWith("XII")).map(s => ({
    ...s,
    kelas_baru: promoteKelas(s.kelas)
  }));

  const handleProcess = async () => {
    setIsConfirmOpen(false);
    setIsProcessing(true);
    setIsDone(false);
    const logs: string[] = [];

    try {
      // 1. Update kelas siswa (non-XII)
      logs.push(`⏳ Memproses ${naikPreview.length} siswa naik kelas...`);
      setProcessLog([...logs]);

      for (const s of naikPreview) {
        const { error } = await supabase
          .from("siswa").update({ kelas: s.kelas_baru }).eq("id", s.id);
        if (error) {
          logs.push(`❌ Gagal update ${s.nama}: ${error.message}`);
        }
      }
      logs.push(`✅ ${naikPreview.length} siswa berhasil naik kelas.`);
      setProcessLog([...logs]);

      // 2. Generate tagihan baru untuk siswa yang naik
      if (selectedKategori.length > 0) {
        logs.push(`⏳ Membuat tagihan untuk TA ${tahunAjaranBaru}...`);
        setProcessLog([...logs]);

        const allStudentsToTag = [...naikPreview];
        let bulkData: any[] = [];

        for (const s of allStudentsToTag) {
          for (const katId of selectedKategori) {
            const kat = kategoriData.find(k => k.id === katId);
            if (!kat) continue;
            const isSPP = kat.nama_kategori.toUpperCase().includes("SPP");
            const nominal = Number(kat.nominal_default);

            if (isSPP) {
              const startYear = parseInt(tahunAjaranBaru.split("/")[0]);
              for (let i = 0; i < 12; i++) {
                // July (7) to June (6) next year
                const month = ((7 + i - 1) % 12) + 1;
                const year = month >= 7 ? startYear : startYear + 1;
                bulkData.push({
                  id_siswa: s.id,
                  id_kategori: katId,
                  nominal,
                  status_lunas: false,
                  bulan_tagihan: `${year}-${String(month).padStart(2, '0')}-01`,
                  tahun_ajaran: tahunAjaranBaru,
                  kelas_saat_tagihan: s.kelas_baru
                });
              }
            } else {
              bulkData.push({
                id_siswa: s.id,
                id_kategori: katId,
                nominal,
                status_lunas: false,
                bulan_tagihan: null,
                tahun_ajaran: tahunAjaranBaru,
                kelas_saat_tagihan: s.kelas_baru
              });
            }
          }
        }

        // Insert in batches of 500
        for (let i = 0; i < bulkData.length; i += 500) {
          const batch = bulkData.slice(i, i + 500);
          const { error } = await supabase.from("tagihan_siswa").insert(batch);
          if (error) {
            logs.push(`❌ Gagal insert batch ${i}: ${error.message}`);
          }
        }
        logs.push(`✅ ${bulkData.length} record tagihan berhasil di-generate.`);
        setProcessLog([...logs]);
      }

      // 3. Handle kelas XII -> log saja
      if (lulusSiswa.length > 0) {
        logs.push(`ℹ️ ${lulusSiswa.length} siswa kelas XII perlu diproses kelulusan secara manual (pindah ke Alumni).`);
        setProcessLog([...logs]);
      }

      logs.push(`🎉 Proses naik kelas selesai!`);
      setProcessLog([...logs]);
      setIsDone(true);
      toast.success("Proses naik kelas berhasil!");
    } catch (err: any) {
      logs.push(`❌ Error: ${err.message}`);
      setProcessLog([...logs]);
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Proses Naik Kelas
        </h2>
        <p className="text-muted-foreground mt-1">
          Naikkan siswa ke kelas berikutnya dan otomatis generate tagihan baru. Data tahun ajaran lama tetap aman.
        </p>
      </div>

      {/* Settings */}
      <Card className="border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <ArrowUpCircle className="w-5 h-5 text-blue-600" />
            Pengaturan Kenaikan Kelas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tahun Ajaran Baru</label>
              <Select value={tahunAjaranBaru} onValueChange={setTahunAjaranBaru}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-400">
                  <SelectValue placeholder="Pilih dari Master Data..." />
                </SelectTrigger>
                <SelectContent>
                  {tahunOptions.map(ta => (
                    <SelectItem key={ta} value={ta}>TA {ta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Pilihan tahun ajaran diambil dari menu <strong>Master Tahun Ajaran</strong>.
              </p>
            </div>
          </div>

          {/* Kategori Tagihan Selector */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Kategori Tagihan yang Akan Di-generate:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kategoriData.map(k => (
                <label
                  key={k.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedKategori.includes(k.id)
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedKategori.includes(k.id)}
                    onChange={() => toggleKategori(k.id)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-medium text-sm">{k.nama_kategori}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Rp {Number(k.nominal_default).toLocaleString('id-ID')}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-amber-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Users className="w-5 h-5 text-amber-600" />
            Preview Kenaikan ({naikPreview.length} siswa naik, {lulusSiswa.length} siswa lulus)
          </CardTitle>
          <CardDescription>
            Siswa kelas XII akan ditandai untuk kelulusan (proses manual ke Alumni).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {naikPreview.length === 0 && lulusSiswa.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada siswa yang bisa diproses.</p>
            ) : (
              <>
                {naikPreview.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-blue-50/50 text-sm">
                    <span className="font-medium">{s.nama} <span className="text-xs text-muted-foreground">(NIS: {s.nis || '-'})</span></span>
                    <span className="flex items-center gap-2 text-xs">
                      <span className="bg-slate-200 px-2 py-0.5 rounded font-mono">{s.kelas}</span>
                      <span className="text-blue-600 font-bold">→</span>
                      <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-mono">{s.kelas_baru}</span>
                    </span>
                  </div>
                ))}
                {lulusSiswa.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-amber-50/50 text-sm">
                    <span className="font-medium">{s.nama} <span className="text-xs text-muted-foreground">(NIS: {s.nis || '-'})</span></span>
                    <span className="flex items-center gap-2 text-xs">
                      <span className="bg-slate-200 px-2 py-0.5 rounded font-mono">{s.kelas}</span>
                      <span className="text-amber-600 font-bold">→</span>
                      <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono">LULUS</span>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Log */}
      {processLog.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Log Proses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-1">
              {processLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex gap-3 justify-end">
        {isDone ? (
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Proses selesai! Silakan cek halaman Tagihan.
          </div>
        ) : (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base"
            disabled={isProcessing || naikPreview.length === 0}
            onClick={() => setIsConfirmOpen(true)}
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memproses...</>
            ) : (
              <><ArrowUpCircle className="w-5 h-5 mr-2" /> Proses Naik Kelas</>
            )}
          </Button>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              Konfirmasi Kenaikan Kelas
            </DialogTitle>
            <DialogDescription>
              Anda akan memproses kenaikan kelas untuk <strong>{naikPreview.length} siswa</strong> ke
              Tahun Ajaran <strong>{tahunAjaranBaru}</strong>. Proses ini akan:
            </DialogDescription>
          </DialogHeader>
          <ul className="text-sm space-y-2 pl-4 list-disc text-slate-700">
            <li>Update kelas siswa di database</li>
            <li>Generate {selectedKategori.length} kategori tagihan baru</li>
            <li>Data tagihan tahun sebelumnya <strong>tidak akan dihapus</strong></li>
          </ul>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleProcess}>
              Ya, Proses Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
