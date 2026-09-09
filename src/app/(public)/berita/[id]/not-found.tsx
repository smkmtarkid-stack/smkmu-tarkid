import Link from "next/link";

export default function NewsNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
          Berita
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          Berita tidak ditemukan
        </h1>
        <p className="mt-4 text-muted-foreground">
          Berita yang Anda cari mungkin sudah dihapus atau belum diterbitkan.
        </p>
        <Link
          href="/berita"
          className="mt-8 inline-flex rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
        >
          Kembali ke daftar berita
        </Link>
      </div>
    </main>
  );
}
