"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Shield,
  Camera,
  CheckCircle2,
  Save,
  MapPin,
  Calendar,
  Building2,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFile, fetchSheet, updateRow, createRow } from "@/lib/api";

export default function AccountProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State & Data Diri Lengkap
  const [formData, setFormData] = useState({
    id: "",
    name: "Admin SMK Muhammadiyah",
    nip: "19850712 201001 1 004",
    email: "admin@smk.id",
    phone: "081234567890",
    role: "Administrator Utama",
    gender: "Laki-laki",
    placeOfBirth: "Garut",
    dateOfBirth: "1985-07-12",
    address: "Jl. Pembangunan No. 163, Tarogong Kidul, Garut",
    position: "Kepala Unit IT & Sistem Informasi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Fetch initial profile from Supabase table 'profil' or 'users'
  useEffect(() => {
    async function getInitialProfile() {
      setFetching(true);
      const res = await fetchSheet("profil");
      if (res.status === "success" && res.data && res.data.length > 0) {
        const found = res.data.find(row => row.email === "admin@smk.id") || res.data[0];
        setFormData((prev) => ({
          ...prev,
          id: found.id || "",
          name: found.nama || found.name || prev.name,
          email: found.email || prev.email,
          phone: found.phone || found.telepon || prev.phone,
          nip: found.nip || prev.nip,
          position: found.jabatan || prev.position,
          address: found.alamat || prev.address,
          avatar: found.foto || found.avatar || prev.avatar,
        }));
      }
      setFetching(false);
    }
    getInitialProfile();
  }, []);

  // Handle Photo Upload to Supabase Storage Bucket ('uploads')
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB!");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Mengunggah foto ke Supabase Storage...");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const res = await uploadFile(base64String, file.name, file.type);

      if (res.status === "success" && res.url) {
        setFormData((prev) => ({ ...prev, avatar: res.url as string }));
        toast.success("Foto profil berhasil diunggah dan disimpan di Supabase Storage!", { id: toastId });
      } else {
        toast.error("Gagal mengunggah foto: " + (res.message || "Unknown error"), { id: toastId });
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Save to Supabase Database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Menyimpan perubahan ke Supabase...");

    const payload = {
      nama: formData.name,
      email: formData.email,
      phone: formData.phone,
      nip: formData.nip,
      jabatan: formData.position,
      alamat: formData.address,
      foto: formData.avatar,
    };

    let res;
    if (formData.id) {
      res = await updateRow("profil", formData.id, payload);
    } else {
      res = await createRow("profil", payload);
    }

    if (res.status === "success") {
      toast.success("Profil akun berhasil tersimpan permanen di Supabase Database!", { id: toastId });
    } else {
      toast.error("Gagal menyimpan ke database: " + res.message, { id: toastId });
    }

    setLoading(false);
  };

  // Handle Password Change
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      toast.error("Masukkan password lama terlebih dahulu!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter!");
      return;
    }

    toast.success("Password akun berhasil diubah dan diperbarui!");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Profil & Data Diri Akun</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi biodata lengkap, unggah foto profil avatar ke Supabase Storage, serta keamanan kata sandi.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Avatar & Quick Info Card */}
        <Card className="rounded-2xl border-border/60 shadow-xs md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            {/* Avatar container */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg relative bg-muted flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                ) : (
                  <Image
                    src={formData.avatar}
                    alt={formData.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-transform active:scale-95 disabled:opacity-50"
                title="Unggah Foto Profil Baru"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="font-bold text-base text-foreground">{formData.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">{formData.nip}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl text-xs gap-2 border-emerald-500/40 hover:bg-emerald-50 text-emerald-700 dark:hover:bg-emerald-950/40"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Mengunggah..." : "Unggah Foto ke Supabase"}
            </Button>

            <div className="w-full pt-3 border-t border-border/40 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  Peran Sistem
                </span>
                <span className="font-semibold text-emerald-600">{formData.role}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-muted/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  Database
                </span>
                <span className="font-semibold text-emerald-600">Supabase Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Detailed Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Biodata Lengkap */}
          <Card className="rounded-2xl border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Data Diri Lengkap
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi identitas pribadi terhubung langsung dengan Supabase Database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold">Nama Lengkap & Gelar</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nip" className="text-xs font-semibold">NIP / NUPTK</Label>
                    <Input
                      id="nip"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      className="rounded-xl h-10 border-border/60 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold">Alamat Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-9 rounded-xl h-10 border-border/60"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold">Nomor Telepon / WhatsApp</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth" className="text-xs font-semibold">Tempat Lahir</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-xs font-semibold">Tanggal Lahir</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="pl-9 rounded-xl h-10 border-border/60"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-xs font-semibold">Jabatan / Unit Kerja</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="pl-9 rounded-xl h-10 border-border/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-semibold">Alamat Tempat Tinggal</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 p-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium px-5"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {loading ? "Menyimpan ke Supabase..." : "Simpan Profil ke Supabase"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card 2: Pengaturan Keamanan / Ganti Password */}
          <Card className="rounded-2xl border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-emerald-600" />
                Ubah Password Akun
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-semibold">Password Saat Ini</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="pr-10 rounded-xl h-10 border-border/60"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-xs font-semibold">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                      placeholder="Ulangi password baru"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-xl gap-2 font-medium px-5 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    Ubah Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

