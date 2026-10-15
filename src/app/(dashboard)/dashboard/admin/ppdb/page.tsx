"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Trash2,
  Edit,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  GraduationCap,
  Eye,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface PPDBApplicant {
  id: string;
  no_pendaftaran: string;
  nama_lengkap: string;
  nisn?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  asal_sekolah?: string;
  jurusan?: string;
  nama_ortu?: string;
  no_hp?: string;
  alamat?: string;
  status: string;
  catatan?: string;
  created_at?: string;
}

const STATUS_OPTIONS = [
  "Menunggu",
  "Terverifikasi",
  "Diterima",
  "Cadangan",
  "Ditolak",
] as const;

export default function PpdbAdminPage() {
  const [data, setData] = useState<PPDBApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJurusan, setFilterJurusan] = useState("all");
  const [jurusanList, setJurusanList] = useState<string[]>([]);

  // Dialog State
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRow, setEditingRow] = useState<PPDBApplicant | null>(null);

  // Detail Dialog State
  const [detailRow, setDetailRow] = useState<PPDBApplicant | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Delete Dialog State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState<PPDBApplicant | null>(null);

  // Form Fields
  const [formValues, setFormValues] = useState({
    no_pendaftaran: "",
    nama_lengkap: "",
    nisn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    asal_sekolah: "",
    jurusan: "",
    nama_ortu: "",
    no_hp: "",
    alamat: "",
    status: "Menunggu",
    catatan: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: ppdbData, error } = await supabase
        .from("ppdb")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal memuat data PPDB:", error);
        toast.error("Gagal memuat data PPDB: " + error.message);
      } else {
        setData((ppdbData as PPDBApplicant[]) || []);
      }

      // Load Jurusan options
      const { data: jurusanData } = await supabase
        .from("jurusan")
        .select("nama")
        .order("nama", { ascending: true });

      if (jurusanData && jurusanData.length > 0) {
        const list = jurusanData.map((j) => j.nama).filter(Boolean);
        setJurusanList(list);
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        (item.nama_lengkap || "").toLowerCase().includes(q) ||
        (item.no_pendaftaran || "").toLowerCase().includes(q) ||
        (item.nisn || "").toLowerCase().includes(q) ||
        (item.asal_sekolah || "").toLowerCase().includes(q);

      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      const matchesJurusan = filterJurusan === "all" || item.jurusan === filterJurusan;

      return matchesSearch && matchesStatus && matchesJurusan;
    });
  }, [data, search, filterStatus, filterJurusan]);

  // Statistics
  const stats = useMemo(() => {
    const total = data.length;
    const menunggu = data.filter((d) => (d.status || "").toLowerCase().includes("menunggu")).length;
    const terverifikasi = data.filter((d) => (d.status || "").toLowerCase().includes("verifikasi")).length;
    const diterima = data.filter((d) => (d.status || "").toLowerCase().includes("terima") || d.status === "Lulus").length;
    const ditolak = data.filter((d) => (d.status || "").toLowerCase().includes("tolak") || (d.status || "").toLowerCase().includes("cadangan")).length;
    return { total, menunggu, terverifikasi, diterima, ditolak };
  }, [data]);

  // Export to Excel
  const handleExportExcel = () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const exportRows = filteredData.map((d, index) => ({
      No: index + 1,
      "No. Pendaftaran": d.no_pendaftaran || "-",
      "Nama Lengkap": d.nama_lengkap,
      NISN: d.nisn || "-",
      "Jenis Kelamin": d.jenis_kelamin || "-",
      "Tempat Lahir": d.tempat_lahir || "-",
      "Tanggal Lahir": d.tanggal_lahir || "-",
      "Asal Sekolah": d.asal_sekolah || "-",
      "Pilihan Jurusan": d.jurusan || "-",
      "Nama Orang Tua": d.nama_ortu || "-",
      "Nomor WhatsApp": d.no_hp || "-",
      Alamat: d.alamat || "-",
      Status: d.status || "Menunggu",
      "Catatan Panitia": d.catatan || "-",
      "Tanggal Daftar": d.created_at ? new Date(d.created_at).toLocaleString("id-ID") : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar PPDB");
    XLSX.writeFile(workbook, `PPDB_SMK_Muhammadiyah_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Data PPDB berhasil diekspor ke Excel!");
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingRow(null);
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setFormValues({
      no_pendaftaran: `PPDB-${year}-${randomCode}`,
      nama_lengkap: "",
      nisn: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "Laki-laki",
      asal_sekolah: "",
      jurusan: jurusanList[0] || "",
      nama_ortu: "",
      no_hp: "",
      alamat: "",
      status: "Menunggu",
      catatan: "",
    });
    setFormOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (item: PPDBApplicant) => {
    setEditingRow(item);
    setFormValues({
      no_pendaftaran: item.no_pendaftaran || "",
      nama_lengkap: item.nama_lengkap || "",
      nisn: item.nisn || "",
      tempat_lahir: item.tempat_lahir || "",
      tanggal_lahir: item.tanggal_lahir || "",
      jenis_kelamin: item.jenis_kelamin || "Laki-laki",
      asal_sekolah: item.asal_sekolah || "",
      jurusan: item.jurusan || "",
      nama_ortu: item.nama_ortu || "",
      no_hp: item.no_hp || "",
      alamat: item.alamat || "",
      status: item.status || "Menunggu",
      catatan: item.catatan || "",
    });
    setFormOpen(true);
  };

  // Quick Status Change from Table
  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("ppdb")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Status pendaftaran diperbarui menjadi: ${newStatus}`);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status";
      toast.error(msg);
    }
  };

  // Submit Form (Create or Update)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.nama_lengkap.trim()) {
      toast.error("Nama lengkap wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        no_pendaftaran: formValues.no_pendaftaran.trim(),
        nama_lengkap: formValues.nama_lengkap.trim(),
        nisn: formValues.nisn.trim() || null,
        tempat_lahir: formValues.tempat_lahir.trim() || null,
        tanggal_lahir: formValues.tanggal_lahir || null,
        jenis_kelamin: formValues.jenis_kelamin,
        asal_sekolah: formValues.asal_sekolah.trim() || null,
        jurusan: formValues.jurusan || null,
        nama_ortu: formValues.nama_ortu.trim() || null,
        no_hp: formValues.no_hp.trim() || null,
        alamat: formValues.alamat.trim() || null,
        status: formValues.status,
        catatan: formValues.catatan.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingRow) {
        // UPDATE
        const { error } = await supabase
          .from("ppdb")
          .update(payload)
          .eq("id", editingRow.id);

        if (error) throw error;
        toast.success("Data pendaftar berhasil diperbarui!");
      } else {
        // INSERT
        const { error } = await supabase.from("ppdb").insert([payload]);
        if (error) throw error;
        toast.success("Pendaftar baru berhasil ditambahkan!");
      }

      setFormOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Record
  const handleDelete = async () => {
    if (!deletingRow) return;
    try {
      const { error } = await supabase.from("ppdb").delete().eq("id", deletingRow.id);
      if (error) throw error;
      toast.success(`Data pendaftar ${deletingRow.nama_lengkap} berhasil dihapus!`);
      setDeleteOpen(false);
      setDeletingRow(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(msg);
    }
  };

  const getStatusStyle = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("terima") || s === "lulus") {
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300";
    }
    if (s.includes("verifikasi")) {
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300";
    }
    if (s.includes("cadangan")) {
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300";
    }
    if (s.includes("tolak")) {
      return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300";
    }
    return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Penerimaan Peserta Didik Baru (PPDB)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data calon siswa baru yang mendaftar secara online maupun offline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={data.length === 0}>
            <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
            Export Excel
          </Button>
          <Button size="sm" onClick={handleOpenAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pendaftar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Pendaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Semua data masuk</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Menunggu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.menunggu}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Belum diverifikasi</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Terverifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.terverifikasi}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Berkas lengkap</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Diterima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.diterima}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Lulus seleksi</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-xs col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Cadangan / Tolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.ditolak}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Cadangan / Gugur</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-2xl border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Daftar Calon Peserta Didik Baru
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Total {filteredData.length} pendaftar ditampilkan
              </CardDescription>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, NISN, no reg..."
                  className="pl-9 h-9 text-xs rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 text-xs w-[140px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUS_OPTIONS.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {jurusanList.length > 0 && (
                <Select value={filterJurusan} onValueChange={setFilterJurusan}>
                  <SelectTrigger className="h-9 text-xs w-[160px] rounded-xl">
                    <SelectValue placeholder="Jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jurusan</SelectItem>
                    {jurusanList.map((j) => (
                      <SelectItem key={j} value={j}>
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">No. Reg</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Jurusan</th>
                  <th className="py-3 px-4">Asal Sekolah</th>
                  <th className="py-3 px-4">Kontak (WhatsApp)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tgl Daftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                      Memuat data PPDB...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      Tidak ada data pendaftar yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => {
                    const cleanPhone = (row.no_hp || "").replace(/\D/g, "");
                    const waFormatted = cleanPhone.startsWith("0")
                      ? "62" + cleanPhone.slice(1)
                      : cleanPhone;

                    return (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                          {row.no_pendaftaran || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {row.nama_lengkap}
                          </div>
                          {row.nisn && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              NISN: {row.nisn}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium whitespace-nowrap">
                          {row.jurusan || "-"}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {row.asal_sekolah || "-"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {row.no_hp ? (
                            <a
                              href={`https://wa.me/${waFormatted}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium"
                              title="Kirim pesan WhatsApp"
                            >
                              <Phone className="h-3 w-3" />
                              {row.no_hp}
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Select
                            value={row.status || "Menunggu"}
                            onValueChange={(val) => handleQuickStatusChange(row.id, val)}
                          >
                            <SelectTrigger className={`h-7 text-[11px] font-semibold border rounded-lg w-[130px] ${getStatusStyle(row.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((st) => (
                                <SelectItem key={st} value={st}>
                                  {st}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setDetailRow(row);
                                setDetailOpen(true);
                              }}
                              title="Lihat Detail Lengkap"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-600 hover:text-blue-700"
                              onClick={() => handleOpenEdit(row)}
                              title="Edit Data"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-rose-600 hover:text-rose-700"
                              onClick={() => {
                                setDeletingRow(row);
                                setDeleteOpen(true);
                              }}
                              title="Hapus Data"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Form: Tambah / Edit */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRow ? "Edit Data Pendaftar PPDB" : "Tambah Pendaftar PPDB Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Lengkapi informasi calon peserta didik baru.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="no_pendaftaran" className="text-xs">
                  Nomor Pendaftaran
                </Label>
                <Input
                  id="no_pendaftaran"
                  required
                  value={formValues.no_pendaftaran}
                  onChange={(e) =>
                    setFormValues({ ...formValues, no_pendaftaran: e.target.value })
                  }
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-xs">
                  Status Pendaftaran
                </Label>
                <Select
                  value={formValues.status}
                  onValueChange={(val) => setFormValues({ ...formValues, status: val })}
                >
                  <SelectTrigger id="status" className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="nama_lengkap" className="text-xs">
                  Nama Lengkap Siswa *
                </Label>
                <Input
                  id="nama_lengkap"
                  required
                  placeholder="Nama calon siswa"
                  value={formValues.nama_lengkap}
                  onChange={(e) =>
                    setFormValues({ ...formValues, nama_lengkap: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="nisn" className="text-xs">
                  NISN
                </Label>
                <Input
                  id="nisn"
                  placeholder="10 digit NISN"
                  value={formValues.nisn}
                  onChange={(e) => setFormValues({ ...formValues, nisn: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="jenis_kelamin" className="text-xs">
                  Jenis Kelamin
                </Label>
                <Select
                  value={formValues.jenis_kelamin}
                  onValueChange={(val) => setFormValues({ ...formValues, jenis_kelamin: val })}
                >
                  <SelectTrigger id="jenis_kelamin" className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tempat_lahir" className="text-xs">
                  Tempat Lahir
                </Label>
                <Input
                  id="tempat_lahir"
                  placeholder="Kota / Kabupaten"
                  value={formValues.tempat_lahir}
                  onChange={(e) =>
                    setFormValues({ ...formValues, tempat_lahir: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="tanggal_lahir" className="text-xs">
                  Tanggal Lahir
                </Label>
                <Input
                  id="tanggal_lahir"
                  type="date"
                  value={formValues.tanggal_lahir}
                  onChange={(e) =>
                    setFormValues({ ...formValues, tanggal_lahir: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="asal_sekolah" className="text-xs">
                  Asal Sekolah (SMP/MTs)
                </Label>
                <Input
                  id="asal_sekolah"
                  placeholder="Contoh: SMPN 1 Garut"
                  value={formValues.asal_sekolah}
                  onChange={(e) =>
                    setFormValues({ ...formValues, asal_sekolah: e.target.value })
                  }
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="jurusan" className="text-xs">
                  Pilihan Jurusan
                </Label>
                <Input
                  id="jurusan"
                  placeholder="Pilihan jurusan"
                  value={formValues.jurusan}
                  onChange={(e) => setFormValues({ ...formValues, jurusan: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="nama_ortu" className="text-xs">
                  Nama Orang Tua / Wali
                </Label>
                <Input
                  id="nama_ortu"
                  placeholder="Nama ayah / ibu"
                  value={formValues.nama_ortu}
                  onChange={(e) => setFormValues({ ...formValues, nama_ortu: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <Label htmlFor="no_hp" className="text-xs">
                  No. HP / WhatsApp
                </Label>
                <Input
                  id="no_hp"
                  placeholder="081234567890"
                  value={formValues.no_hp}
                  onChange={(e) => setFormValues({ ...formValues, no_hp: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="alamat" className="text-xs">
                  Alamat Lengkap
                </Label>
                <Textarea
                  id="alamat"
                  rows={2}
                  placeholder="Alamat domisili calon siswa"
                  value={formValues.alamat}
                  onChange={(e) => setFormValues({ ...formValues, alamat: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="catatan" className="text-xs">
                  Catatan Panitia (Dapat dilihat siswa saat cek status)
                </Label>
                <Textarea
                  id="catatan"
                  rows={2}
                  placeholder="Keterangan jadwal wawancara, berkas yang kurang, dll."
                  value={formValues.catatan}
                  onChange={(e) => setFormValues({ ...formValues, catatan: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Pendaftar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Detail Lengkap */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Detail Calon Siswa
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              {detailRow?.no_pendaftaran}
            </DialogDescription>
          </DialogHeader>

          {detailRow && (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Nama Lengkap:</span>
                  <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{detailRow.nama_lengkap}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">NISN:</span>
                  <span className="col-span-2 font-mono">{detailRow.nisn || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">TTL:</span>
                  <span className="col-span-2">
                    {detailRow.tempat_lahir || "-"}, {detailRow.tanggal_lahir || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Jenis Kelamin:</span>
                  <span className="col-span-2">{detailRow.jenis_kelamin || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Asal Sekolah:</span>
                  <span className="col-span-2">{detailRow.asal_sekolah || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Pilihan Jurusan:</span>
                  <span className="col-span-2 font-semibold text-emerald-700 dark:text-emerald-400">
                    {detailRow.jurusan || "-"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Nama Ortu / Wali:</span>
                  <span className="col-span-2">{detailRow.nama_ortu || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Kontak HP / WA:</span>
                  <span className="col-span-2 font-mono">{detailRow.no_hp || "-"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Alamat:</span>
                  <span className="col-span-2">{detailRow.alamat || "-"}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Status Pendaftaran:</span>
                  <span className={`col-span-2 font-bold px-2 py-0.5 rounded text-[11px] w-fit ${getStatusStyle(detailRow.status)}`}>
                    {detailRow.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Catatan Panitia:</span>
                  <span className="col-span-2 italic text-slate-700 dark:text-slate-300">
                    {detailRow.catatan || "Belum ada catatan"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground font-medium">Waktu Daftar:</span>
                  <span className="col-span-2">
                    {detailRow.created_at
                      ? new Date(detailRow.created_at).toLocaleString("id-ID")
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDetailOpen(false);
                if (detailRow) handleOpenEdit(detailRow);
              }}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit Data
            </Button>
            <Button size="sm" onClick={() => setDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Hapus Data Pendaftar?
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Data calon siswa <strong>{deletingRow?.nama_lengkap}</strong> (
              <code>{deletingRow?.no_pendaftaran}</code>) akan dihapus permanen dari sistem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
