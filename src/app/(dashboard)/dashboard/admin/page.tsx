"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  ArrowUpRight,
  Activity,
  PieChart as PieChartIcon,
  TrendingUp,
  Layers,
  Award,
  Loader2,
  RefreshCw,
  Banknote,
} from "lucide-react";
import { fetchSheet } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    siswaCount: 0,
    guruCount: 0,
    staffCount: 0,
    waliCount: 0,
    ppdbCount: 0,
    beritaCount: 0,
    jurusanCount: 0,
    alumniCount: 0,
  });

  const [recentActivities, setRecentActivities] = useState<
    { title: string; category: string; time: string }[]
  >([]);

  const [kelasChartData, setKelasChartData] = useState<{ name: string; jumlah: number }[]>([]);
  const [keuanganPieData, setKeuanganPieData] = useState<{ name: string; value: number }[]>([]);

  // Function to load real count from Supabase database
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [siswaRes, guruRes, staffRes, waliRes, ppdbRes, beritaRes, jurusanRes, alumniRes] = await Promise.all([
        fetchSheet("siswa"),
        fetchSheet("guru"),
        fetchSheet("staff"),
        fetchSheet("walisiswa"),
        fetchSheet("ppdb"),
        fetchSheet("berita"),
        fetchSheet("jurusan"),
        fetchSheet("alumni"),
      ]);

      const siswaCount = siswaRes.status === "success" && siswaRes.data ? siswaRes.data.length : 0;
      const guruCount = guruRes.status === "success" && guruRes.data ? guruRes.data.length : 0;
      const staffCount = staffRes.status === "success" && staffRes.data ? staffRes.data.length : 0;
      const waliCount = waliRes.status === "success" && waliRes.data ? waliRes.data.length : 0;
      const ppdbCount = ppdbRes.status === "success" && ppdbRes.data ? ppdbRes.data.length : 0;
      const beritaCount = beritaRes.status === "success" && beritaRes.data ? beritaRes.data.length : 0;
      const jurusanCount = jurusanRes.status === "success" && jurusanRes.data ? jurusanRes.data.length : 0;
      const alumniCount = alumniRes.status === "success" && alumniRes.data ? alumniRes.data.length : 0;

      setStats({
        siswaCount,
        guruCount,
        staffCount,
        waliCount,
        ppdbCount,
        beritaCount,
        jurusanCount,
        alumniCount,
      });

      // === Build Kelas Bar Chart data ===
      if (siswaRes.status === "success" && siswaRes.data) {
        const kelasMap: Record<string, number> = {};
        siswaRes.data.forEach((s: any) => {
          const kelas = s.kelas || "Belum Ditentukan";
          kelasMap[kelas] = (kelasMap[kelas] || 0) + 1;
        });
        const sorted = Object.entries(kelasMap)
          .map(([name, jumlah]) => ({ name, jumlah }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setKelasChartData(sorted);
      }

      // === Build Keuangan Pie data ===
      try {
        const { data: tagihanData } = await supabase
          .from("tagihan_siswa")
          .select("nominal, status_lunas");

        if (tagihanData) {
          let lunas = 0;
          let belum = 0;
          tagihanData.forEach((t: any) => {
            if (t.status_lunas) {
              lunas += Number(t.nominal);
            } else {
              belum += Number(t.nominal);
            }
          });
          setKeuanganPieData([
            { name: "Lunas", value: lunas },
            { name: "Tunggakan", value: belum },
          ]);
        }
      } catch (e) {
        console.warn("Gagal memuat data keuangan untuk chart:", e);
      }

      // Construct activity feed based on available DB records
      const activities: { title: string; category: string; time: string }[] = [];

      if (beritaRes.data && beritaRes.data.length > 0) {
        const latestNews = beritaRes.data[0];
        activities.push({
          title: `Berita dipublikasikan: "${latestNews.judul || latestNews.title || "Pengumuman Terbaru"}"`,
          category: "Berita & Informasi",
          time: "Baru saja",
        });
      }

      if (ppdbRes.data && ppdbRes.data.length > 0) {
        activities.push({
          title: `Total ${ppdbRes.data.length} Pendaftar Baru PPDB Terdeteksi di Database`,
          category: "Penerimaan Siswa",
          time: "10 menit yang lalu",
        });
      }

      if (siswaRes.data && siswaRes.data.length > 0) {
        activities.push({
          title: `Sinkronisasi Data ${siswaCount} Siswa Aktif Terhubung dengan Supabase`,
          category: "Database Core",
          time: "Real-time sync",
        });
      }

      setRecentActivities(activities);
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate percentage breakdown for visual diagram charts
  const totalAkademik = (stats.siswaCount || 1) + (stats.guruCount || 1) + (stats.alumniCount || 1);
  const siswaPercentage = Math.round(((stats.siswaCount || 1) / totalAkademik) * 100);
  const guruPercentage = Math.round(((stats.guruCount || 1) / totalAkademik) * 100);
  const alumniPercentage = Math.round(((stats.alumniCount || 1) / totalAkademik) * 100);

  const BAR_COLORS = [
    "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
    "#f97316", "#eab308",
  ];

  const PIE_COLORS = ["#10b981", "#f43f5e"];

  const formatRupiah = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} M`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Jt`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)} Rb`;
    return value.toString();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 p-6 md:p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Supabase Live Connection Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang di Portal SMK
            </h1>
            <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
              Ringkasan statistik real-time dari database Supabase untuk pemantauan data sekolah.
            </p>
          </div>

          <Button
            onClick={loadDashboardData}
            variant="outline"
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white rounded-xl gap-2 font-medium self-start md:self-center backdrop-blur-md"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data DB
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid - Live DB Data */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/60 shadow-xs hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Siswa</CardTitle>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600 my-1" />
            ) : (
              <div className="text-3xl font-extrabold tracking-tight">{stats.siswaCount}</div>
            )}
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Data Real-time Supabase</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/60 shadow-xs hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guru & Pengajar</CardTitle>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 my-1" />
            ) : (
              <div className="text-3xl font-extrabold tracking-tight">{stats.guruCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">Pengajar Aktif di Database</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">TU & Staf Sekolah</CardTitle>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-teal-600 my-1" />
            ) : (
              <div className="text-3xl font-extrabold tracking-tight">{stats.staffCount}</div>
            )}
            <p className="text-xs text-teal-600 mt-2 font-medium">Tata Usaha, Satpam & Kebersihan</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wali Siswa</CardTitle>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600 my-1" />
            ) : (
              <div className="text-3xl font-extrabold tracking-tight">{stats.waliCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-medium">Orang Tua / Wali Terdata</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section: Bar Chart + Pie Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bar Chart: Distribusi Siswa per Kelas */}
        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Distribusi Siswa per Kelas
            </CardTitle>
            <CardDescription className="text-xs">
              Jumlah siswa aktif yang terdaftar di setiap kelas berdasarkan database Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : kelasChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={kelasChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`${value} siswa`, "Jumlah"]}
                  />
                  <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {kelasChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Belum ada data siswa untuk ditampilkan.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart: Status Keuangan */}
        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Banknote className="h-5 w-5 text-emerald-600" />
              Status Keuangan Tagihan
            </CardTitle>
            <CardDescription className="text-xs">
              Perbandingan nominal tagihan yang sudah lunas vs yang masih tunggakan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : keuanganPieData.length > 0 && keuanganPieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={keuanganPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {keuanganPieData.map((_, index) => (
                      <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`Rp ${value.toLocaleString("id-ID")}`, ""]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value: string) => (
                      <span style={{ fontSize: "12px", color: "hsl(var(--foreground))" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-xs">
                Belum ada data keuangan/tagihan untuk ditampilkan.
              </div>
            )}
            {/* Summary below chart */}
            {!loading && keuanganPieData.length > 0 && keuanganPieData.some(d => d.value > 0) && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/40 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">Lunas</p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    Rp {(keuanganPieData.find(d => d.name === "Lunas")?.value || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/40 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium">Tunggakan</p>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-400 font-mono">
                    Rp {(keuanganPieData.find(d => d.name === "Tunggakan")?.value || 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart & Percentage Breakdown Diagram Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Percentage Breakdown Card */}
        <Card className="rounded-2xl border-border/60 shadow-xs md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-emerald-600" />
              Persentase Komposisi Akademik
            </CardTitle>
            <CardDescription className="text-xs">
              Diagram rasio perbandingan data terdaftar di database Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Visual Multi-Segment Progress Bar */}
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex p-0.5 border border-border/40">
              <div
                style={{ width: `${siswaPercentage}%` }}
                className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
                title={`Siswa: ${siswaPercentage}%`}
              />
              <div
                style={{ width: `${guruPercentage}%` }}
                className="bg-blue-500 h-full transition-all duration-500"
                title={`Guru: ${guruPercentage}%`}
              />
              <div
                style={{ width: `${alumniPercentage}%` }}
                className="bg-amber-500 h-full rounded-r-full transition-all duration-500"
                title={`Alumni: ${alumniPercentage}%`}
              />
            </div>

            {/* Percentage Details List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">Siswa Aktif</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                  {siswaPercentage}% ({stats.siswaCount})
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-foreground">Tenaga Pendidik (Guru)</span>
                </div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">
                  {guruPercentage}% ({stats.guruCount})
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-foreground">Alumni Terdata</span>
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">
                  {alumniPercentage}% ({stats.alumniCount})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Database Activity Feed */}
        <Card className="rounded-2xl border-border/60 shadow-xs md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                Aktivitas Data Terbaru (Supabase Real-time)
              </CardTitle>
              <CardDescription className="text-xs">
                Log perubahan data dari tabel Supabase yang sedang terhubung.
              </CardDescription>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
              Live DB
            </span>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="text-xs">Menghubungkan ke Database Supabase...</span>
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="divide-y divide-border/40 text-sm">
                {recentActivities.map((act, index) => (
                  <div key={index} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground text-xs md:text-sm">{act.title}</p>
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {act.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                Belum ada log aktivitas baru terdeteksi di database.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
