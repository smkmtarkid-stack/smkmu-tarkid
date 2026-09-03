import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";

export const metadata = {
  title: "Profil Sekolah | SMK Muhammadiyah Tarogong Kidul",
  description: "Profil lengkap SMK Muhammadiyah Tarogong Kidul",
};

export default async function ProfilPage() {
  const res = await fetchSheetCached("Profil", 60);
  const profilList = res.data || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container-custom max-w-4xl">
        <SectionTitle 
          title="Profil Sekolah" 
          subtitle="Mengenal lebih dekat SMK Muhammadiyah Tarogong Kidul."
          className="mb-12"
        />

        <div className="space-y-12">
          {profilList.length > 0 ? (
            profilList.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-card rounded-2xl border shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4 text-brand-primary pb-3 border-b border-brand-primary/20">
                  {item.judul}
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {item.isi}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-2xl border">
              Data profil sekolah belum tersedia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
