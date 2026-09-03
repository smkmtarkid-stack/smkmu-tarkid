"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, GraduationCap, Send, CheckCircle2 } from "lucide-react";

export default function TracerStudyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    tahun_lulus: new Date().getFullYear().toString(),
    jurusan: "",
    status: "Bekerja", // Bekerja, Kuliah, Wirausaha, Mencari Kerja
    nama_instansi: "",
    jabatan: "",
    pendapatan_bulanan: "< 3 Juta",
    keselarasan_bidang: "Sangat Sesuai",
    saran_masukan: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simpan ke Supabase ke tabel alumni atau tracer_study
      const { error } = await supabase.from("alumni").insert([
        {
          nama: formData.nama_lengkap,
          tahun_lulus: parseInt(formData.tahun_lulus) || new Date().getFullYear(),
          jurusan: formData.jurusan,
          status: formData.status,
          pekerjaan: `${formData.jabatan} ${formData.nama_instansi ? 'di ' + formData.nama_instansi : ''}`.trim(),
          testimoni: formData.saran_masukan,
        },
      ]);

      if (error) {
        console.error("Failed to submit tracer study", error);
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
            <GraduationCap className="h-7 w-7 text-emerald-200" />
          </div>
          <span className="px-3 py-1 bg-emerald-500/30 text-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            Portal Alumni
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Tracer Study Alumni</h1>
        <p className="text-emerald-100 mt-2 max-w-2xl text-sm sm:text-base">
          Bantu sekolah meningkatkan kualitas pendidikan dengan mengisi penelusuran rekam jejak kelulusan dan karir Anda.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Terima Kasih atas Partisipasi Anda!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
            Data Tracer Study Anda telah berhasil disimpan. Kontribusi Anda sangat berharga bagi perkembangan SMK Muhammadiyah Tarogong Kidul.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-md"
          >
            Update / Isi Lagi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 border-b pb-4 border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" /> Form Data Karir & Status Lulusan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap Anda"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tahun Lulus *
              </label>
              <input
                type="number"
                required
                placeholder="Contoh: 2024"
                value={formData.tahun_lulus}
                onChange={(e) => setFormData({ ...formData, tahun_lulus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Jurusan / Keahlian *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Teknik Komputer dan Jaringan"
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status Saat Ini *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Bekerja">Bekerja (Karyawan/Pegawai)</option>
                <option value="Kuliah">Melanjutkan Pendidikan (Kuliah)</option>
                <option value="Wirausaha">Wirausaha / Usaha Mandiri</option>
                <option value="Mencari Kerja">Mencari Pekerjaan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Tempat Bekerja / Perusahaan / Kampus
              </label>
              <input
                type="text"
                placeholder="Contoh: PT Telkom Indonesia / Universitas Padjadjaran"
                value={formData.nama_instansi}
                onChange={(e) => setFormData({ ...formData, nama_instansi: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Jabatan / Posisi / Program Studi
              </label>
              <input
                type="text"
                placeholder="Contoh: Network Engineer / Mahasiswa Teknik Informatika"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Keselarasan Pekerjaan dengan Bidang Keahlian SMK
              </label>
              <select
                value={formData.keselarasan_bidang}
                onChange={(e) => setFormData({ ...formData, keselarasan_bidang: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Sangat Sesuai">Sangat Sesuai</option>
                <option value="Sesuai">Sesuai</option>
                <option value="Cukup">Cukup Sesuai</option>
                <option value="Kurang Sesuai">Kurang Sesuai / Tidak Sesuai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Estimasi Pendapatan Bulanan (Opsional)
              </label>
              <select
                value={formData.pendapatan_bulanan}
                onChange={(e) => setFormData({ ...formData, pendapatan_bulanan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="< 3 Juta">&lt; Rp 3.000.000</option>
                <option value="3 - 5 Juta">Rp 3.000.000 - Rp 5.000.000</option>
                <option value="5 - 10 Juta">Rp 5.000.000 - Rp 10.000.000</option>
                <option value="> 10 Juta">&gt; Rp 10.000.000</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Saran & Masukan untuk Perkembangan Sekolah
            </label>
            <textarea
              rows={4}
              placeholder="Berikan saran untuk pengembangan kurikulum, fasilitas, atau saran bagi adik-adik siswa SMK Muhammadiyah..."
              value={formData.saran_masukan}
              onChange={(e) => setFormData({ ...formData, saran_masukan: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Menyimpan Data..." : "Kirim Data Tracer Study"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
