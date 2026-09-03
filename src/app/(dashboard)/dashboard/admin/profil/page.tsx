"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "judul", label: "Judul Profil" },
  {
    key: "isi",
    label: "Isi",
    render: (val) => (
      <span className="line-clamp-2 max-w-[350px] text-sm text-muted-foreground">{val}</span>
    ),
  },
];

const formFields: FieldDef[] = [
  { key: "judul", label: "Judul / Bagian", required: true, placeholder: "Visi Misi, Sejarah, Sambutan, dll" },
  { key: "isi", label: "Isi Konten", type: "textarea", required: true },
];

export default function ProfilAdminPage() {
  return (
    <CrudPage
      title="Profil Sekolah"
      description="Kelola informasi profil sekolah (Visi Misi, Sejarah, Sambutan Kepsek, dll)."
      sheetName="Profil"
      columns={columns}
      formFields={formFields}
      searchableKey="judul"
      deleteNameKey="judul"
    />
  );
}
