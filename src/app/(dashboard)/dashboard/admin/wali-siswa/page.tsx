"use client";

import { useState, useEffect } from "react";
import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";
import { fetchSheet } from "@/lib/api";

const columns: ColumnDef[] = [
  { key: "nama_wali", label: "Nama Orang Tua / Wali" },
  { key: "hubungan", label: "Hubungan" },
  { key: "nama_siswa", label: "Orang Tua Dari (Siswa)" },
  { key: "kelas", label: "Kelas Siswa" },
  { key: "pekerjaan", label: "Pekerjaan Wali" },
  { key: "telepon", label: "No. WA / Kontak Wali" },
];

export default function WaliSiswaAdminPage() {
  const [siswaOptions, setSiswaOptions] = useState<{ label: string; value: string }[]>([]);
  const [kelasOptions, setKelasOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function loadDropdownData() {
      try {
        // Fetch Siswa from Supabase DB
        const res = await fetchSheet("siswa");
        if (res.status === "success" && res.data) {
          const options = res.data.map((siswa: any) => {
            const nama = siswa.nama || siswa.nama_lengkap || siswa.name || "Siswa Tanpa Nama";
            const nisCode = siswa.nis || siswa.nisn;
            const nisLabel = nisCode ? ` (NIS: ${nisCode})` : "";
            return {
              label: `${nama}${nisLabel}`,
              value: nama,
            };
          });
          setSiswaOptions(options);
        }

        // Fetch Kelas from Supabase DB
        const kelasRes = await fetchSheet("kelas");
        if (kelasRes.status === "success" && kelasRes.data) {
          const kOpt = kelasRes.data.map((k: any) => {
            const namaKelas = k.nama_kelas || k.nama || "Kelas";
            return {
              label: namaKelas,
              value: namaKelas,
            };
          });
          setKelasOptions(kOpt);
        }
      } catch (err) {
        console.error("Gagal memuat data dropdown:", err);
      }
    }
    loadDropdownData();
  }, []);

  const formFields: FieldDef[] = [
    { key: "nama_wali", label: "Nama Lengkap Orang Tua / Wali", required: true },
    {
      key: "hubungan",
      label: "Hubungan / Status",
      type: "select",
      required: true,
      options: [
        { label: "Ayah Kandung", value: "Ayah Kandung" },
        { label: "Ibu Kandung", value: "Ibu Kandung" },
        { label: "Wali murid", value: "Wali" },
      ],
    },
    {
      key: "nama_siswa",
      label: "Orang Tua Dari (Pilih Siswa Terdaftar)",
      type: "select",
      required: true,
      options: siswaOptions.length > 0
        ? siswaOptions
        : [{ label: "Memuat siswa dari database...", value: "" }],
    },
    {
      key: "kelas",
      label: "Kelas Siswa",
      type: "select",
      options: kelasOptions.length > 0
        ? kelasOptions
        : [{ label: "Pilih Kelas dari Database (Opsional)", value: "" }],
    },
    { key: "pekerjaan", label: "Pekerjaan Orang Tua / Wali" },
    { key: "telepon", label: "Nomor HP / WhatsApp Wali", required: true },
    { key: "alamat", label: "Alamat Tinggal Wali", type: "textarea" },
  ];

  return (
    <CrudPage
      title="Data Orang Tua / Wali Siswa"
      description="Kelola daftar data seluruh orang tua murid dan wali siswa SMK Muhammadiyah."
      sheetName="WaliSiswa"
      columns={columns}
      formFields={formFields}
      searchableKey="nama_wali"
      deleteNameKey="nama_wali"
    />
  );
}
