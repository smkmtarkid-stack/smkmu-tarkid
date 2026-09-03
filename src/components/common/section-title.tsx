"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  center = true,
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(center && "text-center", "mb-12 lg:mb-16", className)}
    >
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold mb-4",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>

      {/* Decorative line */}
      <div
        className={cn(
          "flex items-center gap-2 mb-4",
          center && "justify-center"
        )}
      >
        <span className="h-1 w-8 rounded-full bg-brand-secondary" />
        <span className="h-1 w-16 rounded-full bg-brand-primary" />
        <span className="h-1 w-8 rounded-full bg-brand-secondary" />
      </div>

      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg max-w-2xl leading-relaxed",
            center && "mx-auto",
            light ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
