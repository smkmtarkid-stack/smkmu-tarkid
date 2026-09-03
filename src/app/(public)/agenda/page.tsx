import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";

export const metadata = {
  title: "Agenda | SMK Muhammadiyah Tarogong Kidul",
  description: "Agenda kegiatan sekolah SMK Muhammadiyah Tarogong Kidul",
};

export default async function AgendaPage() {
  const res = await fetchSheetCached("Agenda", 60);
  const agendaList = res.data ? [...res.data].reverse() : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/30">
      <div className="container-custom max-w-4xl">
        <SectionTitle 
          title="Agenda Sekolah" 
          subtitle="Jadwal kegiatan akademik maupun non-akademik di SMK Muhammadiyah."
          className="mb-12"
        />

        <div className="space-y-6">
          {agendaList.length > 0 ? (
            agendaList.map((agenda: any, i: number) => {
              const dateObj = new Date(agenda.tanggal);
              const day = dateObj.getDate() || "-";
              const month = dateObj.toLocaleString('id-ID', { month: 'short' }) || "-";
              const year = dateObj.getFullYear() || "-";

              return (
                <div key={agenda.id || i} className="bg-background rounded-2xl border shadow-sm flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
                  {/* Date Box */}
                  <div className="bg-brand-primary text-white p-6 sm:w-40 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="text-4xl font-bold leading-none mb-1">{day}</span>
                    <span className="text-lg uppercase font-medium">{month}</span>
                    <span className="text-white/80">{year}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-grow">
                    <div className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-bold rounded-full mb-3">
                      {agenda.kategori || "Kegiatan"}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{agenda.nama_kegiatan}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      {agenda.waktu && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-primary" />
                          <span>Pukul: {agenda.waktu}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-primary" />
                        <span>{agenda.tempat || "Kampus SMK Muhammadiyah"}</span>
                      </div>
                      {agenda.penyelenggara && (
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Tag className="h-4 w-4 text-brand-primary" />
                          <span>Penyelenggara: {agenda.penyelenggara}</span>
                        </div>
                      )}
                    </div>
                    
                    {agenda.deskripsi && (
                      <p className="text-muted-foreground pt-4 border-t border-border mt-4">
                        {agenda.deskripsi}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-20 bg-background rounded-2xl border">
              Belum ada agenda terdekat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
