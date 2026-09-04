"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronDown, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      
      {open && (
        <motion.div
          key="mobile-nav-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-background shadow-2xl lg:hidden flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                <div className="relative w-8 h-8">
                  <Image
                    src={siteConfig.logo}
                    alt={siteConfig.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-sm">SMK Muhammadiyah</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {mainNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItem === item.href;

                return (
                  <div key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={hasChildren ? "#" : item.href}
                        onClick={(e) => {
                          if (hasChildren) {
                            e.preventDefault();
                            setExpandedItem(isExpanded ? null : item.href);
                          }
                        }}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors",
                          isActive
                            ? "text-brand-primary bg-brand-primary/5"
                            : "text-foreground/80 hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                        {hasChildren && (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 ml-auto transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        )}
                      </Link>
                    </div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {hasChildren && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-accent/50"
                        >
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block pl-14 pr-6 py-3 text-sm transition-colors",
                                pathname === child.href
                                  ? "text-brand-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground"
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

            {/* Footer */}
            <div className="p-4 border-t">
              <Link href="/login" onClick={onClose}>
                <Button className="w-full gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
