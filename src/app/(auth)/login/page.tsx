"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/constants/site";
import { supabase } from "@/lib/supabase";

// Login Schema Validation
const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password minimal terdiri dari 6 karakter" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      // Autentikasi dengan Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast.error("Gagal masuk. Periksa kembali email dan password Anda.");
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Ambil profil / role pengguna dari tabel users
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("email", data.email)
          .single();

        if (profileError || !profileData) {
          toast.success("Berhasil masuk (Role tidak ditemukan, arahkan ke Beranda)");
          router.push("/");
        } else {
          toast.success("Berhasil masuk!");
          // Arahkan sesuai role
          if (profileData.role === "admin" || profileData.role === "superadmin") {
            router.push("/dashboard/admin");
          } else if (profileData.role === "siswa") {
            router.push("/dashboard/siswa");
          } else if (profileData.role === "alumni") {
            router.push("/dashboard/alumni");
          } else {
            router.push("/");
          }
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20 flex bg-muted/30">
      {/* Left Column: Image/Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
          alt="School Building"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
        />
        
        {/* Branding Overlay */}
        <div className="relative z-20 text-white p-12 max-w-lg">
          <div className="w-20 h-20 bg-white rounded-2xl p-2 mb-8 shadow-xl">
            <Image
              src={siteConfig.logo}
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Portal Informasi & Akademik
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Sistem informasi terpadu SMK Muhammadiyah Tarogong Kidul untuk Siswa, Guru, Alumni, dan Administrator.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-white/60">
            <span className="px-3 py-1 rounded-full border border-white/20">Secure</span>
            <span className="px-3 py-1 rounded-full border border-white/20">Integrated</span>
            <span className="px-3 py-1 rounded-full border border-white/20">Modern</span>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] bg-background rounded-2xl border shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
            <p className="text-muted-foreground text-sm">
              Silakan masukkan email dan password Anda untuk mengakses portal.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nama@email.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="#"
                        className="text-sm font-medium text-brand-primary hover:underline"
                        tabIndex={-1}
                      >
                        Lupa password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-brand-primary hover:bg-brand-primary-dark text-white text-base gap-2 mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                Masuk ke Portal
              </Button>
            </form>
          </Form>


        </div>
      </div>
    </div>
  );
}
