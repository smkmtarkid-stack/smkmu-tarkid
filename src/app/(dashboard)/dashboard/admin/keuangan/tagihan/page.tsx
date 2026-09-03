"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Loader2, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { DataTable } from "@/components/crud/data-table";
import { FormDialog, FieldDef } from "@/components/crud/form-dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function TagihanSiswaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [dynamicColumns, setDynamicColumns] = useState<any[]>([]);
  const [kategoriRawData, setKategoriRawData] = useState<any[]>([]);
  const [siswaRawData, setSiswaRawData] = useState<any[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMassalDialogOpen, setIsMassalDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [siswaOptions, setSiswaOptions] = useState<{label: string, value: string}[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<{label: string, value: string}[]>([]);
  const [kelasOptions, setKelasOptions] = useState<{label: string, value: string}[]>([]);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<any>(null);

  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<string>("");
  const [tahunAjaranOptions, setTahunAjaranOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialTahunAjaran();
  }, []);

  const fetchInitialTahunAjaran = async () => {
    try {
      const { data, error } = await supabase
        .from("master_tahun_ajaran")
        .select("nama_tahun, is_active")
        .order("nama_tahun", { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const options = data.map(t => t.nama_tahun);
        setTahunAjaranOptions(options);
        
        const active = data.find(t => t.is_active);
        if (active) {
          setSelectedTahunAjaran(active.nama_tahun);
        } else {
          setSelectedTahunAjaran(options[0]); // fallback
        }
      }
    } catch (err) {
      console.error("Gagal memuat tahun ajaran:", err);
    }
  };

  useEffect(() => {
    if (selectedTahunAjaran) {
      fetchData();
    }
  }, [selectedTahunAjaran]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: katData, error: katError } = await supabase
        .from("kategori_tagihan")
        .select("id, nama_kategori, nominal_default")
        .order("created_at", { ascending: true });
      
      if (katError) throw katError;
      const categories = katData || [];
      setKategoriRawData(categories);

      const { data: siswaData, error: siswaError } = await supabase
        .from("siswa")
        .select("id, nama, kelas, nis")
        .order("nama", { ascending: true });

      if (siswaError) throw siswaError;
      const students = siswaData || [];
      setSiswaRawData(students);

      // Filter tagihan by tahun_ajaran
      const { data: tagihanData, error: tagihanError } = await supabase
        .from("tagihan_siswa")
        .select("id, id_siswa, id_kategori, nominal, status_lunas, bulan_tagihan, tahun_ajaran, kelas_saat_tagihan")
        .eq("tahun_ajaran", selectedTahunAjaran);

      if (tagihanError) throw tagihanError;
      const bills = tagihanData || [];

      // ==========================================
      // MEMBUAT DEFINISI KOLOM DINAMIS
      // ==========================================
      const baseColumns = [
        { label: "Siswa", key: "nama_siswa" },
        { label: "Kelas (Saat Tagihan)", key: "kelas" },
      ];

      const categoryColumns = categories.map(kat => ({
        label: kat.nama_kategori,
        key: `cat_${kat.id}`,
        render: (value: any, row: any) => {
          const catBills = row[`cat_${kat.id}`] || [];
          if (catBills.length === 0) return <span className="text-muted-foreground">-</span>;
          
          const isSPP = kat.nama_kategori.toUpperCase().includes("SPP");

          if (isSPP) {
            return (
              <div className="flex flex-col bg-slate-50 rounded-md border p-2 min-w-[200px]">
                <div className="grid grid-cols-6 gap-x-2 gap-y-3 text-center text-xs">
                  {[...Array(12)].map((_, i) => {
                    const monthNum = i + 1;
                    const bill = catBills.find((b: any) => {
                      if (!b.bulan_tagihan) return false;
                      const bMonth = new Date(b.bulan_tagihan).getMonth() + 1;
                      return bMonth === monthNum;
                    });
                    
                    return (
                      <div key={i} className="flex flex-col items-center justify-between h-8">
                        <span className="text-muted-foreground font-semibold text-[10px]">{monthNum}</span>
                        {bill ? (
                          bill.status_lunas ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          )
                        ) : (
                          <span className="text-muted-foreground/30 font-bold">-</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          const lunasCount = catBills.filter((b: any) => b.status_lunas).length;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-1 max-w-[120px]">
                {catBills.map((b: any, idx: number) => 
                  b.status_lunas ? (
                    <CheckCircle2 key={idx} className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle key={idx} className="w-4 h-4 text-rose-500 shrink-0" />
                  )
                )}
              </div>
              {catBills.length > 1 && (
                <span className="text-[10px] text-muted-foreground font-medium">
                  ({lunasCount}/{catBills.length} Lunas)
                </span>
              )}
            </div>
          );
        }
      }));

      const tailColumns = [
        { 
          label: "Total Tunggakan", 
          key: "total_tunggakan",
          render: (value: any) => (
            <div className="font-bold text-rose-600">
              Rp {Number(value).toLocaleString('id-ID')}
            </div>
          )
        }
      ];

      setDynamicColumns([...baseColumns, ...categoryColumns, ...tailColumns]);

      // ==========================================
      // MENGELOMPOKKAN DATA PER SISWA (PIVOT)
      // ==========================================
      const mergedData = students.map(student => {
        const studentBills = bills.filter(t => t.id_siswa === student.id);
        
        // Gunakan kelas_saat_tagihan dari tagihan (snapshot), fallback ke kelas aktif
        const kelasFromBill = studentBills.length > 0 ? studentBills[0].kelas_saat_tagihan : null;
        
        const row: any = {
          id: student.id,
          nama_siswa: `${student.nama}\n(NIS: ${student.nis || '-'})`,
          kelas: kelasFromBill || student.kelas || '-',
          _rawBills: [] // Store flat list for edit panel
        };

        let totalTunggakan = 0;
        let hasAnyBill = false;
        
        row._rawBills = studentBills.map(b => {
          const kName = categories.find(c => c.id === b.id_kategori)?.nama_kategori || "Tanpa Nama";
          let label = kName;
          if (b.bulan_tagihan) {
            const m = new Date(b.bulan_tagihan).getMonth();
            const names = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            label += ` (Bulan ${m + 1}: ${names[m]})`;
          }
          return { ...b, category_name: label };
        });

        categories.forEach(kat => {
          const catBills = studentBills.filter(t => t.id_kategori === kat.id);
          row[`cat_${kat.id}`] = catBills; 
          
          if (catBills.length > 0) hasAnyBill = true;

          catBills.forEach(b => {
            if (!b.status_lunas) {
              totalTunggakan += Number(b.nominal);
            }
          });
        });

        row.total_tunggakan = totalTunggakan;
        row._hasBills = hasAnyBill;
        return row;
      });

      const activeRows = mergedData.filter(row => row._hasBills);
      setData(activeRows);

      setSiswaOptions(students.map(s => ({
        label: `${s.nama} (NIS: ${s.nis || '-'} - ${s.kelas || '-'})`,
        value: s.id
      })));
      
      setKategoriOptions(categories.map(k => ({
        label: `${k.nama_kategori} - Rp ${Number(k.nominal_default).toLocaleString('id-ID')}`,
        value: k.id
      })));

      const uniqueClasses = Array.from(new Set(students.map(s => s.kelas).filter(Boolean)));
      setKelasOptions(uniqueClasses.map(c => ({
        label: `Kelas ${c}`,
        value: c as string
      })));

    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memuat data. Pastikan tabel di Supabase dan kebijakan RLS (Security) sudah benar.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInsertData = (id_siswa: string, id_kategori: string, nominal: number) => {
    const kat = kategoriRawData.find(k => k.id === id_kategori);
    const isSPP = kat?.nama_kategori.toUpperCase().includes("SPP");
    
    // Parse start year from selectedTahunAjaran (e.g., "2026/2027" -> 2026)
    const startYear = parseInt(selectedTahunAjaran.split("/")[0]) || new Date().getFullYear();

    // Cari kelas siswa saat ini untuk snapshot
    const siswa = siswaRawData.find(s => s.id === id_siswa);
    const kelasSaatIni = siswa?.kelas || null;

    if (isSPP) {
      return Array.from({ length: 12 }).map((_, i) => {
        // Tagihan SPP mulai bulan Juli (7) s/d Juni (6) tahun berikutnya
        const monthNum = ((7 + i - 1) % 12) + 1;
        const yearNum = monthNum >= 7 ? startYear : startYear + 1;
        
        return {
          id_siswa,
          id_kategori,
          nominal,
          status_lunas: false,
          bulan_tagihan: `${yearNum}-${String(monthNum).padStart(2, '0')}-01`,
          tahun_ajaran: selectedTahunAjaran,
          kelas_saat_tagihan: kelasSaatIni
        };
      });
    } else {
      return [{
        id_siswa,
        id_kategori,
        nominal,
        status_lunas: false,
        bulan_tagihan: null,
        tahun_ajaran: selectedTahunAjaran,
        kelas_saat_tagihan: kelasSaatIni
      }];
    }
  };

  const handleAddSubmit = async (formData: any) => {
    try {
      let nominal = formData.nominal;
      if (!nominal) {
        const kat = kategoriRawData.find(k => k.id === formData.id_kategori);
        if (kat) nominal = kat.nominal_default;
      }
      
      const insertData = getInsertData(formData.id_siswa, formData.id_kategori, Number(nominal || 0));
      const { error } = await supabase.from("tagihan_siswa").insert(insertData as any[]);

      if (error) throw error;
      
      toast.success(insertData.length > 1 ? `Berhasil membuat tagihan SPP (12 Bulan) untuk TA ${selectedTahunAjaran}!` : `Berhasil membuat tagihan baru untuk TA ${selectedTahunAjaran}!`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal membuat tagihan: " + error.message);
    }
  };

  const handleMassalSubmit = async (formData: any) => {
    try {
      setIsGenerating(true);
      
      const targetSiswa = formData.kelas === "SEMUA" 
        ? siswaRawData 
        : siswaRawData.filter(s => s.kelas === formData.kelas);

      if (targetSiswa.length === 0) {
        toast.error("Tidak ada siswa ditemukan di kelas tersebut.");
        setIsGenerating(false);
        return;
      }

      let nominal = formData.nominal;
      if (!nominal) {
        const kat = kategoriRawData.find(k => k.id === formData.id_kategori);
        if (kat) nominal = kat.nominal_default;
      }

      let bulkData: any[] = [];
      targetSiswa.forEach(siswa => {
        const d = getInsertData(siswa.id, formData.id_kategori, Number(nominal || 0));
        bulkData = [...bulkData, ...d];
      });

      const { error } = await supabase.from("tagihan_siswa").insert(bulkData as any[]);

      if (error) throw error;

      toast.success(`Berhasil membuat tagihan massal untuk ${targetSiswa.length} siswa (TA ${selectedTahunAjaran})!`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal men-generate tagihan massal: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteSingleBill = async (billId: string) => {
    if (!window.confirm("Yakin ingin menghapus tagihan ini secara permanen?")) return;
    
    try {
      const { error } = await supabase.from("tagihan_siswa").delete().eq("id", billId);
      if (error) throw error;
      
      toast.success("Tagihan berhasil dihapus!");
      
      if (selectedStudentForEdit) {
        const updatedRaw = selectedStudentForEdit._rawBills.filter((b:any) => b.id !== billId);
        setSelectedStudentForEdit({...selectedStudentForEdit, _rawBills: updatedRaw});
      }
      
      fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus tagihan: " + err.message);
    }
  };

  const handleSetLunasFree = async (bill: any) => {
    if (!window.confirm("Tandai tagihan ini LUNAS secara GRATIS (Voucher/Beasiswa)? Pemasukan kasir tidak akan bertambah.")) return;
    
    try {
      const { error: updateError } = await supabase
        .from("tagihan_siswa")
        .update({ status_lunas: true })
        .eq("id", bill.id);
        
      if (updateError) throw updateError;
      
      // Catat sebagai transaksi 0 rupiah agar ada riwayatnya
      await supabase.from("transaksi_pembayaran").insert({
        id_tagihan: bill.id,
        id_siswa: selectedStudentForEdit.id,
        nominal_bayar: 0,
        metode_pembayaran: "VOUCHER",
        petugas: "Admin TU"
      });
      
      toast.success("Tagihan berhasil dilunaskan via Voucher!");
      
      if (selectedStudentForEdit) {
        const updatedRaw = selectedStudentForEdit._rawBills.map((b:any) => 
          b.id === bill.id ? { ...b, status_lunas: true } : b
        );
        setSelectedStudentForEdit({...selectedStudentForEdit, _rawBills: updatedRaw});
      }
      
      fetchData();
    } catch (err: any) {
      toast.error("Gagal melunaskan tagihan: " + err.message);
    }
  };

  const manualFields: FieldDef[] = [
    { key: "id_siswa", label: "Pilih Siswa", type: "select", options: siswaOptions, required: true },
    { key: "id_kategori", label: "Pilih Kategori Tagihan", type: "select", options: kategoriOptions, required: true },
    { key: "nominal", label: "Nominal Custom (Opsional)", type: "number", placeholder: "Kosongkan untuk ikut nominal default" },
  ];

  const massalFields: FieldDef[] = [
    { 
      key: "kelas", 
      label: "Pilih Kelas Target", 
      type: "select", 
      options: [{ label: "== SEMUA KELAS ==", value: "SEMUA" }, ...kelasOptions], 
      required: true 
    },
    { key: "id_kategori", label: "Pilih Kategori Tagihan", type: "select", options: kategoriOptions, required: true },
    { key: "nominal", label: "Nominal Custom (Opsional)", type: "number", placeholder: "Kosongkan untuk ikut nominal default" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-[90rem] mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Manajemen Tagihan Siswa
          </h2>
          <p className="text-muted-foreground mt-1">
            Rekapitulasi tagihan per siswa. Tanda ✅ (Lunas), Tanda ❌ (Belum Lunas).
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" 
            onClick={() => setIsMassalDialogOpen(true)}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2" />}
            {isGenerating ? "Memproses..." : "Generate Tagihan Massal"}
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Tagihan Manual
          </Button>
        </div>
      </div>

      {/* Filter Tahun Ajaran */}
      <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-sm font-semibold text-amber-800 whitespace-nowrap">
              📅 Tahun Ajaran Aktif:
            </label>
            <Select value={selectedTahunAjaran} onValueChange={setSelectedTahunAjaran}>
              <SelectTrigger className="w-[200px] bg-white border-amber-200 focus:ring-amber-400">
                <SelectValue placeholder="Pilih Tahun Ajaran" />
              </SelectTrigger>
              <SelectContent>
                {tahunAjaranOptions.map(ta => (
                  <SelectItem key={ta} value={ta}>
                    TA {ta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-amber-600">
              Data tagihan di bawah difilter berdasarkan tahun ajaran yang dipilih. Data tahun sebelumnya tetap aman tersimpan.
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-100 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Daftar Tagihan — TA {selectedTahunAjaran}</CardTitle>
          <CardDescription>
            Tabel pivot yang merangkum seluruh tagihan berdasarkan kategori untuk masing-masing siswa. Klik Edit untuk rincian.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-muted-foreground">Mengambil data dari database...</p>
            </div>
          ) : (
            <DataTable
              columns={dynamicColumns}
              data={data}
              onEdit={(row) => {
                setSelectedStudentForEdit(row);
                setIsDetailDialogOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddSubmit}
        fields={manualFields}
        title="Buat Tagihan Manual"
        description={`Tambahkan tagihan spesifik untuk satu siswa di Tahun Ajaran ${selectedTahunAjaran}. Data akan masuk ke sistem pembayaran Kasir.`}
      />

      <FormDialog
        open={isMassalDialogOpen}
        onClose={() => setIsMassalDialogOpen(false)}
        onSubmit={handleMassalSubmit}
        fields={massalFields}
        title="Generate Tagihan Massal"
        description={`Buat tagihan serentak untuk satu angkatan/kelas di TA ${selectedTahunAjaran} (contoh: pembuatan SPP untuk seluruh siswa kelas X-RPL).`}
      />

      {/* Dialog Edit Rincian Tagihan Siswa */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-emerald-950">Rincian Tagihan Siswa — TA {selectedTahunAjaran}</DialogTitle>
            <DialogDescription className="text-base text-emerald-800 font-medium">
              {selectedStudentForEdit?.nama_siswa?.replace('\n', ' ')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-3">
            {selectedStudentForEdit?._rawBills?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada tagihan.</p>
            ) : (
              selectedStudentForEdit?._rawBills?.sort((a:any, b:any) => a.category_name.localeCompare(b.category_name)).map((bill: any) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{bill.category_name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ID: {bill.id.substring(0,8)}... | Kelas: {bill.kelas_saat_tagihan || '-'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold text-slate-800">Rp {Number(bill.nominal).toLocaleString('id-ID')}</p>
                      {bill.status_lunas ? (
                        <span className="inline-flex items-center text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          LUNAS
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded">
                          BELUM LUNAS
                        </span>
                      )}
                    </div>
                    
                    {!bill.status_lunas && (
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100"
                          onClick={() => handleSetLunasFree(bill)}
                          title="Lunaskan Gratis (Voucher)"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-100"
                          onClick={() => handleDeleteSingleBill(bill.id)}
                          title="Hapus Tagihan Ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
