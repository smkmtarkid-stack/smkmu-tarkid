"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Users, 
  GraduationCap, 
  Trophy, 
  Briefcase, 
  BookOpen, 
  Calendar,
  PlayCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/section-title";
import { siteConfig } from "@/constants/site";
import { getDirectImageUrl } from "@/lib/utils";

interface LandingPageProps {
  sliders: any[];
  sambutan: any | null;
  stats: {
    siswa: number;
    guru: number;
    jurusan: number;
    prestasi: number;
  };
  jurusanList: any[];
  beritaList: any[];
  agendaList: any[];
}

export function LandingPageContent({
  sliders,
  sambutan,
  stats,
  jurusanList,
  beritaList,
  agendaList
}: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!sliders || sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  const activeSlider = sliders && sliders.length > 0 ? sliders[currentSlide] : null;

  return (
    <>
      {/* 1. Hero Section (Dynamic Slider) */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <AnimatePresence mode="wait">
            {activeSlider ? (
              <motion.div
                key={activeSlider.id || currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeSlider.gambar ? getDirectImageUrl(activeSlider.gambar) : "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"}
                  alt={activeSlider.judul || "Sekolah"}
                  fill
                  className="object-cover opacity-70 mix-blend-overlay"
                  priority
                />
              </motion.div>
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                alt="Sekolah Default"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
                priority
              />
            )}
          </AnimatePresence>
        </div>
        
        <div className="container-custom relative z-20 text-center text-white mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlider ? activeSlider.id : "default"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-brand-secondary/20 border border-brand-secondary/50 text-brand-secondary font-medium mb-6 backdrop-blur-sm">
                Penerimaan Peserta Didik Baru Telah Dibuka
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {activeSlider ? activeSlider.judul : <>Selamat Datang di <br /><span className="text-brand-secondary">SMK Muhammadiyah</span> Tarogong Kidul</>}
              </h1>
              <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                {activeSlider ? activeSlider.deskripsi : "Mencetak generasi muda yang berakhlak mulia, cerdas, terampil, dan siap bersaing di era digital."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-brand-secondary hover:bg-brand-secondary-dark text-white rounded-full px-8 h-14 text-base w-full sm:w-auto">
                  {activeSlider && activeSlider.tombol ? activeSlider.tombol : "Daftar PPDB Sekarang"}
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-primary">
                  Jelajahi Jurusan
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        {sliders && sliders.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentSlide(prev => prev === 0 ? sliders.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => prev === sliders.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {sliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? "bg-brand-secondary w-8" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Scroll Down Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center p-2">
            <div className="w-1.5 h-3 bg-brand-secondary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 2. Principal Welcome (Dynamic) */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] lg:aspect-square max-w-md mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-brand-primary/20 z-10 rounded-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                alt="Kepala Sekolah"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 text-white">
                <h3 className="font-bold text-xl">{siteConfig.school.headmaster}</h3>
                <p className="text-brand-secondary">Kepala Sekolah</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionTitle 
                title={sambutan ? sambutan.judul : "Sambutan Kepala Sekolah"} 
                center={false}
                subtitle="Assalamu'alaikum Warahmatullahi Wabarakatuh"
                className="mb-6"
              />
              <div className="prose prose-lg text-muted-foreground mb-8 whitespace-pre-wrap">
                {sambutan ? (
                  <p>{sambutan.isi}</p>
                ) : (
                  <>
                    <p>Puji syukur kita panjatkan ke hadirat Allah SWT. Selamat datang di website resmi SMK Muhammadiyah Tarogong Kidul.</p>
                    <p>Di era digital yang berkembang pesat ini, kami berkomitmen untuk tidak hanya membekali siswa dengan kompetensi keahlian yang mumpuni, tetapi juga karakter islami yang kuat berlandaskan nilai-nilai Kemuhammadiyahan.</p>
                    <p>Mari bergabung bersama kami menjadi bagian dari generasi cerdas, mandiri, dan berakhlak mulia.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Statistics (Dynamic from DB length) */}
      <section className="py-16 bg-brand-primary text-white relative">
        <div className="absolute inset-0 pattern-overlay opacity-10" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
            {[
              { label: "Siswa Aktif", value: stats.siswa + "+", icon: Users },
              { label: "Tenaga Pendidik", value: stats.guru + "+", icon: Briefcase },
              { label: "Kompetensi Keahlian", value: stats.jurusan, icon: BookOpen },
              { label: "Prestasi", value: stats.prestasi + "+", icon: Trophy },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center px-4"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-brand-secondary opacity-80" />
                <h3 className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</h3>
                <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Departments / Jurusan (Dynamic) */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <SectionTitle 
            title="Kompetensi Keahlian" 
            subtitle="Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang lebih cerah."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jurusanList && jurusanList.length > 0 ? (
              jurusanList.map((dept, i) => (
                <motion.div
                  key={dept.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-background rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-brand-primary/10 text-brand-primary overflow-hidden relative">
                    {dept.foto ? (
                      <Image src={getDirectImageUrl(dept.foto)} alt={dept.nama} fill className="object-cover" />
                    ) : (
                      <BookOpen className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{dept.nama}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {dept.deskripsi}
                  </p>
                  <Link href={`/jurusan`} className="text-sm font-medium text-brand-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lihat Detail <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">Data jurusan belum tersedia.</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Latest News & Agenda (Dynamic) */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* News */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Berita Terbaru</h2>
                <Link href="/berita" className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {beritaList && beritaList.length > 0 ? (
                  beritaList.map((berita, i) => (
                    <div key={berita.id || i} className="group rounded-2xl overflow-hidden border bg-card">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {berita.thumbnail ? (
                          <Image
                            src={getDirectImageUrl(berita.thumbnail)}
                            alt={berita.judul}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                        )}
                        <div className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          {berita.kategori || "Umum"}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{berita.tanggal}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                          {berita.judul}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {berita.isi}
                        </p>
                        <Link href={`/berita`} className="text-sm font-medium text-brand-primary">
                          Baca Selengkapnya
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-muted-foreground">Belum ada berita terbaru.</div>
                )}
              </div>
            </div>

            {/* Agenda */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Agenda Terdekat</h2>
                <Link href="/agenda" className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                  Semua <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {agendaList && agendaList.length > 0 ? (
                  agendaList.map((agenda, i) => {
                    const dateObj = new Date(agenda.tanggal);
                    const day = dateObj.getDate() || "-";
                    const month = dateObj.toLocaleString('id-ID', { month: 'short' }) || "-";

                    return (
                      <div key={agenda.id || i} className="flex gap-4 p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center bg-brand-primary text-white rounded-lg p-3 min-w-[70px] text-center">
                          <span className="text-2xl font-bold leading-none">{day}</span>
                          <span className="text-xs uppercase mt-1">{month}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm mb-1 line-clamp-2">{agenda.nama_kegiatan}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {agenda.tempat || "Kampus SMK Muhammadiyah"}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-muted-foreground">Belum ada agenda terdekat.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Video Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop"
          alt="Video Background"
          fill
          className="object-cover opacity-40"
        />
        <div className="container-custom relative z-10 text-center">
          <Button size="icon" className="w-20 h-20 rounded-full bg-brand-secondary hover:bg-brand-secondary-light text-white mb-8 mx-auto animate-pulse">
            <PlayCircle className="h-10 w-10" />
          </Button>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Profil SMK Muhammadiyah</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Saksikan video profil sekolah kami untuk mengenal lebih dekat lingkungan, fasilitas, dan kegiatan belajar mengajar.
          </p>
        </div>
      </section>

      {/* 7. CTA / PPDB */}
      <section className="section-padding gradient-primary text-white">
        <div className="container-custom text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-brand-secondary" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Mari Bergabung Bersama Kami!</h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran Baru telah dibuka. Daftarkan diri Anda sekarang dan jadilah bagian dari generasi juara.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90 rounded-full px-8 h-14 text-base">
              Daftar Sekarang
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 h-14 text-base">
              Informasi PPDB
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
