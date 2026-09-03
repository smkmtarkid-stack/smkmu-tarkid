"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Calendar, Tag, Search, Pin, AlertCircle } from "lucide-react";

interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori?: string;
  is_pinned?: boolean;
  created_at: string;
}

export default function PengumumanSiswaPage() {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      const { data, error } = await supabase
        .from("pengumuman")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pengumuman:", error);
      } else if (data) {
        setPengumumanList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = pengumumanList.filter(
    (item) =>
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
            <Bell className="h-6 w-6 text-cyan-200" />
          </div>
          <span className="px-3 py-1 bg-cyan-500/30 text-cyan-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            Portal Siswa
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Pengumuman Sekolah</h1>
        <p className="text-cyan-100 mt-1 text-sm sm:text-base">
          Informasi resmi, pengumuman akademik, dan pemberitahuan penting untuk seluruh siswa.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari kata kunci pengumuman..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Memuat pengumuman...</div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-slate-400" />
          <p>Belum ada pengumuman yang ditampilkan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-3 relative overflow-hidden"
            >
              {item.is_pinned && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
                  <Pin className="w-3 h-3" /> Pinned
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {item.kategori && (
                  <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.kategori}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {item.judul}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {item.isi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
