"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "nama_file", label: "Nama File" },
  { key: "kategori", label: "Kategori" },
  {
    key: "link",
    label: "Link",
    render: (val) =>
      val ? (
        <a href={val} target="_blank" className="text-brand-primary hover:underline text-sm">
          Download
        </a>
      ) : (
        "-"
      ),
  },
];

const formFields: FieldDef[] = [
  { key: "nama_file", label: "Nama File", required: true },
  { key: "kategori", label: "Kategori", required: true, placeholder: "Formulir, Kalender, Brosur, dll" },
  { key: "link", label: "Upload File Unduhan", type: "file", required: true },
];

export default function DownloadAdminPage() {
  return (
    <CrudPage
      title="Download"
      description="Kelola file yang bisa diunduh pengunjung."
      sheetName="Download"
      columns={columns}
      formFields={formFields}
      searchableKey="nama_file"
      deleteNameKey="nama_file"
    />
  );
}
