"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Download, FileText, Search } from "lucide-react";

interface DownloadDoc {
  id: string;
  nama_file: string;
  deskripsi?: string;
  kategori?: string;
  url_file: string;
  ukuran?: string;
  created_at?: string;
}

export default function DownloadSiswaPage() {
  const [docs, setDocs] = useState<DownloadDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const { data, error } = await supabase
        .from("download")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching downloads:", error);
      } else if (data) {
        setDocs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(
    (item) =>
      item.nama_file?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
            <Download className="h-6 w-6 text-emerald-200" />
          </div>
          <span className="px-3 py-1 bg-emerald-500/30 text-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            Portal Siswa
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Pusat Unduhan Dokumen</h1>
        <p className="text-emerald-100 mt-1 text-sm sm:text-base">
          Unduh formulir, modul pembelajaran, jadwal pelajaran, dan berkas penting lainnya secara resmi.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari nama dokumen atau modul..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      </div>

      {/* List Files */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Memuat berkas unduhan...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-slate-400" />
          <p>Belum ada berkas unduhan yang tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">
                    {doc.nama_file}
                  </h3>
                </div>
                {doc.deskripsi && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {doc.deskripsi}
                  </p>
                )}
                {doc.kategori && (
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
                    {doc.kategori}
                  </span>
                )}
              </div>

              <a
                href={doc.url_file || "#"}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow flex items-center justify-center flex-shrink-0"
                title="Unduh Berkas"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
