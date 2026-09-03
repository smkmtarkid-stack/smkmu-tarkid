"use client";

import { useState, useEffect } from "react";
import { Plus, Settings2, Loader2, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/crud/data-table";
import { FormDialog, FieldDef } from "@/components/crud/form-dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function TahunAjaranPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const columns = [
    { label: "Tahun Ajaran", key: "nama_tahun" },
    { 
      label: "Status Aktif", 
      key: "is_active",
      render: (value: any) => value ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">Tidak Aktif</span>
      )
    },
    {
      label: "Aksi Khusus",
      key: "actions",
      render: (value: any, row: any) => !row.is_active ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          onClick={(e) => {
            e.stopPropagation();
            handleSetActive(row);
          }}
        >
          Jadikan Aktif
        </Button>
      ) : null
    }
  ];
  
  const formFields: FieldDef[] = [
    { key: "nama_tahun", label: "Tahun Ajaran", required: true, placeholder: "Contoh: 2026/2027" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: taData, error } = await supabase
        .from("master_tahun_ajaran")
        .select("*")
        .order("nama_tahun", { ascending: false });

      if (error) throw error;
      setData(taData || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memuat tahun ajaran dari database: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (row: any) => {
    const confirm = window.confirm(`Jadikan Tahun Ajaran "${row.nama_tahun}" sebagai tahun aktif? Sistem (Tagihan & Kasir) akan menggunakan tahun ini sebagai default.`);
    if (!confirm) return;

    try {
      // 1. Set semua false
      const { error: err1 } = await supabase
        .from("master_tahun_ajaran")
        .update({ is_active: false })
        .neq("id", row.id);
        
      if (err1) throw err1;

      // 2. Set yang dipilih jadi true
      const { error: err2 } = await supabase
        .from("master_tahun_ajaran")
        .update({ is_active: true })
        .eq("id", row.id);

      if (err2) throw err2;
      
      toast.success(`Tahun Ajaran "${row.nama_tahun}" sekarang aktif.`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal mengubah status aktif: " + error.message);
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
    if (row.is_active) {
      toast.error("Tidak bisa menghapus tahun ajaran yang sedang aktif!");
      return;
    }

    const confirm = window.confirm(`Yakin ingin menghapus tahun ajaran "${row.nama_tahun}"?`);
    if (!confirm) return;

    try {
      const { error } = await supabase.from("master_tahun_ajaran").delete().eq("id", row.id);
      if (error) throw error;
      
      toast.success(`Tahun ajaran "${row.nama_tahun}" berhasil dihapus.`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menghapus data: " + error.message);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedRow) {
        const { error } = await supabase
          .from("master_tahun_ajaran")
          .update({
            nama_tahun: formData.nama_tahun,
          })
          .eq("id", selectedRow.id);

        if (error) throw error;
        toast.success("Tahun ajaran berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("master_tahun_ajaran")
          .insert({
            nama_tahun: formData.nama_tahun,
            is_active: false // Default new is false
          });

        if (error) {
          if (error.code === '23505') throw new Error("Tahun ajaran tersebut sudah ada.");
          throw error;
        }
        toast.success("Tahun ajaran baru berhasil ditambahkan!");
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
            Master Tahun Ajaran
          </h2>
          <p className="text-muted-foreground mt-1">
            Kelola daftar tahun ajaran dan tentukan tahun ajaran yang sedang aktif.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Tahun Ajaran
        </Button>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-emerald-600" />
            Daftar Tahun Ajaran
          </CardTitle>
          <CardDescription>
            Tahun ajaran yang aktif akan digunakan sebagai default di seluruh modul keuangan (Tagihan, Kasir, Naik Kelas).
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
        title={selectedRow ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
        description={selectedRow ? "Ubah nama tahun ajaran." : "Masukkan tahun ajaran baru. Untuk mengaktifkannya, klik tombol 'Jadikan Aktif' di tabel setelah ditambahkan."}
        initialData={selectedRow}
      />
    </div>
  );
}
