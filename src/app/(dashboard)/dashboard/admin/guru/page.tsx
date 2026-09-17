"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama", label: "Nama Lengkap" },
  { key: "nip_nuptk", label: "NIP/NUPTK" },
  { key: "tempat_lahir", label: "Tempat Lahir" },
  { key: "tanggal_lahir", label: "Tanggal Lahir" },
  { key: "pendidikan_terakhir", label: "Pendidikan Terakhir" },
  { key: "jabatan", label: "Jabatan" },
];

const formFields: FieldDef[] = [
  { key: "nama", label: "Nama Lengkap", required: true },
  {
    key: "nip_nuptk",
    label: "NIP/NUPTK",
    placeholder: "Boleh dikosongkan bila belum memiliki",
  },
  { key: "tempat_lahir", label: "Tempat Lahir", required: true },
  { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true },
  {
    key: "pendidikan_terakhir",
    label: "Pendidikan Terakhir",
    placeholder: "Contoh: S1 Teknik Informatika",
    required: true,
  },
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
