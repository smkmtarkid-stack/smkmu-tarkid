"use client";

import { useState } from "react";
import { MessageSquareQuote, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AlumniTestimoniPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    tahun_lulus: new Date().getFullYear().toString(),
    jurusan: "",
    pekerjaan: "",
    testimoni: "",
    rating: "5",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("alumni").insert([
        {
          nama: formData.nama,
          tahun_lulus: parseInt(formData.tahun_lulus) || new Date().getFullYear(),
          jurusan: formData.jurusan,
          pekerjaan: formData.pekerjaan,
          testimoni: formData.testimoni,
        },
      ]);
      if (error) console.error("Error submitting testimoni", error);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
            <MessageSquareQuote className="h-6 w-6 text-amber-100" />
          </div>
          <span className="px-3 py-1 bg-amber-400/30 text-amber-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            Testimoni Alumni
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Bagikan Kesan & Pesan Anda</h1>
        <p className="text-amber-100 mt-1 text-sm sm:text-base">
          Testimoni Anda akan menginspirasi adik-adik tingkat di SMK Muhammadiyah Tarogong Kidul.
        </p>
      </div>

      {submitted ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Terima Kasih atas Testimoni Anda!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Pesan dan pengalaman Anda akan membantu memotivasi generasi penerus di sekolah tercinta.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium shadow-md transition"
          >
            Kirim Testimoni Lainnya
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              placeholder="Nama Anda"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tahun Lulus *
              </label>
              <input
                type="number"
                required
                placeholder="2023"
                value={formData.tahun_lulus}
                onChange={(e) => setFormData({ ...formData, tahun_lulus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Jurusan *
              </label>
              <input
                type="text"
                required
                placeholder="Teknik Komputer dan Jaringan"
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pekerjaan / Posisi / Tempat Kuliah Saat Ini
            </label>
            <input
              type="text"
              placeholder="Contoh: Network Engineer di PT Telkom"
              value={formData.pekerjaan}
              onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Testimoni / Kesan & Pesan *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Tuliskan pengalaman berkesan selama bersekolah dan bagaimana bekal dari sekolah membantu karir/pendidikan Anda saat ini..."
              value={formData.testimoni}
              onChange={(e) => setFormData({ ...formData, testimoni: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? "Mengirim..." : "Kirim Testimoni"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
