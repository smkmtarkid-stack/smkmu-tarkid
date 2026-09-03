"use client";

import { useState } from "react";
import { GraduationCap, Calendar, FileText, Send, CheckCircle2, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PPDBPage() {
  const [activeTab, setActiveTab] = useState<"info" | "form">("form");
  const [loading, setLoading] = useState(false);
  const [registeredCode, setRegisteredCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nisn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    asal_sekolah: "",
    pilihan_jurusan: "Teknik Komputer dan Jaringan",
    nama_ortu: "",
    no_hp_wa: "",
    alamat: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generateNoPendaftaran = "PPDB-" + Math.floor(100000 + Math.random() * 900000);
      
      const { error } = await supabase.from("ppdb").insert([
        {
          no_pendaftaran: generateNoPendaftaran,
          nama_lengkap: formData.nama_lengkap,
          nisn: formData.nisn,
          asal_sekolah: formData.asal_sekolah,
          jurusan: formData.pilihan_jurusan,
          no_hp: formData.no_hp_wa,
          status: "Menunggu",
        },
      ]);

      if (error) {
        console.error("Gagal mendaftar PPDB:", error);
      }
      
      setRegisteredCode(generateNoPendaftaran);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            PPDB Online SMK Muhammadiyah Tarogong Kidul
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Penerimaan Peserta Didik Baru Tahun Ajaran 2026/2027. Mari bergabung menjadi bagian dari generasi berprestasi & berakhlak mulia.
          </p>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                activeTab === "form"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Formulir Pendaftaran Online
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                activeTab === "info"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Syarat & Alur Pendaftaran
            </button>
          </div>
        </div>

        {/* Success Confirmation Modal / Banner */}
        {registeredCode ? (
          <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Pendaftaran Berhasil Terkirim!
            </h2>
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 max-w-sm mx-auto">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">
                Nomor Pendaftaran Anda
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                {registeredCode}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Harap simpan Nomor Pendaftaran ini. Tim PPDB sekolah akan menghubungi Anda melalui WhatsApp/Telepon untuk verifikasi berkas selanjutnya.
            </p>
            <button
              onClick={() => {
                setRegisteredCode(null);
                setFormData({
                  nama_lengkap: "",
                  nisn: "",
                  tempat_lahir: "",
                  tanggal_lahir: "",
                  jenis_kelamin: "Laki-laki",
                  asal_sekolah: "",
                  pilihan_jurusan: "Teknik Komputer dan Jaringan",
                  nama_ortu: "",
                  no_hp_wa: "",
                  alamat: "",
                });
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md"
            >
              Daftarkan Calon Siswa Lain
            </button>
          </div>
        ) : activeTab === "form" ? (
          /* Form Pendaftaran */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Data Calon Peserta Didik
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Isi formulir dengan data yang benar sesuai ijazah/akta kelahiran.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NISN (Nomor Induk Siswa Nasional) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="10 digit NISN"
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asal Sekolah (SMP/MTs) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMPN 1 Garut"
                  value={formData.asal_sekolah}
                  onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilihan Jurusan / Program Keahlian *
                </label>
                <select
                  value={formData.pilihan_jurusan}
                  onChange={(e) => setFormData({ ...formData, pilihan_jurusan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Teknik Komputer dan Jaringan">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="Teknik Kendaraan Ringan">Teknik Kendaraan Ringan (TKR)</option>
                  <option value="Teknik dan Bisnis Sepeda Motor">Teknik & Bisnis Sepeda Motor (TBSM)</option>
                  <option value="Akuntansi dan Keuangan Lembaga">Akuntansi & Keuangan (AKL)</option>
                  <option value="Manajemen Perkantoran">Manajemen Perkantoran (MPLK)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Orang Tua / Wali *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Ayah/Ibu/Wali"
                  value={formData.nama_ortu}
                  onChange={(e) => setFormData({ ...formData, nama_ortu: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor HP / WhatsApp Aktif *
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Lengkap *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Alamat domisili saat ini (RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten)"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Mengirim Pendaftaran..." : "Kirim Formulir PPDB"}
              </button>
            </div>
          </form>
        ) : (
          /* Info & Syarat Pendaftaran */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Syarat & Alur Pendaftaran PPDB
            </h2>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">1. Persyaratan Berkas Pendaftaran:</h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li>Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs (2 lembar)</li>
                  <li>Fotokopi Kartu Keluarga (KK) & Akta Kelahiran (2 lembar)</li>
                  <li>Fotokopi KTP Orang Tua / Wali (2 lembar)</li>
                  <li>Pas Foto 3x4 Latar Merah (4 lembar)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">2. Alur Pendaftaran:</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                  <li>Isi Formulir Pendaftaran Online di tab &quot;Formulir Pendaftaran Online&quot;.</li>
                  <li>Simpan Kode / Nomor Pendaftaran yang Anda dapatkan.</li>
                  <li>Verifikasi berkas fisik langsung di Sekretariat PPDB SMK Muhammadiyah Tarogong Kidul.</li>
                  <li>Mengikuti Tes Seleksi Wawancara & Minat Bakat.</li>
                </ol>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setActiveTab("form")}
                  className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  Isi Formulir Sekarang <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
