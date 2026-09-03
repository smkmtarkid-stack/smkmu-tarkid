"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama", label: "Nama Prestasi" },
  { key: "prestasi", label: "Jenis" },
  { key: "tingkat", label: "Tingkat" },
  { key: "tahun", label: "Tahun" },
];

const formFields: FieldDef[] = [
  { key: "nama", label: "Nama Peserta / Tim", required: true },
  { key: "prestasi", label: "Jenis Prestasi", required: true, placeholder: "Juara 1 Lomba..." },
  { key: "tingkat", label: "Tingkat", required: true, placeholder: "Kabupaten, Provinsi, Nasional" },
  { key: "tahun", label: "Tahun", required: true },
  { key: "foto", label: "Foto Dokumentasi", type: "file" },
];

export default function PrestasiAdminPage() {
  return (
    <CrudPage
      title="Prestasi"
      description="Kelola data prestasi siswa dan sekolah."
      sheetName="Prestasi"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
