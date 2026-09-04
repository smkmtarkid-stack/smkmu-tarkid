"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, Users, ReceiptText, ArrowUpRight, Loader2, Settings2, FileDown, CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function KeuanganDashboardPage() {
  const [pemasukanHariIni, setPemasukanHariIni] = useState(0);
  const [totalTransaksiHariIni, setTotalTransaksiHariIni] = useState(0);
  const [totalTunggakan, setTotalTunggakan] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Laporan States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laporanData, setLaporanData] = useState<any[]>([]);
  const [laporanLoading, setLaporanLoading] = useState(false);
  const [laporanTotal, setLaporanTotal] = useState(0);
  const [monthlyChartData, setMonthlyChartData] = useState<{ name: string; total: number }[]>([]);

  useEffect(() => {
    fetchStats();
    // Default date range: 1 bulan terakhir
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    setStartDate(oneMonthAgo.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // 1. Hitung Pemasukan Hari Ini
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Mulai dari tengah malam hari ini
      const isoTodayString = today.toISOString();

      const { data: transaksiData, error: txError } = await supabase
        .from("transaksi_pembayaran")
        .select("nominal_bayar")
        .gte("tanggal_bayar", isoTodayString);

      if (!txError && transaksiData) {
        const totalPemasukan = transaksiData.reduce((acc, curr) => acc + Number(curr.nominal_bayar), 0);
        setPemasukanHariIni(totalPemasukan);
        setTotalTransaksiHariIni(transaksiData.length);
      }

      // 2. Hitung Total Tunggakan (tagihan belum lunas)
      const { data: tagihanData, error: tagError } = await supabase
        .from("tagihan_siswa")
        .select("nominal")
        .eq("status_lunas", false);

      if (!tagError && tagihanData) {
        const totalTunggakan = tagihanData.reduce((acc, curr) => acc + Number(curr.nominal), 0);
        setTotalTunggakan(totalTunggakan);
      }
    } catch (err) {
      console.error("Gagal mengambil statistik keuangan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLaporan = async () => {
    if (!startDate || !endDate) {
      toast.error("Pilih tanggal awal dan akhir terlebih dahulu.");
      return;
    }

    setLaporanLoading(true);
    try {
      const startISO = new Date(startDate).toISOString();
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      const endISO = endDateObj.toISOString();

      const { data, error } = await supabase
        .from("transaksi_pembayaran")
        .select(`
          id,
          nominal_bayar,
          metode_pembayaran,
          petugas,
          tanggal_bayar,
          id_siswa
        `)
        .gte("tanggal_bayar", startISO)
        .lte("tanggal_bayar", endISO)
        .order("tanggal_bayar", { ascending: false });

      if (error) throw error;

      let rows = data || [];

      // Manual join untuk menghindari error schema cache jika FK belum terbentuk
      if (rows.length > 0) {
        const studentIds = [...new Set(rows.map((r: any) => r.id_siswa).filter(Boolean))];
        if (studentIds.length > 0) {
          const { data: studentsData } = await supabase
            .from("siswa")
            .select("id, nama, nis, kelas")
            .in("id", studentIds);
          
          if (studentsData) {
            const studentMap = studentsData.reduce((acc: any, curr: any) => {
              acc[curr.id] = curr;
              return acc;
            }, {});
            
            rows = rows.map((r: any) => ({
              ...r,
              siswa: studentMap[r.id_siswa] || null
            }));
          }
        }
      }

      setLaporanData(rows);

      const total = rows.reduce((acc, curr) => acc + Number(curr.nominal_bayar), 0);
      setLaporanTotal(total);

      // Build monthly chart data
      const monthMap: Record<string, number> = {};
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      rows.forEach((r: any) => {
        if (r.tanggal_bayar) {
          const d = new Date(r.tanggal_bayar);
          const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          monthMap[key] = (monthMap[key] || 0) + Number(r.nominal_bayar);
        }
      });
      const chartArr = Object.entries(monthMap)
        .map(([name, total]) => ({ name, total }))
        .reverse(); // chronological
      setMonthlyChartData(chartArr);

      if (rows.length === 0) {
        toast.info("Tidak ada transaksi ditemukan pada rentang waktu tersebut.");
      } else {
        toast.success(`${rows.length} transaksi ditemukan.`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mengambil data laporan: " + err.message);
    } finally {
      setLaporanLoading(false);
    }
  };

  const exportToExcel = () => {
    if (laporanData.length === 0) {
      toast.error("Tidak ada data untuk diekspor. Silakan cari laporan terlebih dahulu.");
      return;
    }

    const exportRows = laporanData.map((r: any, idx: number) => ({
      "No": idx + 1,
      "Tanggal Bayar": r.tanggal_bayar ? new Date(r.tanggal_bayar).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) : "-",
      "Nama Siswa": r.siswa?.nama || "-",
      "NIS": r.siswa?.nis || "-",
      "Kelas": r.siswa?.kelas || "-",
      "Nominal (Rp)": Number(r.nominal_bayar),
      "Metode": r.metode_pembayaran || "-",
      "Petugas": r.petugas || "-",
    }));

    // Add total row
    exportRows.push({
      "No": "" as any,
      "Tanggal Bayar": "",
      "Nama Siswa": "",
      "NIS": "",
      "Kelas": "TOTAL",
      "Nominal (Rp)": laporanTotal,
      "Metode": "",
      "Petugas": "",
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },  // No
      { wch: 28 }, // Tanggal
      { wch: 25 }, // Nama
      { wch: 15 }, // NIS
      { wch: 15 }, // Kelas
      { wch: 18 }, // Nominal
      { wch: 12 }, // Metode
      { wch: 15 }, // Petugas
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");

    const fileName = `Laporan_Keuangan_${startDate}_sd_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`File "${fileName}" berhasil diunduh!`);
  };

  const CHART_COLORS = ["#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6"];

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard Keuangan
          </h2>
          <p className="text-muted-foreground mt-1">
            Ringkasan pendapatan, manajemen tagihan, dan laporan keuangan.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/keuangan/transaksi">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-4 h-4 mr-2" />
              Buka Kasir / Loket
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Hari Ini</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emerald-600">
                  Rp {pemasukanHariIni.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dari {totalTransaksiHariIni} transaksi hari ini
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tunggakan Aktif</CardTitle>
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <ReceiptText className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  Rp {totalTunggakan.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Menunggu pembayaran dari siswa
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============================================= */}
      {/* LAPORAN KEUANGAN - Filter & Export Excel */}
      {/* ============================================= */}
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600" />
            Laporan Keuangan
          </CardTitle>
          <CardDescription>
            Pilih rentang waktu dan lihat seluruh riwayat transaksi pembayaran. Data dapat diekspor ke file Excel (.xlsx).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Tanggal Awal</label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="w-[180px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Tanggal Akhir</label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="w-[180px]"
              />
            </div>
            <Button 
              onClick={fetchLaporan} 
              disabled={laporanLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {laporanLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Tampilkan Laporan
            </Button>
            <Button 
              variant="outline" 
              onClick={exportToExcel} 
              disabled={laporanData.length === 0}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export ke Excel
            </Button>
          </div>

          {/* Monthly Bar Chart */}
          {monthlyChartData.length > 0 && (
            <div className="border rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Grafik Pemasukan per Bulan</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.7} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: "#64748b" }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => {
                      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}Jt`;
                      if (v >= 1_000) return `${(v / 1_000).toFixed(0)}Rb`;
                      return v;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pemasukan"]}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {monthlyChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Laporan Table */}
          {laporanLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-3" />
              <p className="text-muted-foreground text-sm">Mengambil data transaksi...</p>
            </div>
          ) : laporanData.length > 0 ? (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-emerald-50 px-4 py-3 flex items-center justify-between border-b">
                <span className="text-sm font-semibold text-emerald-800">
                  {laporanData.length} Transaksi Ditemukan
                </span>
                <span className="text-sm font-bold text-emerald-700 font-mono">
                  Total: Rp {laporanTotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground w-10">#</th>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground">Tanggal</th>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground">Nama Siswa</th>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground">Kelas</th>
                      <th className="px-4 py-2.5 text-right border-b font-semibold text-xs text-muted-foreground">Nominal</th>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground">Metode</th>
                      <th className="px-4 py-2.5 text-left border-b font-semibold text-xs text-muted-foreground">Petugas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporanData.map((r: any, idx: number) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-2.5 text-muted-foreground">{idx + 1}</td>
                        <td className="px-4 py-2.5 text-xs">
                          {r.tanggal_bayar ? new Date(r.tanggal_bayar).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) : "-"}
                        </td>
                        <td className="px-4 py-2.5 font-medium">{r.siswa?.nama || "-"}</td>
                        <td className="px-4 py-2.5">{r.siswa?.kelas || "-"}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-700">
                          Rp {Number(r.nominal_bayar).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {r.metode_pembayaran || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.petugas || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Menu Administrasi */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 border-emerald-100 shadow-sm">
          <CardHeader>
            <CardTitle>Menu Administrasi</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/dashboard/admin/keuangan/tahun-ajaran" className="flex items-center gap-4 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Settings2 className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-950 dark:text-emerald-50">Master Tahun Ajaran</h4>
                <p className="text-sm text-muted-foreground">Atur daftar tahun ajaran dan tahun aktif sistem.</p>
              </div>
            </Link>

            <Link href="/dashboard/admin/keuangan/kategori" className="flex items-center gap-4 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ReceiptText className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-950 dark:text-emerald-50">Kategori Tagihan</h4>
                <p className="text-sm text-muted-foreground">Atur jenis biaya seperti SPP, Uang Gedung, dll.</p>
              </div>
            </Link>
            
            <Link href="/dashboard/admin/keuangan/tagihan" className="flex items-center gap-4 p-4 rounded-xl border hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-950 dark:text-emerald-50">Manajemen Tagihan Siswa</h4>
                <p className="text-sm text-muted-foreground">Generate tagihan bulanan atau insidental ke siswa.</p>
              </div>
            </Link>

            <Link href="/dashboard/admin/keuangan/naik-kelas" className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5 text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-950 dark:text-blue-50">Proses Naik Kelas</h4>
                <p className="text-sm text-muted-foreground">Kenaikan kelas massal dan generate tagihan tahun ajaran baru.</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
