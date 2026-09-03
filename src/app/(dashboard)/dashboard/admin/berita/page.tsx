"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "judul", label: "Judul" },
  { key: "kategori", label: "Kategori" },
  { key: "tanggal", label: "Tanggal" },
  {
    key: "isi",
    label: "Isi",
    render: (val) => (
      <span className="line-clamp-2 max-w-[200px] text-sm text-muted-foreground">
        {val}
      </span>
    ),
  },
];

const formFields: FieldDef[] = [
  { key: "judul", label: "Judul Berita", required: true },
  { key: "slug", label: "Slug URL", placeholder: "contoh: berita-terbaru" },
  { key: "kategori", label: "Kategori", placeholder: "Akademik, Kegiatan, OSIS, dll" },
  { key: "tanggal", label: "Tanggal", type: "date", required: true },
  { key: "isi", label: "Isi Berita", type: "textarea", required: true },
  { key: "thumbnail", label: "Thumbnail / Gambar", type: "file" },
];

export default function BeritaAdminPage() {
  return (
    <CrudPage
      title="Berita"
      description="Kelola berita dan artikel website sekolah."
      sheetName="Berita"
      columns={columns}
      formFields={formFields}
      searchableKey="judul"
      deleteNameKey="judul"
    />
  );
}
