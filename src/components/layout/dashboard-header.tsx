"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, User, Bell, ChevronDown, Settings, LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Notification items state with read status
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Pengumuman PPDB 2026",
      desc: "Pendaftaran gelombang pertama telah dibuka. Klik untuk cek detail di menu PPDB.",
      time: "10 menit yang lalu",
      link: "/dashboard/admin/ppdb",
      isRead: false,
    },
    {
      id: "2",
      title: "Jadwal Ujian Semester",
      desc: "Jadwal pelaksanaan Penilaian Akhir Semester (PAS) dapat diunduh di bagian agenda.",
      time: "2 jam yang lalu",
      link: "/dashboard/admin/agenda",
      isRead: false,
    },
    {
      id: "3",
      title: "Update Sistem Database",
      desc: "Migrasi ke Supabase Database telah berhasil diselesaikan dengan aman.",
      time: "1 hari yang lalu",
      link: "/dashboard/admin/pengumuman",
      isRead: false,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setNotifOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine role & profile details based on route
  let role = "Administrator";
  let name = "Admin SMK";
  let email = "admin@smk.id";
  let profileUrl = "/dashboard/admin/akun-profil";
  let securityUrl = "/dashboard/admin/keamanan";
  let avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop";

  if (pathname.startsWith("/dashboard/siswa")) {
    role = "Siswa";
    name = "Ahmad Rifai";
    email = "siswa@smk.id";
    profileUrl = "/dashboard/siswa/profil";
    securityUrl = "/dashboard/siswa/keamanan";
    avatarUrl = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop";
  } else if (pathname.startsWith("/dashboard/alumni")) {
    role = "Alumni";
    name = "Dewi Kartika";
    email = "alumni@smk.id";
    profileUrl = "/dashboard/alumni/profil";
    securityUrl = "/dashboard/alumni/keamanan";
    avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop";
  }

  // Determine current page title
  const pathParts = pathname.split("/").filter(Boolean);
  const pageName = pathParts[pathParts.length - 1] || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 md:px-8 shadow-xs">
      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={
          <Button variant="outline" size="icon" className="shrink-0 md:hidden rounded-xl" />
        }>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="sr-only">
             <SheetTitle>Menu Navigasi Dashboard</SheetTitle>
             <SheetDescription>Daftar tautan untuk navigasi pada dashboard</SheetDescription>
          </div>
          <DashboardSidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground/70 hidden sm:inline-block">Portal</span>
        <span className="text-xs text-muted-foreground/40 hidden sm:inline-block">/</span>
        <h1 className="text-base md:text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent capitalize">
          {formattedPageName}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Popover Dropdown */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotifOpen(!notifOpen)}
            className="text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 rounded-xl relative transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-background animate-pulse" />
            )}
            <span className="sr-only">Notifikasi</span>
          </Button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border/60 shadow-xl py-3 z-50 animate-in fade-in-80 zoom-in-95 duration-150">
              <div className="px-4 pb-2.5 mb-2 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">Pemberitahuan Sistem</span>
                  {unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                      {unreadCount} Baru
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold text-[10px]">
                      Sudah Dibaca Semua
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-600 font-medium hover:underline"
                  >
                    Tandai Dibaca Semua
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto px-2 space-y-1">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    onClick={() => markAsRead(item.id)}
                    className={`block p-3 rounded-xl transition-colors border group ${
                      item.isRead
                        ? "bg-transparent border-transparent opacity-70 hover:bg-muted/40"
                        : "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          item.isRead ? "bg-muted-foreground/30" : "bg-emerald-500 animate-pulse"
                        }`}
                      />
                      <div>
                        <p className={`text-xs font-semibold ${item.isRead ? "text-muted-foreground" : "text-foreground group-hover:text-emerald-600"}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {item.desc}
                        </p>
                        <span className="text-[10px] text-muted-foreground/70 font-mono mt-1 block">
                          {item.time} {item.isRead && "• Dibaca"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 mt-2 px-4 border-t border-border/50 text-center">
                <span className="text-[11px] text-muted-foreground font-medium">Semua notifikasi tersimpan</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Interactive User Profile Dropdown */}
        <div className="relative pl-2 border-l border-border/60" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted/60 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/30 shadow-xs group">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground leading-tight flex items-center gap-1">
                {name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{email}</span>
            </div>

            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-emerald-600" : ""}`} />
          </button>

          {/* Dropdown Menu Popup */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border/60 shadow-xl py-2 z-50 animate-in fade-in-80 zoom-in-95 duration-150">
              {/* Header Info */}
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                  <ShieldCheck className="h-3 w-3" />
                  {role}
                </div>
              </div>

              {/* Menu Options */}
              <div className="p-1.5 space-y-0.5">
                <Link
                  href={profileUrl}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 hover:text-emerald-600 rounded-xl transition-colors"
                >
                  <UserCheck className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600" />
                  Manajemen Profil Akun
                </Link>

                <Link
                  href={securityUrl}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 hover:text-emerald-600 rounded-xl transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600" />
                  Pengaturan Keamanan
                </Link>
              </div>

              {/* Footer / Logout */}
              <div className="p-1.5 border-t border-border/50 mt-1">
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar Akun
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
