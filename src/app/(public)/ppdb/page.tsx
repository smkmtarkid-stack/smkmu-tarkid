"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  Send,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Search,
  Clock,
  XCircle,
  Copy,
  Printer,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface JurusanOption {
  id?: string;
  nama: string;
}

interface PPDBRecord {
  id: string;
  no_pendaftaran: string;
  nama_lengkap: string;
  nisn?: string;
  asal_sekolah?: string;
  jurusan?: string;
  nama_ortu?: string;
  no_hp?: string;
  alamat?: string;
  status?: string;
  catatan?: string;
  created_at?: string;
}

const DEFAULT_JURUSAN = [
  "Teknik Komputer dan Jaringan",
  "Rekayasa Perangkat Lunak",
  "Teknik Kendaraan Ringan",
  "Teknik dan Bisnis Sepeda Motor",
  "Akuntansi dan Keuangan Lembaga",
  "Manajemen Perkantoran dan Layanan Bisnis",
];

export default function PPDBPage() {
  const [activeTab, setActiveTab] = useState<"form" | "status" | "info">("form");
  const [loading, setLoading] = useState(false);
  const [jurusanOptions, setJurusanOptions] = useState<string[]>(DEFAULT_JURUSAN);
  const [registeredData, setRegisteredData] = useState<PPDBRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nisn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    asal_sekolah: "",
    pilihan_jurusan: DEFAULT_JURUSAN[0],
    nama_ortu: "",
    no_hp_wa: "",
    alamat: "",
  });

  // Check Status State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<PPDBRecord | null>(null);
  const [searchExecuted, setSearchExecuted] = useState(false);

  // Load Jurusan from DB if available
  useEffect(() => {
    async function fetchJurusan() {
      try {
        const { data, error } = await supabase
          .from("jurusan")
          .select("nama")
          .order("nama", { ascending: true });

        if (!error && data && data.length > 0) {
          const list = data.map((j: JurusanOption) => j.nama).filter(Boolean);
          if (list.length > 0) {
            setJurusanOptions(list);
            setFormData((prev) => ({
              ...prev,
              pilihan_jurusan: list[0],
            }));
          }
        }
      } catch (err) {
        console.warn("Gagal memuat daftar jurusan dari DB, menggunakan default:", err);
      }
    }
    fetchJurusan();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentYear = new Date().getFullYear();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const generatedNoPendaftaran = `PPDB-${currentYear}-${randomCode}`;

      const payload = {
        no_pendaftaran: generatedNoPendaftaran,
        nama_lengkap: formData.nama_lengkap.trim(),
        nisn: formData.nisn.trim() || null,
        tempat_lahir: formData.tempat_lahir.trim() || null,
        tanggal_lahir: formData.tanggal_lahir || null,
        jenis_kelamin: formData.jenis_kelamin,
        asal_sekolah: formData.asal_sekolah.trim(),
        jurusan: formData.pilihan_jurusan,
        nama_ortu: formData.nama_ortu.trim() || null,
        no_hp: formData.no_hp_wa.trim(),
        alamat: formData.alamat.trim(),
        status: "Menunggu",
      };

      const { data, error } = await supabase
        .from("ppdb")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Gagal mendaftar PPDB:", error);
        toast.error(`Pendaftaran gagal dikirim: ${error.message}`);
        return;
      }

      toast.success("Pendaftaran PPDB berhasil dikirim!");
      setRegisteredData((data as PPDBRecord) || { ...payload, id: generatedNoPendaftaran });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      console.error(err);
      toast.error(`Terjadi kesalahan: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKeyword.trim();
    if (!query) {
      toast.error("Masukkan Nomor Pendaftaran atau NISN");
      return;
    }

    setSearchLoading(true);
    setSearchExecuted(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase
        .from("ppdb")
        .select("*")
        .or(`no_pendaftaran.ilike.%${query}%,nisn.ilike.%${query}%`)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Gagal memeriksa status pendaftaran.");
      } else {
        setSearchResult((data as PPDBRecord) || null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal terhubung ke database.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Nomor pendaftaran berhasil disalin!");
  };

  const resetForm = () => {
    setRegisteredData(null);
    setFormData({
      nama_lengkap: "",
      nisn: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: "Laki-laki",
      asal_sekolah: "",
      pilihan_jurusan: jurusanOptions[0] || "",
      nama_ortu: "",
      no_hp_wa: "",
      alamat: "",
    });
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "Menunggu").toLowerCase();
    if (s.includes("terima") || s === "lulus") {
      return {
        label: "DITERIMA",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
        icon: CheckCircle2,
        desc: "Selamat! Calon siswa dinyatakan DITERIMA di SMK Muhammadiyah Tarogong Kidul. Harap segera melakukan daftar ulang.",
      };
    }
    if (s.includes("verifikasi") || s.includes("proses")) {
      return {
        label: "TERVERIFIKASI",
        bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300",
        icon: UserCheck,
        desc: "Berkas pendaftaran telah terverifikasi oleh panitia. Silakan pantau pengumuman jadwal wawancara/seleksi.",
      };
    }
    if (s.includes("cadangan")) {
      return {
        label: "CADANGAN",
        bg: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300",
        icon: Clock,
        desc: "Calon siswa masuk dalam daftar cadangan. Panitia akan menghubungi jika kuota reguler tersedia.",
      };
    }
    if (s.includes("tolak") || s.includes("gugur")) {
      return {
        label: "TIDAK DITERIMA",
        bg: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300",
        icon: XCircle,
        desc: "Mohon maaf, pendaftaran belum dapat diterima untuk gelombang ini.",
      };
    }
    return {
      label: "MENUNGGU VERIFIKASI",
      bg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
      icon: Clock,
      desc: "Formulir pendaftaran telah masuk ke sistem. Panitia sedang memverifikasi data dan berkas Anda.",
    };
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            PPDB Online SMK Muhammadiyah Tarogong Kidul
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Penerimaan Peserta Didik Baru. Mari bergabung menjadi bagian dari generasi berprestasi, kompeten, dan berakhlak mulia.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                activeTab === "form"
                  ? "bg-emerald-600 text-white shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                activeTab === "status"
                  ? "bg-emerald-600 text-white shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Cek Status Pendaftaran
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                activeTab === "info"
                  ? "bg-emerald-600 text-white shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Syarat & Alur Pendaftaran
            </button>
          </div>
        </div>

        {/* Tab 1: Formulir Pendaftaran */}
        {activeTab === "form" && (
          <div>
            {registeredData ? (
              /* Success Confirmation Banner */
              <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Pendaftaran Berhasil Dikirim!
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Data pendaftaran Anda telah tersimpan di sistem SMK Muhammadiyah Tarogong Kidul.
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 max-w-md mx-auto space-y-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300 block">
                    Nomor Pendaftaran Resmi
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 tracking-wider font-mono">
                      {registeredData.no_pendaftaran}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(registeredData.no_pendaftaran)}
                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 transition"
                      title="Salin Nomor Pendaftaran"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-left border-t border-emerald-200 dark:border-emerald-800/80 pt-3 space-y-1 text-slate-600 dark:text-slate-300">
                    <div><strong>Nama:</strong> {registeredData.nama_lengkap}</div>
                    <div><strong>Jurusan:</strong> {registeredData.jurusan}</div>
                    <div><strong>Asal Sekolah:</strong> {registeredData.asal_sekolah}</div>
                    <div><strong>No. Kontak:</strong> {registeredData.no_hp}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Harap simpan atau catat <strong>Nomor Pendaftaran</strong> ini untuk pengecekan status verifikasi dan berkas. Tim panitia PPDB akan menghubungi nomor WhatsApp Anda.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition inline-flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" /> Cetak Bukti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchKeyword(registeredData.no_pendaftaran);
                      setActiveTab("status");
                      setSearchResult(registeredData);
                      setSearchExecuted(true);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition inline-flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Cek Status Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Daftar Baru
                  </button>
                </div>
              </div>
            ) : (
              /* Formulir Input */
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8"
              >
                {/* Bagian 1: Data Diri */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      1. Data Calon Siswa
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Fikri"
                        value={formData.nama_lengkap}
                        onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        NISN (Nomor Induk Siswa Nasional)
                      </label>
                      <input
                        type="text"
                        placeholder="10 digit angka NISN"
                        value={formData.nisn}
                        onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Jenis Kelamin *
                      </label>
                      <select
                        value={formData.jenis_kelamin}
                        onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Tempat Lahir
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Garut"
                        value={formData.tempat_lahir}
                        onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Sekolah Asal & Pilihan Jurusan */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      2. Asal Sekolah & Pilihan Jurusan
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Asal Sekolah (SMP / MTs) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SMPN 1 Tarogong Kidul"
                        value={formData.asal_sekolah}
                        onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Pilihan Kompetensi Keahlian (Jurusan) *
                      </label>
                      <select
                        value={formData.pilihan_jurusan}
                        onChange={(e) => setFormData({ ...formData, pilihan_jurusan: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {jurusanOptions.map((j, idx) => (
                          <option key={idx} value={j}>
                            {j}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Data Kontak & Orang Tua */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      3. Data Orang Tua & Kontak
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Nama Orang Tua / Wali *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Ayah / Ibu / Wali"
                        value={formData.nama_ortu}
                        onChange={(e) => setFormData({ ...formData, nama_ortu: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        No. HP / WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formData.no_hp_wa}
                        onChange={(e) => setFormData({ ...formData, no_hp_wa: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Alamat Tempat Tinggal Lengkap *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Alamat domisili (RT/RW, Kampung/Desa, Kecamatan, Kabupaten)"
                        value={formData.alamat}
                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pastikan nomor WhatsApp aktif untuk menerima informasi lanjutan.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengirim Pendaftaran...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Formulir PPDB
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Cek Status Pendaftaran */}
        {activeTab === "status" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" /> Cek Status Pendaftaran
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
                Masukkan <strong>Nomor Pendaftaran</strong> (contoh: <code>PPDB-2026-1234</code>) atau <strong>NISN</strong> yang Anda gunakan saat mendaftar.
              </p>

              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PPDB-2026-1234 atau 0061234567"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
                </button>
              </form>
            </div>

            {/* Hasil Pencarian */}
            {searchLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mencari data pendaftar...</p>
              </div>
            ) : searchExecuted && searchResult ? (
              (() => {
                const badge = getStatusBadge(searchResult.status);
                const BadgeIcon = badge.icon;
                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                          Data Pendaftar Ditemukan
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                          {searchResult.nama_lengkap}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                          No. Reg: {searchResult.no_pendaftaran}
                        </p>
                      </div>

                      <div className={`px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 w-fit ${badge.bg}`}>
                        <BadgeIcon className="w-4 h-4" />
                        {badge.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-muted-foreground block">Pilihan Jurusan</span>
                        <span className="font-semibold">{searchResult.jurusan || "-"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-muted-foreground block">Asal Sekolah</span>
                        <span className="font-semibold">{searchResult.asal_sekolah || "-"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-muted-foreground block">NISN</span>
                        <span className="font-semibold font-mono">{searchResult.nisn || "-"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-xs text-muted-foreground block">Kontak Terdaftar</span>
                        <span className="font-semibold font-mono">{searchResult.no_hp || "-"}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Keterangan Panitia:
                      </h4>
                      <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                        {searchResult.catatan || badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : searchExecuted && !searchResult ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">Data Tidak Ditemukan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Pastikan Nomor Pendaftaran atau NISN yang Anda masukkan sudah sesuai saat pendaftaran awal.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 3: Syarat & Alur Pendaftaran */}
        {activeTab === "info" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-7 h-7 text-emerald-600" /> Syarat & Prosedur PPDB
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Informasi resmi persyaratan berkas dan alur pendaftaran peserta didik baru SMK Muhammadiyah Tarogong Kidul.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-emerald-600" /> 1. Persyaratan Berkas Pendaftaran
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-2">
                  <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs (2 lembar dilegalisir)</li>
                  <li>Fotokopi Kartu Keluarga (KK) dan Akta Kelahiran (2 lembar)</li>
                  <li>Fotokopi KTP Orang Tua / Wali (2 lembar)</li>
                  <li>Pas Foto 3x4 berwarna terbaru (4 lembar latar belakang merah)</li>
                  <li>Fotokopi Kartu KIP / PKH / KKS (jika memiliki, untuk program beasiswa)</li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                  <ArrowRight className="w-4 h-4 text-emerald-600" /> 2. Alur Pendaftaran
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-2 leading-relaxed">
                  <li>
                    <strong>Pendaftaran Online:</strong> Isi formulir lengkap di tab &quot;Formulir Pendaftaran&quot; pada website ini.
                  </li>
                  <li>
                    <strong>Simpan Nomor Pendaftaran:</strong> Catat atau cetak bukti nomor pendaftaran resmi yang muncul di layar.
                  </li>
                  <li>
                    <strong>Verifikasi Berkas:</strong> Datang langsung ke Sekretariat PPDB SMK Muhammadiyah Tarogong Kidul dengan membawa berkas fisik.
                  </li>
                  <li>
                    <strong>Wawancara & Tes Minat Bakat:</strong> Calon siswa mengikuti tes peminatan sesuai kompetensi keahlian yang dipilih.
                  </li>
                  <li>
                    <strong>Pengumuman & Daftar Ulang:</strong> Cek status di tab &quot;Cek Status Pendaftaran&quot; dan lakukan registrasi ulang.
                  </li>
                </ol>
              </div>

              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Butuh Bantuan atau Informasi Lebih Lanjut?
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Hubungi Sekretariat Panitia PPDB di Kampus SMK Muhammadiyah Tarogong Kidul.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="mt-3 sm:mt-0 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md whitespace-nowrap inline-flex items-center gap-2"
                >
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
