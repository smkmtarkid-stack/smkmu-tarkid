import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import Image from "next/image";
import { getDirectImageUrl } from "@/lib/utils";
import { Trophy, Medal, Award } from "lucide-react";

export const metadata = {
  title: "Prestasi | SMK Muhammadiyah Tarogong Kidul",
  description: "Daftar prestasi siswa dan sekolah SMK Muhammadiyah Tarogong Kidul",
};

export default async function PrestasiPage() {
  const res = await fetchSheetCached("Prestasi", 60);
  const prestasiList = res.data ? [...res.data].reverse() : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container-custom">
        <SectionTitle 
          title="Prestasi Membanggakan" 
          subtitle="Deretan prestasi yang diraih oleh siswa-siswi dan SMK Muhammadiyah Tarogong Kidul."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prestasiList.length > 0 ? (
            prestasiList.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-52 bg-muted overflow-hidden">
                  {item.foto ? (
                    <Image
                      src={getDirectImageUrl(item.foto)}
                      alt={item.prestasi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
                      <Trophy className="h-16 w-16 text-brand-secondary/40" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-bold rounded-full">
                      <Medal className="h-3 w-3" /> {item.tingkat}
                    </span>
                    {item.tahun && (
                      <span className="text-xs text-muted-foreground font-medium">{item.tahun}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">{item.prestasi}</h3>
                  <p className="text-sm text-muted-foreground">{item.nama}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-20 bg-muted/30 rounded-2xl border">
              Data prestasi belum tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
