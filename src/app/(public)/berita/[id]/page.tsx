import { fetchSheetCached } from "@/lib/api";
import { getDirectImageUrl } from "@/lib/utils";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface NewsArticle {
  id: string;
  judul: string;
  kategori?: string;
  tanggal?: string;
  isi: string;
  thumbnail?: string;
}

export const metadata = {
  title: "Detail Berita | SMK Muhammadiyah Tarogong Kidul",
  description: "Baca berita dan artikel terbaru SMK Muhammadiyah Tarogong Kidul.",
};

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchSheetCached("Berita", 60);

  if (res.status === "error") {
    notFound();
  }

  const articles = (res.data ?? []) as unknown as NewsArticle[];
  const article = articles.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <article className="container-custom max-w-4xl">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke berita
        </Link>

        <header className="mt-8">
          <span className="inline-flex rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-primary">
            {article.kategori || "Umum"}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            {article.judul}
          </h1>
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{article.tanggal || "Tanggal tidak tersedia"}</span>
          </div>
        </header>

        {article.thumbnail ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={getDirectImageUrl(article.thumbnail)}
              alt={article.judul}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-muted-foreground">
          {article.isi}
        </div>
      </article>
    </main>
  );
}
