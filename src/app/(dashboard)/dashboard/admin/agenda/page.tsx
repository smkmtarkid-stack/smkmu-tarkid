"use client";

import { CrudPage } from "@/components/crud/crud-page";
import type { ColumnDef } from "@/components/crud/data-table";
import type { FieldDef } from "@/components/crud/form-dialog";

const columns: ColumnDef[] = [
  { key: "kegiatan", label: "Kegiatan" },
  { key: "tanggal", label: "Tanggal" },
  { key: "lokasi", label: "Lokasi" },
];

const formFields: FieldDef[] = [
  { key: "kegiatan", label: "Nama Kegiatan", required: true },
  { key: "tanggal", label: "Tanggal", type: "date", required: true },
  { key: "lokasi", label: "Lokasi", required: true },
];

export default function AgendaAdminPage() {
  return (
    <CrudPage
      title="Agenda"
      description="Kelola agenda kegiatan sekolah."
      sheetName="Agenda"
      columns={columns}
      formFields={formFields}
      searchableKey="kegiatan"
      deleteNameKey="kegiatan"
    />
  );
}
