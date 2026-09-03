"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nisn", label: "NISN" },
  { key: "nama", label: "Nama Alumni" },
  { key: "tahun_lulus", label: "Tahun Lulus" },
  { key: "pekerjaan", label: "Pekerjaan" },
  { key: "kampus", label: "Kampus/Univ" },
];

const formFields: FieldDef[] = [
  { key: "nisn", label: "NISN", required: true },
  { key: "nama", label: "Nama Lengkap", required: true },
  { key: "tahun_lulus", label: "Tahun Lulus", required: true },
  { key: "pekerjaan", label: "Pekerjaan Saat Ini" },
  { key: "kampus", label: "Perguruan Tinggi / Kampus" },
  { key: "email", label: "Email", type: "email" },
  { key: "foto", label: "Foto Alumni", type: "file" },
];

export default function AlumniAdminPage() {
  return (
    <CrudPage
      title="Data Alumni"
      description="Kelola data alumni sekolah."
      sheetName="Alumni"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
