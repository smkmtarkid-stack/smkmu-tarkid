"use client";

import { useState, useEffect } from "react";
import { Plus, Settings2, Loader2 } from "lucide-react";
import { DataTable } from "@/components/crud/data-table";
import { FormDialog, FieldDef } from "@/components/crud/form-dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const columns = [
  { label: "Nama Kategori", key: "nama_kategori" },
  { 
    label: "Nominal Default", 
    key: "nominal_default",
    render: (value: any, row: any) => `Rp ${Number(row.nominal_default).toLocaleString('id-ID')}`
  },
  { label: "Deskripsi", key: "deskripsi" },
];

const formFields: FieldDef[] = [
  { key: "nama_kategori", label: "Nama Kategori", required: true },
  { key: "nominal_default", label: "Nominal Default (Rp)", type: "number", required: true },
  { key: "deskripsi", label: "Deskripsi", type: "textarea" },
];

export default function KategoriTagihanPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: katData, error } = await supabase
        .from("kategori_tagihan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(katData || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memuat kategori dari database: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  const handleDelete = async (row: any) => {
    const confirm = window.confirm(`Yakin ingin menghapus kategori "${row.nama_kategori}"?`);
    if (!confirm) return;

    try {
      const { error } = await supabase.from("kategori_tagihan").delete().eq("id", row.id);
      if (error) throw error;
      
      toast.success(`Kategori "${row.nama_kategori}" berhasil dihapus.`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menghapus kategori: " + error.message);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedRow) {
        const { error } = await supabase
          .from("kategori_tagihan")
          .update({
            nama_kategori: formData.nama_kategori,
            nominal_default: Number(formData.nominal_default),
            deskripsi: formData.deskripsi
          })
          .eq("id", selectedRow.id);

        if (error) throw error;
        toast.success("Kategori berhasil diperbarui di Database!");
      } else {
        const { error } = await supabase
          .from("kategori_tagihan")
          .insert({
            nama_kategori: formData.nama_kategori,
            nominal_default: Number(formData.nominal_default),
            deskripsi: formData.deskripsi
          });

        if (error) throw error;
        toast.success("Kategori baru berhasil ditambahkan ke Database!");
      }
      
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan data: " + error.message);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Kategori Tagihan
          </h2>
          <p className="text-muted-foreground mt-1">
            Kelola jenis-jenis biaya dan iuran sekolah.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-emerald-600" />
            Daftar Kategori
          </CardTitle>
          <CardDescription>
            Master data kategori tagihan yang akan ditagihkan ke siswa. (Terkoneksi Supabase)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-muted-foreground">Mengambil data dari database...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <FormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        fields={formFields}
        title={selectedRow ? "Edit Kategori" : "Tambah Kategori Baru"}
        description={selectedRow ? "Ubah detail kategori tagihan." : "Masukkan detail kategori tagihan baru yang akan ditagihkan kepada siswa."}
        initialData={selectedRow}
      />
    </div>
  );
}
