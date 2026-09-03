"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, LogIn, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { mainNavigation } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { MobileNav } from "./mobile-nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const { scrolled } = useScroll(20);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isTransparent
            ? "bg-transparent"
            : "glass shadow-lg shadow-black/5"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "font-bold text-sm lg:text-base leading-tight transition-colors",
                    isTransparent ? "text-white" : "text-foreground"
                  )}
                >
                  SMK Muhammadiyah
                </p>
                <p
                  className={cn(
                    "text-xs lg:text-sm transition-colors",
                    isTransparent
                      ? "text-white/80"
                      : "text-muted-foreground"
                  )}
                >
                  Tarogong Kidul
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() =>
                      hasChildren && setHoveredDropdown(item.href)
                    }
                    onMouseLeave={() => setHoveredDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isTransparent
                          ? isActive
                            ? "text-brand-secondary"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : isActive
                          ? "text-brand-primary bg-brand-primary/5"
                          : "text-foreground/80 hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.label}
                      {hasChildren && (
                        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
                      )}
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {hasChildren && hoveredDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-60 py-2 rounded-xl glass shadow-xl shadow-black/10"
                        >
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-4 py-2.5 text-sm transition-colors",
                                pathname === child.href
                                  ? "text-brand-primary bg-brand-primary/5 font-medium"
                                  : "text-foreground/80 hover:text-brand-primary hover:bg-accent"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full",
                  isTransparent
                    ? "text-white hover:bg-white/10"
                    : ""
                )}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Login Button */}
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant={isTransparent ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    "rounded-full gap-2",
                    isTransparent
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "bg-brand-primary hover:bg-brand-primary-dark text-white"
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "lg:hidden rounded-full",
                  isTransparent ? "text-white hover:bg-white/10" : ""
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
