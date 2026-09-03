"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-brand-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pattern-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl text-white"
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-white/70 mb-6 flex-wrap">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              Beranda
            </Link>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
              </div>
            ))}
          </nav>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
