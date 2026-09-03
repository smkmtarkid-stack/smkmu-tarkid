"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/crud/data-table";
import { FormDialog, FieldDef } from "@/components/crud/form-dialog";
import { DeleteDialog } from "@/components/crud/delete-dialog";
import { ImportDialog } from "@/components/crud/import-dialog";
import { fetchSheet, createRow, updateRow, deleteRow, createRows } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface CrudPageProps {
  title: string;
  description: string;
  sheetName: string;
  columns: ColumnDef[];
  formFields: FieldDef[];
  searchableKey?: string;
  deleteNameKey?: string; // which field to show as the item name in the delete dialog
  enableImport?: boolean; // toggle import feature
}

export function CrudPage({
  title,
  description,
  sheetName,
  columns,
  formFields,
  searchableKey,
  deleteNameKey,
  enableImport = true,
}: CrudPageProps) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, string> | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState<Record<string, string> | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await fetchSheet(sheetName);
    if (res.status === "success" && res.data) {
      setData(res.data);
    } else {
      toast.error("Gagal memuat data: " + (res.message || "Unknown error"));
    }
    setLoading(false);
  }, [sheetName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CREATE
  const handleCreate = async (formData: Record<string, string>) => {
    const res = await createRow(sheetName, formData);
    if (res.status === "success") {
      toast.success("Data berhasil ditambahkan!");
      loadData();
    } else {
      toast.error("Gagal: " + res.message);
    }
  };

  // UPDATE
  const handleUpdate = async (formData: Record<string, string>) => {
    const res = await updateRow(sheetName, formData.id, formData);
    if (res.status === "success") {
      toast.success("Data berhasil diperbarui!");
      loadData();
    } else {
      toast.error("Gagal: " + res.message);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deletingRow) return;
    const res = await deleteRow(sheetName, deletingRow.id);
    if (res.status === "success") {
      toast.success("Data berhasil dihapus!");
      loadData();
    } else {
      toast.error("Gagal: " + res.message);
    }
  };

  // IMPORT
  const handleImport = async (importedData: Record<string, any>[]) => {
    const res = await createRows(sheetName, importedData);
    if (res.status === "success") {
      toast.success(`Berhasil mengimpor ${importedData.length} data!`);
      loadData();
    } else {
      toast.error("Gagal mengimpor data: " + res.message);
      throw new Error(res.message); // to prevent dialog from closing automatically if we want
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {enableImport && (
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              onClick={() => setImportOpen(true)}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          )}
          <Button
            size="sm"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white"
            onClick={() => {
              setEditingRow(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchableKey={searchableKey}
          onEdit={(row) => {
            setEditingRow(row);
            setFormOpen(true);
          }}
          onDelete={(row) => {
            setDeletingRow(row);
            setDeleteOpen(true);
          }}
        />
      )}

      {/* Form Dialog (Create / Edit) */}
      <FormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingRow(null);
        }}
        onSubmit={editingRow ? handleUpdate : handleCreate}
        fields={formFields}
        title={editingRow ? `Edit ${title}` : `Tambah ${title}`}
        description={editingRow ? "Ubah data di bawah ini." : `Masukkan data ${title.toLowerCase()} baru.`}
        initialData={editingRow}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingRow(null);
        }}
        onConfirm={handleDelete}
        itemName={deletingRow?.[deleteNameKey || "id"] || deletingRow?.id}
      />

      {/* Import Dialog */}
      {enableImport && (
        <ImportDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onSubmit={handleImport}
          fields={formFields}
          title={`Import Data ${title}`}
        />
      )}
    </div>
  );
}
