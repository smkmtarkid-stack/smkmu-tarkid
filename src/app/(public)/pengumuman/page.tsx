import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import { Bell, Calendar, AlertCircle, Info, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Pengumuman | SMK Muhammadiyah Tarogong Kidul",
  description: "Pengumuman resmi SMK Muhammadiyah Tarogong Kidul",
};

function getPriorityStyle(prioritas: string) {
  switch ((prioritas || "").toLowerCase()) {
    case "tinggi":
    case "penting":
      return { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", icon: AlertCircle };
    case "sedang":
      return { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", icon: Info };
    default:
      return { bg: "bg-background border-border", badge: "bg-green-100 text-green-700", icon: CheckCircle };
  }
}

export default async function PengumumanPage() {
  const res = await fetchSheetCached("Pengumuman", 60);
  const pengumumanList = res.data ? [...res.data].reverse() : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30">
      <div className="container-custom max-w-4xl">
        <SectionTitle 
          title="Pengumuman Sekolah" 
          subtitle="Informasi dan pengumuman penting dari SMK Muhammadiyah Tarogong Kidul."
          className="mb-12"
        />

        <div className="space-y-5">
          {pengumumanList.length > 0 ? (
            pengumumanList.map((item: any, i: number) => {
              const style = getPriorityStyle(item.prioritas);
              const PriorityIcon = style.icon;
              return (
                <div key={item.id || i} className={`rounded-2xl border shadow-sm p-6 ${style.bg} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bell className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{item.judul}</h3>
                        {item.prioritas && (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${style.badge}`}>
                            <PriorityIcon className="h-3 w-3" /> {item.prioritas}
                          </span>
                        )}
                      </div>
                      {item.tanggal && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{item.tanggal}</span>
                        </div>
                      )}
                      <p className="text-muted-foreground whitespace-pre-wrap">{item.isi}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-20 bg-background rounded-2xl border">
              Belum ada pengumuman saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
