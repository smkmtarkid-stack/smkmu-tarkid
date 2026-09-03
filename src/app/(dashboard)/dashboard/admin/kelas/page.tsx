"use client";

import { useState, useEffect } from "react";
import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";
import { fetchSheet } from "@/lib/api";

const columns: ColumnDef[] = [
  { key: "nama_kelas", label: "Nama Kelas" },
  { key: "tingkat", label: "Tingkat" },
  { key: "jurusan", label: "Jurusan / Keahlian" },
  { key: "wali_kelas", label: "Wali Kelas" },
  { key: "jumlah_siswa", label: "Kapasitas / Jml Siswa" },
];

export default function KelasAdminPage() {
  const [jurusanOptions, setJurusanOptions] = useState<{ label: string; value: string }[]>([]);
  const [guruOptions, setGuruOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function loadDropdownData() {
      try {
        // Fetch Jurusan from Supabase DB
        const jurusanRes = await fetchSheet("jurusan");
        if (jurusanRes.status === "success" && jurusanRes.data) {
          const jOptions = jurusanRes.data.map((j: any) => {
            const namaJurusan = j.nama || j.nama_jurusan || j.name || "Jurusan";
            const kode = j.kode ? ` (${j.kode})` : "";
            return {
              label: `${namaJurusan}${kode}`,
              value: namaJurusan,
            };
          });
          setJurusanOptions(jOptions);
        }

        // Fetch Guru for Wali Kelas selection
        const guruRes = await fetchSheet("guru");
        if (guruRes.status === "success" && guruRes.data) {
          const gOptions = guruRes.data.map((g: any) => {
            const namaGuru = g.nama || g.nama_lengkap || "Guru";
            return {
              label: namaGuru,
              value: namaGuru,
            };
          });
          setGuruOptions(gOptions);
        }
      } catch (err) {
        console.error("Gagal memuat data jurusan/guru:", err);
      }
    }
    loadDropdownData();
  }, []);

  const formFields: FieldDef[] = [
    { key: "nama_kelas", label: "Nama Kelas", required: true, placeholder: "Contoh: X TKL 1, XII TKJ 2" },
    {
      key: "tingkat",
      label: "Tingkat Kelas",
      type: "select",
      required: true,
      options: [
        { label: "Kelas X (Sepuluh)", value: "X" },
        { label: "Kelas XI (Sebelas)", value: "XI" },
        { label: "Kelas XII (Dua Belas)", value: "XII" },
      ],
    },
    {
      key: "jurusan",
      label: "Jurusan (Pilih dari Database Jurusan)",
      type: "select",
      required: true,
      options: jurusanOptions.length > 0
        ? jurusanOptions
        : [{ label: "Memuat jurusan dari database...", value: "" }],
    },
    {
      key: "wali_kelas",
      label: "Wali Kelas (Pilih dari Database Guru)",
      type: "select",
      options: guruOptions.length > 0
        ? guruOptions
        : [{ label: "Pilih Wali Kelas (Opsional)", value: "" }],
    },
    { key: "jumlah_siswa", label: "Kapasitas / Jumlah Siswa", placeholder: "36" },
  ];

  return (
    <CrudPage
      title="Manajemen Kelas & Rombel"
      description="Kelola rombongan belajar (rombel) kelas dan hubungkan secara otomatis dengan Jurusan di database."
      sheetName="Kelas"
      columns={columns}
      formFields={formFields}
      searchableKey="nama_kelas"
      deleteNameKey="nama_kelas"
    />
  );
}
