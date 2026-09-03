"use client";

import { useState, useEffect } from "react";
import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";
import { fetchSheet } from "@/lib/api";

const columns: ColumnDef[] = [
  { key: "nis", label: "NIS / NISN" },
  { key: "nama", label: "Nama Siswa" },
  { key: "kelas", label: "Kelas" },
  { key: "jurusan", label: "Jurusan" },
  { key: "email", label: "Email" },
  { key: "telepon", label: "No. WA / HP" },
];

export default function SiswaAdminPage() {
  const [kelasOptions, setKelasOptions] = useState<{ label: string; value: string }[]>([]);
  const [jurusanOptions, setJurusanOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Kelas from Supabase DB
        const kelasRes = await fetchSheet("kelas");
        if (kelasRes.status === "success" && kelasRes.data) {
          const kOpt = kelasRes.data.map((k: any) => {
            const namaKelas = k.nama_kelas || k.nama || "Kelas";
            const jur = k.jurusan ? ` (${k.jurusan})` : "";
            return {
              label: `${namaKelas}${jur}`,
              value: namaKelas,
            };
          });
          setKelasOptions(kOpt);
        }

        // Fetch Jurusan from Supabase DB
        const jurusanRes = await fetchSheet("jurusan");
        if (jurusanRes.status === "success" && jurusanRes.data) {
          const jOpt = jurusanRes.data.map((j: any) => {
            const namaJurusan = j.nama || j.nama_jurusan || j.name || "Jurusan";
            return {
              label: namaJurusan,
              value: namaJurusan,
            };
          });
          setJurusanOptions(jOpt);
        }
      } catch (err) {
        console.error("Gagal memuat data kelas/jurusan:", err);
      }
    }
    loadData();
  }, []);

  const formFields: FieldDef[] = [
    { key: "nis", label: "NIS / NISN", required: true },
    { key: "nama", label: "Nama Lengkap Siswa", required: true },
    {
      key: "kelas",
      label: "Kelas (Pilih Kelas Terdaftar di Database)",
      type: "select",
      required: true,
      options: kelasOptions.length > 0
        ? kelasOptions
        : [{ label: "Memuat kelas dari database...", value: "" }],
    },
    {
      key: "jurusan",
      label: "Jurusan (Pilih Jurusan Terdaftar di Database)",
      type: "select",
      required: true,
      options: jurusanOptions.length > 0
        ? jurusanOptions
        : [{ label: "Memuat jurusan dari database...", value: "" }],
    },
    { key: "email", label: "Email Siswa", type: "email" },
    { key: "telepon", label: "Nomor WhatsApp / HP Siswa" },
    { key: "foto", label: "Pas Foto Siswa", type: "file" },
  ];

  return (
    <CrudPage
      title="Data Siswa"
      description="Kelola data siswa aktif. Pilihan kelas dan jurusan terhubung otomatis dengan database."
      sheetName="Siswa"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
