import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import Image from "next/image";
import { getDirectImageUrl } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export const metadata = {
  title: "Galeri | SMK Muhammadiyah Tarogong Kidul",
  description: "Galeri foto kegiatan SMK Muhammadiyah Tarogong Kidul",
};

export default async function GaleriPage() {
  const res = await fetchSheetCached("Galeri", 60);
  const galeriList = res.data || [];

  // Group by kategori
  const grouped: Record<string, any[]> = {};
  galeriList.forEach((item: any) => {
    const kat = item.kategori || "Lainnya";
    if (!grouped[kat]) grouped[kat] = [];
    grouped[kat].push(item);
  });
  const categories = Object.keys(grouped);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30">
      <div className="container-custom">
        <SectionTitle 
          title="Galeri Foto" 
          subtitle="Dokumentasi berbagai kegiatan, fasilitas, dan momen berharga di SMK Muhammadiyah."
          className="mb-12"
        />

        {galeriList.length > 0 ? (
          categories.map((kategori) => (
            <div key={kategori} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-brand-primary/20">
                <span className="text-brand-primary">#</span> {kategori}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grouped[kategori].map((item: any, i: number) => (
                  <div key={item.id || i} className="group relative aspect-square rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                    {item.gambar ? (
                      <Image
                        src={getDirectImageUrl(item.gambar)}
                        alt={item.deskripsi || "Galeri"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-brand-primary/5">
                        <ImageIcon className="h-12 w-12 text-brand-primary/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm font-medium line-clamp-2">{item.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-20 bg-background rounded-2xl border">
            Galeri foto belum tersedia.
          </div>
        )}
      </div>
    </div>
  );
}
