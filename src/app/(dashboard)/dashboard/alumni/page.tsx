import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Building, GraduationCap } from "lucide-react";

export default function AlumniDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Portal Alumni</h1>
        <p className="text-muted-foreground">
          Selamat datang di Portal Alumni SMK Muhammadiyah Tarogong Kidul. Tetap terhubung dengan almamater!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-brand-primary text-white border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Status Tracer Study</CardTitle>
            <MapPin className="h-4 w-4 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Belum Diisi</div>
            <p className="text-xs text-white/70 mt-1">Mohon luangkan waktu 5 menit</p>
            <Button variant="secondary" size="sm" className="w-full mt-4 bg-white text-brand-primary hover:bg-white/90">
              Isi Kuisioner Sekarang
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowongan Kerja</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Baru</div>
            <p className="text-xs text-muted-foreground mt-1">Sesuai keahlian Anda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info Kampus</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Info</div>
            <p className="text-xs text-muted-foreground mt-1">Beasiswa & Pendaftaran</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lowongan Pekerjaan Terbaru</CardTitle>
            <CardDescription>Peluang karir dari mitra industri sekolah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-md">
                    <Briefcase className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Teknisi Jaringan & IT Support</h4>
                    <p className="text-xs text-muted-foreground">PT Teknologi Nusantara • Garut</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Detail</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Update Profil Anda</CardTitle>
            <CardDescription>Pastikan data riwayat karir Anda selalu mutakhir.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-semibold">Bantu Sekolah Mengembangkan Mutu</h4>
            <p className="text-sm text-muted-foreground mt-2 max-w-[80%]">
              Dengan mengupdate data pekerjaan atau perguruan tinggi, Anda membantu peningkatan akreditasi sekolah.
            </p>
            <Button className="mt-6">Perbarui Profil</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
