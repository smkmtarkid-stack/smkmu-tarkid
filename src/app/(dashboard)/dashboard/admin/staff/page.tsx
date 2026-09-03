"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama", label: "Nama Pegawai" },
  { key: "nip", label: "NIP / NUPTK" },
  { key: "kategori", label: "Kategori Tenaga Kependidikan" },
  { key: "jabatan", label: "Jabatan / Unit Kerja" },
  { key: "telepon", label: "No. Telepon / WA" },
];

const formFields: FieldDef[] = [
  { key: "nama", label: "Nama Lengkap & Gelar", required: true },
  { key: "nip", label: "NIP / NUPTK", placeholder: "Optional" },
  {
    key: "kategori",
    label: "Kategori Staf",
    type: "select",
    required: true,
    options: [
      { label: "Tata Usaha (TU)", value: "Tata Usaha" },
      { label: "Penjaga Sekolah / Keamanan", value: "Penjaga Sekolah" },
      { label: "Petugas Kebersihan / Maintenance", value: "Kebersihan" },
      { label: "Pengelola Perpustakaan", value: "Perpustakaan" },
      { label: "Laboran / Teknisi IT", value: "Teknisi" },
    ],
  },
  { key: "jabatan", label: "Jabatan Detail", required: true, placeholder: "Kepala TU, Staff Admin, Satpam, dll" },
  { key: "telepon", label: "No. Telepon / WhatsApp" },
  { key: "foto", label: "Foto Pegawai", type: "file" },
];

export default function StaffAdminPage() {
  return (
    <CrudPage
      title="Tata Usaha & Penjaga Sekolah (Staff)"
      description="Kelola data tenaga kependidikan, staf Tata Usaha (TU), penjaga sekolah, dan kebersihan."
      sheetName="Staff"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
