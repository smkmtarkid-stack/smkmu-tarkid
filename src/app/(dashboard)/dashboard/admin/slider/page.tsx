"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "judul", label: "Judul" },
  {
    key: "deskripsi",
    label: "Deskripsi",
    render: (val) => (
      <span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{val}</span>
    ),
  },
  { key: "tombol", label: "Teks Tombol" },
];

const formFields: FieldDef[] = [
  { key: "judul", label: "Judul Slider", required: true },
  { key: "deskripsi", label: "Deskripsi", type: "textarea" },
  { key: "gambar", label: "Gambar Slider", type: "file", required: true },
  { key: "tombol", label: "Teks Tombol CTA", placeholder: "Selengkapnya" },
];

export default function SliderAdminPage() {
  return (
    <CrudPage
      title="Slider"
      description="Kelola slide hero di halaman utama."
      sheetName="Slider"
      columns={columns}
      formFields={formFields}
      searchableKey="judul"
      deleteNameKey="judul"
    />
  );
}
