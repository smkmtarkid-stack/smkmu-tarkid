import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import Image from "next/image";
import { getDirectImageUrl } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "Jurusan | SMK Muhammadiyah Tarogong Kidul",
  description: "Daftar Kompetensi Keahlian di SMK Muhammadiyah Tarogong Kidul",
};

export default async function JurusanPage() {
  const res = await fetchSheetCached("Jurusan", 60);
  const jurusanList = res.data || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30">
      <div className="container-custom">
        <SectionTitle 
          title="Kompetensi Keahlian" 
          subtitle="Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang lebih cerah."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jurusanList.length > 0 ? (
            jurusanList.map((dept: any, i: number) => (
              <div
                key={dept.id || i}
                className="bg-background rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-brand-primary/10 text-brand-primary overflow-hidden relative">
                  {dept.foto ? (
                    <Image src={getDirectImageUrl(dept.foto)} alt={dept.nama} fill className="object-cover" />
                  ) : (
                    <BookOpen className="h-8 w-8" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-brand-primary">{dept.nama}</h3>
                <div className="w-12 h-1 bg-brand-secondary rounded-full mb-4 group-hover:w-24 transition-all duration-300" />
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {dept.deskripsi}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-20 bg-background rounded-2xl border">
              Data kompetensi keahlian belum tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
