"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar as CalendarIcon, MapPin, Clock, Search, AlertCircle } from "lucide-react";

interface Agenda {
  id: string;
  judul: string;
  deskripsi?: string;
  tanggal: string;
  waktu?: string;
  lokasi?: string;
}

export default function AgendaSiswaPage() {
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    try {
      const { data, error } = await supabase
        .from("agenda")
        .select("*")
        .order("tanggal", { ascending: true });

      if (error) {
        console.error("Error fetching agenda:", error);
      } else if (data) {
        setAgendaList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = agendaList.filter(
    (item) =>
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
            <CalendarIcon className="h-6 w-6 text-violet-200" />
          </div>
          <span className="px-3 py-1 bg-violet-500/30 text-violet-100 rounded-full text-xs font-semibold uppercase tracking-wider">
            Portal Siswa
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">Agenda & Kegiatan Sekolah</h1>
        <p className="text-violet-100 mt-1 text-sm sm:text-base">
          Jadwal kegiatan akademik, ujian, perlombaan, dan acara SMK Muhammadiyah Tarogong Kidul.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari kegiatan atau lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>

      {/* Agenda List */}
      {loading ? (
        <div className="py-12 text-center text-slate-500">Memuat agenda...</div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-slate-400" />
          <p>Belum ada agenda kegiatan mendatang.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                  <CalendarIcon className="w-4 h-4" />
                  {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) : "Tanggal belum ditentukan"}
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {item.judul}
                </h3>

                {item.deskripsi && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.deskripsi}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                {item.waktu && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-violet-500" /> {item.waktu}
                  </span>
                )}
                {item.lokasi && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-500" /> {item.lokasi}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
