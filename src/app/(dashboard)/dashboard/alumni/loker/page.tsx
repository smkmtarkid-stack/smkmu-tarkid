"use client";

import { useState } from "react";
import { Briefcase, MapPin, Building2, Calendar, ExternalLink, Plus, Search, CheckCircle } from "lucide-react";

interface LokerItem {
  id: string;
  posisi: string;
  perusahaan: string;
  lokasi: string;
  tipe: string; // Full-time, Part-time, Internship
  gaji?: string;
  deskripsi: string;
  link_lamar: string;
  diposting: string;
}

const sampleLoker: LokerItem[] = [
  {
    id: "1",
    posisi: "Junior Network Engineer",
    perusahaan: "PT Telkom Indonesia",
    lokasi: "Bandung, Jawa Barat",
    tipe: "Full-Time",
    gaji: "Rp 4.500.000 - Rp 6.000.000",
    deskripsi: "Memelihara infrastruktur jaringan, konfigurasi Cisco/Mikrotik, serta troubleshooting koneksi jaringan enterprise.",
    link_lamar: "https://careers.telkom.co.id",
    diposting: "2 Hari yang lalu",
  },
  {
    id: "2",
    posisi: "Frontend Web Developer (Junior)",
    perusahaan: "PT Digital Solusindo",
    lokasi: "Garut / Remote",
    tipe: "Full-Time",
    gaji: "Rp 4.000.000 - Rp 5.500.000",
    deskripsi: "Mengembangkan antarmuka web modern menggunakan React / Next.js dan Tailwind CSS.",
    link_lamar: "mailto:hrd@digitalsolusindo.co.id",
    diposting: "3 Hari yang lalu",
  },
  {
    id: "3",
    posisi: "Teknisi Otomotif & Servis Berkala",
    perusahaan: "Dealer Astra Honda Garut",
    lokasi: "Garut, Jawa Barat",
    tipe: "Full-Time",
    gaji: "Sesuai UMK + Bonus",
    deskripsi: "Melakukan inspeksi kendaraan roda dua, perawatan rutin, dan perbaikan mesin.",
    link_lamar: "https://astrahonda.com/career",
    diposting: "1 Minggu yang lalu",
  },
];

export default function LokerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newLoker, setNewLoker] = useState({
    posisi: "",
    perusahaan: "",
    lokasi: "",
    tipe: "Full-Time",
    deskripsi: "",
    link_lamar: "",
  });

  const filteredLoker = sampleLoker.filter(
    (item) =>
      item.posisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateLoker = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowAddForm(false);
      setSubmitted(false);
      setNewLoker({ posisi: "", perusahaan: "", lokasi: "", tipe: "Full-Time", deskripsi: "", link_lamar: "" });
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
              <Briefcase className="h-6 w-6 text-indigo-200" />
            </div>
            <span className="px-3 py-1 bg-indigo-500/30 text-indigo-100 rounded-full text-xs font-semibold uppercase tracking-wider">
              Bursa Kerja Alumni
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Lowongan Kerja & Karir</h1>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base max-w-xl">
            Temukan info lowongan pekerjaan terbaru atau bagikan informasi lowongan di perusahaan Anda untuk alumni lainnya.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Share Info Loker
        </button>
      </div>

      {/* Form Tambah Loker Modal/Box */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Bagikan Lowongan Kerja Baru
          </h2>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5" /> Info lowongan kerja berhasil terkirim dan akan ditinjau admin.
            </div>
          ) : (
            <form onSubmit={handleCreateLoker} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Posisi Pekerjaan (cth: System Administrator)"
                  value={newLoker.posisi}
                  onChange={(e) => setNewLoker({ ...newLoker, posisi: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Perusahaan (cth: PT Maju Bersama)"
                  value={newLoker.perusahaan}
                  onChange={(e) => setNewLoker({ ...newLoker, perusahaan: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Lokasi Penempatan (cth: Garut / Jakarta)"
                  value={newLoker.lokasi}
                  onChange={(e) => setNewLoker({ ...newLoker, lokasi: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newLoker.tipe}
                  onChange={(e) => setNewLoker({ ...newLoker, tipe: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Magang / Internship</option>
                  <option value="Contract">Kontrak</option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Deskripsi singkat & kualifikasi pekerjaan..."
                value={newLoker.deskripsi}
                onChange={(e) => setNewLoker({ ...newLoker, deskripsi: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                required
                placeholder="Link Pendaftaran / Email HRD (cth: https://... atau hrd@company.com)"
                value={newLoker.link_lamar}
                onChange={(e) => setNewLoker({ ...newLoker, link_lamar: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md"
                >
                  Kirim Info Loker
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filter & Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari posisi pekerjaan, nama perusahaan, atau lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* List Lowongan Kerja */}
      <div className="space-y-4">
        {filteredLoker.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
                  {item.tipe}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
                  {item.posisi}
                </h3>
              </div>
              {item.gaji && (
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.gaji}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" /> {item.perusahaan}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" /> {item.lokasi}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> {item.diposting}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.deskripsi}
            </p>

            <div className="pt-2 flex justify-end">
              <a
                href={item.link_lamar}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Lamar Sekarang <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
