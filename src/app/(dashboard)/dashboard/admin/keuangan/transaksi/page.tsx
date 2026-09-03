"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Printer, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function KasirPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [selectedBills, setSelectedBills] = useState<any[]>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxId, setLastTxId] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 3) {
      toast.error("Masukkan minimal 3 karakter untuk mencari siswa.");
      return;
    }

    setIsLoadingSearch(true);
    setStudent(null);
    setBills([]);
    setPaymentSuccess(false);
    setSelectedBills([]);

    try {
      // 1. Cari siswa
      const { data: siswaData, error: siswaError } = await supabase
        .from("siswa")
        .select("id, nama, nis, kelas")
        .or(`nama.ilike.%${searchQuery}%,nis.ilike.%${searchQuery}%`)
        .limit(1);

      if (siswaError) throw siswaError;

      if (!siswaData || siswaData.length === 0) {
        toast.error("Data siswa tidak ditemukan.");
        setIsLoadingSearch(false);
        return;
      }

      const foundStudent = siswaData[0];
      setStudent(foundStudent);

      // 2. Ambil tagihan yang belum lunas
      const { data: tagihanData, error: tagihanError } = await supabase
        .from("tagihan_siswa")
        .select(`
          id,
          nominal,
          status_lunas,
          bulan_tagihan,
          tahun_ajaran,
          kelas_saat_tagihan,
          kategori_tagihan (
            nama_kategori
          )
        `)
        .eq("id_siswa", foundStudent.id)
        .eq("status_lunas", false);

      if (tagihanError) {
         console.warn("Gagal mengambil tagihan:", tagihanError);
      } else {
         setBills(tagihanData || []);
      }

    } catch (err: any) {
      console.error(err);
      toast.error("Gagal melakukan pencarian ke database.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const toggleSelection = (bill: any) => {
    setSelectedBills(prev => {
      const exists = prev.find(b => b.id === bill.id);
      if (exists) {
        return prev.filter(b => b.id !== bill.id);
      }
      return [...prev, bill];
    });
  };

  const selectAll = () => {
    if (selectedBills.length === bills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills([...bills]);
    }
  };

  const handlePay = async () => {
    if (selectedBills.length === 0 || !student) return;
    
    setIsProcessing(true);
    try {
      const billIds = selectedBills.map(b => b.id);

      // 1. Update semua tagihan terpilih jadi lunas
      const { error: updateError } = await supabase
        .from("tagihan_siswa")
        .update({ status_lunas: true })
        .in("id", billIds);

      if (updateError) throw updateError;

      // 2. Insert log transaksi untuk masing-masing tagihan
      const transactions = selectedBills.map(bill => ({
        id_tagihan: bill.id,
        id_siswa: student.id,
        nominal_bayar: bill.nominal,
        metode_pembayaran: "CASH",
        petugas: "Admin TU" // Harus disesuaikan dengan session auth nantinya
      }));

      const { data: insertData, error: insertError } = await supabase
        .from("transaksi_pembayaran")
        .insert(transactions)
        .select("id");

      if (insertError) throw insertError;

      // Gabungkan ID dengan koma untuk URL struk jika banyak transaksi
      const joinedIds = (insertData || []).map(t => t.id).join(",");
      setLastTxId(joinedIds || billIds.join(","));
      
      setPaymentSuccess(true);
      toast.success("Pembayaran berhasil diproses ke Database!");
    } catch (err: any) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses pembayaran. Pastikan tabel di database sudah sesuai.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setStudent(null);
    setBills([]);
    setPaymentSuccess(false);
    setSelectedBills([]);
    setSearchQuery("");
  };

  const totalPayable = selectedBills.reduce((sum, b) => sum + Number(b.nominal), 0);

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Loket Pembayaran (Kasir)
          </h2>
          <p className="text-muted-foreground mt-1">
            Cari siswa di database, pilih satu atau lebih tagihan, dan proses pembayaran tunai.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Pencarian Siswa */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Cari Siswa</CardTitle>
              <CardDescription>Masukkan Nama atau NISN</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isLoadingSearch}
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={isLoadingSearch}>
                  {isLoadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cari"}
                </Button>
              </form>

              {student && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase">
                      {student.nama?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-950 capitalize">{student.nama}</p>
                      <p className="text-xs text-emerald-700">NISN: {student.nis || "-"}</p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2">Kelas: {student.kelas || "-"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Tagihan & Pembayaran */}
        <div className="md:col-span-2">
          {!student ? (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Silakan cari siswa terlebih dahulu untuk melihat tagihan dari database.</p>
            </Card>
          ) : paymentSuccess ? (
             <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-emerald-200 bg-emerald-50/50">
               <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
               <h3 className="text-2xl font-bold text-emerald-950 mb-2">Pembayaran Berhasil!</h3>
               <p className="text-emerald-700 mb-8">Transaksi tunai telah disimpan ke database Supabase.</p>
               
               <div className="flex gap-4">
                 <Link href={`/print/struk/${lastTxId}`} target="_blank">
                   <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                     <Printer className="h-4 w-4" />
                     Cetak Struk Thermal
                   </Button>
                 </Link>
                 <Button variant="outline" onClick={resetForm}>
                   Transaksi Baru
                 </Button>
               </div>
             </Card>
          ) : (
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Tagihan Belum Lunas</CardTitle>
                  <CardDescription>Pilih satu atau lebih tagihan yang akan dibayar sekaligus</CardDescription>
                </div>
                {bills.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={selectAll} className="text-emerald-600 hover:text-emerald-700">
                    {selectedBills.length === bills.length ? "Batal Pilih Semua" : "Pilih Semua"}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {bills.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-slate-50/50">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">Siswa ini tidak memiliki tunggakan tagihan.</p>
                  </div>
                ) : (
                  <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                    {bills.map(bill => {
                      const isSelected = selectedBills.some(b => b.id === bill.id);
                      return (
                        <div 
                          key={bill.id}
                          onClick={() => toggleSelection(bill)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                            isSelected ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" : "hover:border-emerald-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                              isSelected ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"
                            )}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">
                                {bill.kategori_tagihan?.nama_kategori || "Tagihan"}
                                {bill.bulan_tagihan && (() => {
                                  const m = new Date(bill.bulan_tagihan).getMonth();
                                  const names = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                                  return ` (Bulan ${m + 1}: ${names[m]})`;
                                })()}
                              </h4>
                              {(bill.tahun_ajaran || bill.kelas_saat_tagihan) && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {bill.tahun_ajaran ? `TA ${bill.tahun_ajaran}` : ''}
                                  {bill.tahun_ajaran && bill.kelas_saat_tagihan ? ' · ' : ''}
                                  {bill.kelas_saat_tagihan ? `Kelas ${bill.kelas_saat_tagihan}` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="font-bold text-base text-rose-600">
                            Rp {Number(bill.nominal).toLocaleString('id-ID')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedBills.length > 0 && (
                  <div className="pt-6 mt-6 border-t border-dashed">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground font-medium">Total Dibayar ({selectedBills.length} item):</span>
                      <span className="text-2xl font-bold text-emerald-700">Rp {totalPayable.toLocaleString('id-ID')}</span>
                    </div>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg" 
                      disabled={isProcessing}
                      onClick={handlePay}
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      Proses Pembayaran (Cash)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
