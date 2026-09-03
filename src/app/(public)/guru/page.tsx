import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import Image from "next/image";
import { getDirectImageUrl } from "@/lib/utils";
import { User } from "lucide-react";

export const metadata = {
  title: "Guru & Staff | SMK Muhammadiyah Tarogong Kidul",
  description: "Daftar tenaga pendidik dan kependidikan SMK Muhammadiyah Tarogong Kidul",
};

export default async function GuruPage() {
  const res = await fetchSheetCached("Guru", 60);
  const guruList = res.data || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container-custom">
        <SectionTitle 
          title="Guru & Tenaga Kependidikan" 
          subtitle="Para pendidik profesional yang berdedikasi tinggi dalam membentuk generasi unggul."
          className="mb-12"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {guruList.length > 0 ? (
            guruList.map((guru: any, i: number) => (
              <div key={guru.id || i} className="group text-center">
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-muted mb-4 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  {guru.foto ? (
                    <Image
                      src={getDirectImageUrl(guru.foto)}
                      alt={guru.nama}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-brand-primary/5">
                      <User className="h-16 w-16 text-brand-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-brand-primary transition-colors">{guru.nama}</h3>
                <p className="text-xs text-muted-foreground mt-1">{guru.jabatan || "Guru"}</p>
                <p className="text-xs text-brand-secondary font-medium mt-0.5">{guru.mapel}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-20 bg-muted/30 rounded-2xl border">
              Data guru belum tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
