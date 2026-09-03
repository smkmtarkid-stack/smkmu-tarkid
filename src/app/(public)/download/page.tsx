import { fetchSheetCached } from "@/lib/api";
import { SectionTitle } from "@/components/common/section-title";
import { getDirectImageUrl } from "@/lib/utils";
import { Download as DownloadIcon, FileText, FileSpreadsheet, FileImage, File } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Download | SMK Muhammadiyah Tarogong Kidul",
  description: "Unduh berkas dan dokumen resmi SMK Muhammadiyah Tarogong Kidul",
};

function getFileIcon(kategori: string) {
  const kat = (kategori || "").toLowerCase();
  if (kat.includes("formulir") || kat.includes("form")) return FileText;
  if (kat.includes("data") || kat.includes("excel")) return FileSpreadsheet;
  if (kat.includes("brosur") || kat.includes("gambar")) return FileImage;
  return File;
}

export default async function DownloadPage() {
  const res = await fetchSheetCached("Download", 60);
  const downloadList = res.data || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container-custom max-w-4xl">
        <SectionTitle 
          title="Pusat Unduhan" 
          subtitle="Unduh berbagai berkas, formulir, dan dokumen resmi dari sekolah."
          className="mb-12"
        />

        <div className="space-y-4">
          {downloadList.length > 0 ? (
            downloadList.map((item: any, i: number) => {
              const IconComp = getFileIcon(item.kategori);
              const fileUrl = item.link ? getDirectImageUrl(item.link) : "#";
              return (
                <div key={item.id || i} className="bg-card rounded-xl border shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <IconComp className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg truncate">{item.nama_file}</h3>
                    <p className="text-sm text-muted-foreground">{item.kategori}</p>
                  </div>
                  <Link 
                    href={fileUrl} 
                    target="_blank"
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary-dark transition-colors"
                  >
                    <DownloadIcon className="h-4 w-4" /> Unduh
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-2xl border">
              Belum ada file untuk diunduh.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
