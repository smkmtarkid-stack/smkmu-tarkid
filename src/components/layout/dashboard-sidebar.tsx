"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, GraduationCap, ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adminNav, siswaNav, alumniNav } from "@/constants/navigation";
import * as Icons from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
  onClose?: () => void;
}

function SidebarItem({ item, pathname, onClose }: { item: any, pathname: string, onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(pathname.startsWith(item.href || "#"));
  const Icon = (Icons as any)[item.icon || "Circle"] || Icons.Circle;
  const hasChildren = item.children && item.children.length > 0;
  
  if (!hasChildren) {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/25 font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20"
        )}
      >
        <Icon className={cn("h-4 w-4 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-emerald-600")} />
        <span className="truncate">{item.label}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
      </Link>
    );
  }

  const isChildActive = item.children.some((child: any) => pathname === child.href);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 w-full text-left",
          isChildActive && !isOpen
             ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold"
             : "text-muted-foreground hover:text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20"
        )}
      >
        <Icon className={cn("h-4 w-4 transition-transform duration-200 group-hover:scale-110", isChildActive && !isOpen ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground group-hover:text-emerald-600")} />
        <span className="truncate flex-1">{item.label}</span>
        {isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
      </button>
      
      {isOpen && (
        <div className="pl-9 pr-2 py-1 flex flex-col gap-1 border-l-2 border-emerald-100 dark:border-emerald-900/50 ml-5">
          {item.children.map((child: any, idx: number) => {
            const ChildIcon = (Icons as any)[child.icon || "Circle"] || Icons.Circle;
            const isChildActiveItem = pathname === child.href;
            
            return (
              <Link
                key={idx}
                href={child.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isChildActiveItem
                    ? "bg-emerald-100/50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20"
                )}
              >
                <ChildIcon className={cn("h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110", isChildActiveItem ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground group-hover:text-emerald-600")} />
                <span className="truncate">{child.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardSidebar({ className, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  // Determine which navigation to show based on URL
  let navItems = adminNav;
  let roleLabel = "Administrator";
  
  if (pathname.startsWith("/dashboard/siswa")) {
    navItems = siswaNav;
    roleLabel = "Siswa";
  } else if (pathname.startsWith("/dashboard/alumni")) {
    navItems = alumniNav;
    roleLabel = "Alumni";
  } else if (pathname.startsWith("/dashboard/super-admin")) {
    // Optionally super admin
    roleLabel = "Super Admin";
  }

  return (
    <div className={cn("flex h-full flex-col bg-card/95 backdrop-blur-md border-r border-border/60 text-card-foreground shadow-sm", className)}>
      <div className="p-5 border-b border-border/60 flex items-center gap-3.5 bg-gradient-to-br from-emerald-900/5 via-transparent to-transparent">
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2.5 rounded-xl text-white shadow-md shadow-emerald-600/20">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-base leading-none mb-1 bg-gradient-to-r from-emerald-950 to-emerald-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Portal SMK
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 uppercase tracking-wider w-fit">
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Menu Utama
        </div>
        <nav className="grid gap-1">
          {navItems.map((item, index) => (
            <SidebarItem key={index} item={item} pathname={pathname} onClose={onClose} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border/60 bg-muted/20">
        <Link href="/login" className="w-full">
          <Button variant="ghost" className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium">
            <LogOut className="mr-2.5 h-4 w-4" />
            Keluar Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
