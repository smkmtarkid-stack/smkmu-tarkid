import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import Image from "next/image";
import Link from "next/link";
import { getDirectImageUrl } from "@/lib/utils";
import { Calendar, User } from "lucide-react";

export const metadata = {
  title: "Berita | SMK Muhammadiyah Tarogong Kidul",
  description: "Kumpulan berita dan artikel terbaru SMK Muhammadiyah Tarogong Kidul",
};

export default async function BeritaPage() {
  const res = await fetchSheetCached("Berita", 60);
  const beritaList = res.data ? [...res.data].reverse() : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container-custom">
        <SectionTitle 
          title="Berita & Artikel Terbaru" 
          subtitle="Ikuti terus perkembangan, kegiatan, dan prestasi dari keluarga besar SMK Muhammadiyah."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beritaList.length > 0 ? (
            beritaList.map((berita: any, i: number) => (
              <div key={berita.id || i} className="group rounded-2xl overflow-hidden border bg-card flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden bg-muted">
                  {berita.thumbnail ? (
                    <Image
                      src={getDirectImageUrl(berita.thumbnail)}
                      alt={berita.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">Tidak Ada Gambar</div>
                  )}
                  <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {berita.kategori || "Umum"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{berita.tanggal}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {berita.judul}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                    {berita.isi}
                  </p>
                  <Link href={`/berita/${berita.id}`} className="text-sm font-semibold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 py-2 px-4 rounded-full text-center hover:bg-brand-primary hover:text-white transition-colors mt-auto">
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-20 bg-muted/30 rounded-2xl border">
              Belum ada berita yang diterbitkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
