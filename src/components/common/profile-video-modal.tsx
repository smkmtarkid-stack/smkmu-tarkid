"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileVideoModalProps {
  open: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export function ProfileVideoModal({ open, onClose, videoUrl }: ProfileVideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Video profil sekolah</DialogTitle>
        <DialogDescription className="sr-only">Video profil SMK Muhammadiyah Tarogong Kidul</DialogDescription>
        {videoUrl ? (
          <div className="aspect-video bg-brand-accent">
            <iframe
              src={videoUrl}
              title="Video profil SMK Muhammadiyah Tarogong Kidul"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <PlayCircle className="h-14 w-14 text-brand-primary" />
            <div>
              <h3 className="text-xl font-bold">Video profil belum tersedia</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Video profil akan ditampilkan di sini setelah URL video dikonfigurasi.
              </p>
            </div>
            <Link href="/profil" onClick={onClose} className="text-sm font-semibold text-brand-primary hover:underline">
              Kenali sekolah kami
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
