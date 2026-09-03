import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to convert Google Drive viewer links to direct download links for images
export function getDirectImageUrl(url: string) {
  if (!url) return url;
  if (url.includes("drive.google.com/file/d/")) {
    const id = url.split("/file/d/")[1]?.split("/")[0];
    if (id) {
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }
  return url;
}
