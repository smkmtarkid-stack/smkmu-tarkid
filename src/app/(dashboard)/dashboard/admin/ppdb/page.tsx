"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "judul", label: "Judul" },
  {
    key: "isi",
    label: "Isi",
    render: (val) => (
      <span className="line-clamp-2 max-w-[250px] text-sm text-muted-foreground">{val}</span>
    ),
  },
  {
    key: "link",
    label: "Link",
    render: (val) =>
      val ? (
        <a href={val} target="_blank" className="text-brand-primary hover:underline text-sm">
          Buka
        </a>
      ) : (
        "-"
      ),
  },
];

const formFields: FieldDef[] = [
  { key: "judul", label: "Judul Informasi PPDB", required: true },
  { key: "isi", label: "Isi Informasi", type: "textarea", required: true },
  { key: "link", label: "Link Pendaftaran", type: "url", placeholder: "https://..." },
];

export default function PpdbAdminPage() {
  return (
    <CrudPage
      title="PPDB"
      description="Kelola informasi Penerimaan Peserta Didik Baru."
      sheetName="PPDB"
      columns={columns}
      formFields={formFields}
      searchableKey="judul"
      deleteNameKey="judul"
    />
  );
}
