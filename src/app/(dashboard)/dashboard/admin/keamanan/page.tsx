"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound, Lock, Smartphone, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

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
      toast.error("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Pengaturan keamanan password berhasil diperbarui!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  const toggle2FA = () => {
    setTwoFactor(!twoFactor);
    toast.success(!twoFactor ? "Autentikasi Dua Faktor (2FA) diaktifkan!" : "Autentikasi Dua Faktor (2FA) dinonaktifkan!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Keamanan Akun</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola kata sandi, otentikasi dua faktor, serta keamanan akses ke portal sistem.
        </p>
      </div>

      <div className="space-y-6">
        {/* Card 1: Change Password */}
        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-emerald-600" />
              Ubah Password Akun
            </CardTitle>
            <CardDescription className="text-xs">
              Disarankan untuk memperbarui password Anda secara berkala dengan kombinasi huruf dan angka.
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
                  {loading ? "Menyimpan..." : "Perbarui Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Two-Factor Authentication */}
        <Card className="rounded-2xl border-border/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Otentikasi Dua Faktor (2FA)
            </CardTitle>
            <CardDescription className="text-xs">
              Tambahkan lapisan keamanan ekstra dengan verifikasi kode otentikator pada smartphone Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/20 rounded-xl border border-border/40 m-6 mt-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Aplikasi Otentikator (Google Authenticator / Authy)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {twoFactor ? "Status: Aktif dan Melindungi Akun" : "Status: Belum Diaktifkan"}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant={twoFactor ? "destructive" : "outline"}
              onClick={toggle2FA}
              className="rounded-xl text-xs px-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {twoFactor ? "Nonaktifkan 2FA" : "Aktifkan 2FA"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
