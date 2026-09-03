"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama", label: "Nama Jurusan" },
  {
    key: "deskripsi",
    label: "Deskripsi",
    render: (val) => (
      <span className="line-clamp-2 max-w-[250px] text-sm text-muted-foreground">{val}</span>
    ),
  },
  { key: "icon", label: "Icon" },
];

const formFields: FieldDef[] = [
  { key: "nama", label: "Nama Jurusan", required: true, placeholder: "Contoh: Teknik Komputer Jaringan" },
  { key: "deskripsi", label: "Deskripsi", type: "textarea", required: true },
  { key: "icon", label: "Nama Icon", placeholder: "Nama icon Lucide" },
  { key: "foto", label: "Foto Jurusan", type: "file" },
];

export default function JurusanAdminPage() {
  return (
    <CrudPage
      title="Jurusan"
      description="Kelola data program keahlian / jurusan."
      sheetName="Jurusan"
      columns={columns}
      formFields={formFields}
      searchableKey="nama"
      deleteNameKey="nama"
    />
  );
}
