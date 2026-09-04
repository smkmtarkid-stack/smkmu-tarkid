"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Loader2,
  UserCog,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

interface UserAccount {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Siswa", value: "siswa" },
  { label: "Alumni", value: "alumni" },
];

const roleColors: Record<string, string> = {
  superadmin: "bg-red-100 text-red-700 border-red-200",
  admin: "bg-blue-100 text-blue-700 border-blue-200",
  siswa: "bg-emerald-100 text-emerald-700 border-emerald-200",
  alumni: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function ManajemenAkunPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "siswa",
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers((data || []) as UserAccount[]);
    } catch (err: any) {
      toast.error("Gagal memuat data akun: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // CREATE ACCOUNT
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.password) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Buat akun di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Insert ke tabel users
      const { error: insertError } = await supabase.from("users").insert({
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        status: "active",
      });

      if (insertError) throw insertError;

      toast.success(`Akun ${formData.nama} berhasil dibuat!`);
      setCreateOpen(false);
      setFormData({ nama: "", email: "", password: "", role: "siswa" });
      loadUsers();
    } catch (err: any) {
      toast.error("Gagal membuat akun: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TOGGLE STATUS
  const handleToggleStatus = async (user: UserAccount) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;
      toast.success(
        `Akun ${user.nama} berhasil ${newStatus === "active" ? "diaktifkan" : "dinonaktifkan"}!`
      );
      loadUsers();
    } catch (err: any) {
      toast.error("Gagal mengubah status: " + err.message);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", deletingUser.id);

      if (error) throw error;
      toast.success(`Akun ${deletingUser.nama} berhasil dihapus!`);
      setDeleteOpen(false);
      setDeletingUser(null);
      loadUsers();
    } catch (err: any) {
      toast.error("Gagal menghapus akun: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FILTER
  const filteredUsers = users.filter(
    (u) =>
      u.nama?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCog className="h-6 w-6 text-brand-primary" />
          Manajemen Akun
        </h1>
        <p className="text-muted-foreground">
          Buat, kelola, dan atur hak akses akun pengguna sistem.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-brand-primary hover:bg-brand-primary-dark text-white"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Akun Baru
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserCog className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Belum ada akun pengguna.</p>
        </div>
      ) : (
        <div className="bg-background rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nama</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Dibuat</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{user.nama}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`capitalize ${roleColors[user.role] || "bg-gray-100 text-gray-700"}`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {user.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          className={
                            user.status === "active"
                              ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          }
                          title={user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {user.status === "active" ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingUser(user);
                            setDeleteOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Hapus Akun"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Account Dialog */}
      <Dialog open={createOpen} onOpenChange={(v) => !v && setCreateOpen(false)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Buat Akun Baru</DialogTitle>
            <DialogDescription>
              Masukkan data untuk membuat akun pengguna baru. Akun ini akan langsung bisa digunakan untuk login.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Nama lengkap pengguna"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-primary hover:bg-brand-primary-dark text-white"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat Akun
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(v) => !v && setDeleteOpen(false)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Hapus Akun</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun <strong>{deletingUser?.nama}</strong> ({deletingUser?.email})?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setDeletingUser(null);
              }}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
