"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "judul", label: "Judul" },
  { key: "tanggal", label: "Tanggal" },
  {
    key: "isi",
    label: "Isi",
    render: (val) => (
      <span className="line-clamp-2 max-w-[250px] text-sm text-muted-foreground">{val}</span>
    ),
  },
];

const formFields: FieldDef[] = [
  { key: "judul", label: "Judul Pengumuman", required: true },
  { key: "tanggal", label: "Tanggal", type: "date", required: true },
  { key: "isi", label: "Isi Pengumuman", type: "textarea", required: true },
];

export default function PengumumanAdminPage() {
  return (
    <CrudPage
      title="Pengumuman"
      description="Kelola pengumuman sekolah."
      sheetName="Pengumuman"
      columns={columns}
      formFields={formFields}
      searchableKey="judul"
      deleteNameKey="judul"
    />
  );
}
