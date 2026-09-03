"use client";

import { useState, useRef } from "react";
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
  GraduationCap,
  Upload,
  KeyRound,
  Briefcase,
  Building,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AlumniAccountProfilePage() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "Dewi Kartika",
    tahunLulus: "2023",
    jurusan: "Teknik Komputer dan Jaringan",
    pekerjaan: "Software Engineer",
    perusahaan: "Tech Innovation Corp",
    email: "alumni@smk.id",
    phone: "081122334455",
    address: "Garut, Jawa Barat",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran foto maksimal 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        toast.success("Foto profil alumni berhasil diunggah!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Biodata & Tracer Study alumni berhasil diperbarui!");
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Profil & Karir Alumni</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola data alumni, riwayat kelulusan, pekerjaan saat ini (Tracer Study), serta foto profil akun Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <Card className="rounded-2xl border-border/60 shadow-xs md:col-span-1 h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg relative bg-muted">
                <Image
                  src={formData.avatar}
                  alt={formData.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-transform active:scale-95"
                title="Unggah Foto Profil Baru"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="font-bold text-base text-foreground">{formData.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">Alumni Lulusan {formData.tahunLulus}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl text-xs gap-2 border-emerald-500/40 hover:bg-emerald-50 text-emerald-700 dark:hover:bg-emerald-950/40"
            >
              <Upload className="h-3.5 w-3.5" />
              Unggah Foto Alumni
            </Button>

            <div className="w-full pt-3 border-t border-border/40 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                  Angkatan
                </span>
                <span className="font-semibold text-emerald-600">{formData.tahunLulus}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                  Tracer Study
                </span>
                <span className="font-semibold text-emerald-600">Terverifikasi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Biodata & Data Pekerjaan Alumni
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui data karir dan kontak untuk jejaring alumni SMK Muhammadiyah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tahun" className="text-xs font-semibold">Tahun Kelulusan</Label>
                    <Input
                      id="tahun"
                      value={formData.tahunLulus}
                      onChange={(e) => setFormData({ ...formData, tahunLulus: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan" className="text-xs font-semibold">Jabatan / Profesi</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pekerjaan"
                        value={formData.pekerjaan}
                        onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                        className="pl-9 rounded-xl h-10 border-border/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="perusahaan" className="text-xs font-semibold">Perusahaan / Instansi / Kampus</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="perusahaan"
                        value={formData.perusahaan}
                        onChange={(e) => setFormData({ ...formData, perusahaan: e.target.value })}
                        className="pl-9 rounded-xl h-10 border-border/60"
                      />
                    </div>
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
                    <Label htmlFor="phone" className="text-xs font-semibold">No. HP / WhatsApp</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl h-10 border-border/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-semibold">Kota / Alamat Tempat Tinggal Saat Ini</Label>
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
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium px-5"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Menyimpan..." : "Simpan Profil Alumni"}
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
