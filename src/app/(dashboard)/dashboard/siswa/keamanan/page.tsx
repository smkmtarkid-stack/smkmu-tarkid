"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SiswaSecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Masukkan password lama Anda!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password akun siswa berhasil diperbarui!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Keamanan Akun Siswa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola kata sandi dan keamanan akses akun siswa Anda.
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-emerald-600" />
            Ubah Password Akun Siswa
          </CardTitle>
          <CardDescription className="text-xs">
            Pastikan kata sandi baru Anda aman dan tidak disebarkan ke orang lain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-semibold">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="pr-10 rounded-xl h-10 border-border/60"
                  placeholder="••••••••"
                  required
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
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="rounded-xl h-10 border-border/60"
                  placeholder="Minimal 6 karakter"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold">Konfirmasi Password Baru</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="rounded-xl h-10 border-border/60"
                  placeholder="Ulangi password baru"
                  required
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
                {loading ? "Menyimpan..." : "Perbarui Password Siswa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
