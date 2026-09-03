import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Download, Bell } from "lucide-react";

export default function SiswaDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Portal Siswa</h1>
        <p className="text-muted-foreground">
          Selamat datang di Portal Siswa SMK Muhammadiyah Tarogong Kidul.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards Mockup */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Mapel</div>
            <p className="text-xs text-muted-foreground mt-1">Mulai pukul 07:15</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengumuman Baru</CardTitle>
            <Bell className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Belum dibaca</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Tertunda</CardTitle>
            <BookOpen className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground mt-1">Batas waktu hari ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pengumuman Terbaru</CardTitle>
            <CardDescription>Informasi penting dari pihak sekolah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1 pb-4 border-b last:border-0 last:pb-0">
                <span className="text-xs font-medium text-brand-primary">12 Juli 2026</span>
                <h4 className="font-semibold text-sm">Persiapan Penilaian Akhir Semester (PAS)</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Diberitahukan kepada seluruh siswa bahwa PAS akan dilaksanakan mulai pekan depan. Harap melengkapi seluruh persyaratan.
                </p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">Lihat Semua Pengumuman</Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Materi & Dokumen</CardTitle>
            <CardDescription>Berkas yang dibagikan oleh guru.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Materi Matematika Bab {i}</h4>
                    <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Unduh</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
