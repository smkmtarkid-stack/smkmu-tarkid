"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "kategori", label: "Kategori" },
  { key: "deskripsi", label: "Deskripsi" },
  {
    key: "gambar",
    label: "Gambar",
    render: (val) =>
      val ? (
        <a href={val} target="_blank" className="text-brand-primary hover:underline text-sm">
          Lihat
        </a>
      ) : (
        "-"
      ),
  },
];

const formFields: FieldDef[] = [
  { key: "kategori", label: "Kategori", required: true, placeholder: "Kegiatan, Fasilitas, Jurusan, dll" },
  { key: "gambar", label: "Gambar Galeri", type: "file", required: true },
  { key: "deskripsi", label: "Deskripsi", type: "textarea" },
];

export default function GaleriAdminPage() {
  return (
    <CrudPage
      title="Galeri"
      description="Kelola galeri foto sekolah."
      sheetName="Galeri"
      columns={columns}
      formFields={formFields}
      searchableKey="kategori"
      deleteNameKey="deskripsi"
    />
  );
}
