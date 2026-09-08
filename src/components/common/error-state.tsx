"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ErrorState({
  title = "Data belum dapat dimuat",
  description = "Terjadi kendala saat mengambil informasi. Silakan coba lagi.",
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex min-h-32 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/20 ${className}`}>
      <AlertCircle className="mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
      <p className="font-semibold text-red-900 dark:text-red-200">{title}</p>
      <p className="mt-2 max-w-md text-sm text-red-700/80 dark:text-red-300/80">{description}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        <RefreshCw className="h-4 w-4" />
        Coba lagi
      </button>
    </div>
  );
}
