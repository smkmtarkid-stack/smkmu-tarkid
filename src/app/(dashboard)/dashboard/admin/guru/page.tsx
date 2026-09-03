"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama", label: "Nama Guru" },
  { key: "mapel", label: "Mata Pelajaran" },
  { key: "jabatan", label: "Jabatan" },
];

const formFields: FieldDef[] = [
  { key: "nama", label: "Nama Lengkap", required: true },
  { key: "mapel", label: "Mata Pelajaran", required: true },
  { key: "jabatan", label: "Jabatan", placeholder: "Guru, Wali Kelas, Kaprog, dll" },
  { key: "foto", label: "Foto Guru", type: "file" },
];

export default function GuruAdminPage() {
  return (
    <CrudPage
      title="Guru"
      description="Kelola data guru dan tenaga kependidikan."
      sheetName="Guru"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
