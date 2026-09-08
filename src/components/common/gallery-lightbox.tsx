"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDirectImageUrl } from "@/lib/utils";

export interface LightboxItem {
  id?: string | number;
  gambar?: string;
  deskripsi?: string;
  kategori?: string;
}

interface GalleryLightboxProps {
  items: LightboxItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  selectedIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const item = selectedIndex === null ? null : items[selectedIndex];
  const currentIndex = selectedIndex ?? 0;

  return (
    <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl border-white/10 bg-brand-accent p-2 text-white sm:p-4">
        <DialogTitle className="sr-only">Pratinjau galeri</DialogTitle>
        <DialogDescription className="sr-only">
          Pratinjau foto kegiatan sekolah
        </DialogDescription>
        {item && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/30">
            {item.gambar ? (
              <Image
                src={getDirectImageUrl(item.gambar)}
                alt={item.deskripsi || "Galeri sekolah"}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/70">Foto tidak tersedia.</div>
            )}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate(currentIndex === 0 ? items.length - 1 : currentIndex - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-brand-secondary"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(currentIndex === items.length - 1 ? 0 : currentIndex + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-brand-secondary"
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        )}
        {item && (
          <div className="px-2 pb-1 pt-2">
            <p className="text-sm font-medium text-brand-secondary">{item.kategori || "Galeri sekolah"}</p>
            <p className="mt-1 text-sm text-white/75">{item.deskripsi || "Dokumentasi kegiatan sekolah"}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
