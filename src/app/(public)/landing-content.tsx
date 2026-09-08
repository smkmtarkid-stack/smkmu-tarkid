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
  ChevronRight,
  Medal,
  ImageIcon
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/section-title";
import { Counter } from "@/components/common/counter";
import { GalleryLightbox } from "@/components/common/gallery-lightbox";
import { ProfileVideoModal } from "@/components/common/profile-video-modal";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { siteConfig } from "@/constants/site";
import { getDirectImageUrl, cn } from "@/lib/utils";

interface SliderData {
  id?: string | number;
  judul?: string;
  deskripsi?: string;
  gambar?: string;
  tombol?: string;
}

interface WelcomeData {
  judul?: string;
  isi?: string;
  gambar?: string;
  keterangan?: string;
}

interface DepartmentData {
  id?: string | number;
  nama?: string;
  deskripsi?: string;
  foto?: string;
}

interface NewsData {
  id?: string | number;
  judul?: string;
  kategori?: string;
  tanggal?: string;
  isi?: string;
  thumbnail?: string;
}

interface AgendaData {
  id?: string | number;
  tanggal?: string;
  nama_kegiatan?: string;
  tempat?: string;
}

interface AchievementData {
  id?: string | number;
  foto?: string;
  prestasi?: string;
  tingkat?: string;
  tahun?: string | number;
  nama?: string;
}

interface GalleryData {
  id?: string | number;
  gambar?: string;
  deskripsi?: string;
  kategori?: string;
}

type ContentState = "success" | "empty" | "error";

interface LandingPageProps {
  sliders: SliderData[];
  sambutan: WelcomeData | null;
  stats: {
    siswa: number;
    guru: number;
    jurusan: number;
    prestasi: number;
  };
  jurusanList: DepartmentData[];
  beritaList: NewsData[];
  agendaList: AgendaData[];
  prestasiList: AchievementData[];
  galeriList: GalleryData[];
  contentState: {
    sliders: ContentState;
    profil: ContentState;
    jurusan: ContentState;
    berita: ContentState;
    agenda: ContentState;
    prestasi: ContentState;
    galeri: ContentState;
    stats: "success" | "error";
  };
}

export function LandingPageContent({
  sliders,
  sambutan,
  stats,
  jurusanList,
  beritaList,
  agendaList,
  prestasiList,
  galeriList,
  contentState
}: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const profileVideoUrl = process.env.NEXT_PUBLIC_PROFILE_VIDEO_URL;

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
      <section className="relative flex min-h-[680px] items-center overflow-hidden py-28 lg:min-h-[760px]">
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
                  src={activeSlider.gambar ? getDirectImageUrl(activeSlider.gambar) : "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"}
                  alt={activeSlider.judul || "Sekolah"}
                  fill
                  className="object-cover opacity-70 mix-blend-overlay"
                  priority
                  sizes="100vw"
                  unoptimized={!activeSlider.gambar || activeSlider.gambar.includes("unsplash.com")}
                />
              </motion.div>
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"
                alt="Sekolah Default"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
                priority
                sizes="100vw"
                unoptimized
              />
            )}
          </AnimatePresence>
        </div>
        
        <div className="container-custom relative z-20 mt-16 w-full text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlider ? activeSlider.id : "default"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="max-w-3xl">
                <span className="mb-6 inline-flex rounded-full border border-brand-secondary/50 bg-brand-secondary/20 px-3 py-1 text-sm font-medium text-brand-secondary backdrop-blur-sm">
                  Penerimaan Peserta Didik Baru Telah Dibuka
                </span>
                <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  {activeSlider ? activeSlider.judul : <>Selamat Datang di <br /><span className="text-brand-secondary">SMK Muhammadiyah</span> Tarogong Kidul</>}
                </h1>
                <p className="mb-10 max-w-2xl text-lg font-light text-white/90 md:text-2xl">
                  {activeSlider ? activeSlider.deskripsi : "Mencetak generasi muda yang berakhlak mulia, cerdas, terampil, dan siap bersaing di era digital."}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/ppdb" className={cn(buttonVariants({ size: "lg" }), "h-14 w-full rounded-full bg-brand-secondary px-8 text-base text-brand-accent hover:bg-brand-secondary-light sm:w-auto")}>
                    {activeSlider?.tombol || "Daftar PPDB Sekarang"}
                  </Link>
                  <Link href="/jurusan" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-14 w-full rounded-full border-white bg-transparent px-8 text-base text-white hover:bg-white hover:text-brand-primary sm:w-auto")}>
                    Jelajahi Jurusan
                  </Link>
                </div>
                {contentState.sliders === "error" && (
                  <p className="mt-5 text-sm text-white/70">Slider sedang tidak tersedia. Konten utama tetap dapat diakses.</p>
                )}
              </div>
              <div className="relative hidden min-h-[360px] lg:block">
                <div className="absolute inset-8 rounded-[2rem] border border-white/20 bg-white/10 backdrop-blur-sm" />
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/30 shadow-2xl shadow-black/30">
                  <Image
                    src={activeSlider?.gambar ? getDirectImageUrl(activeSlider.gambar) : "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"}
                    alt={activeSlider?.judul || "Kegiatan sekolah"}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    unoptimized={!activeSlider?.gambar || activeSlider.gambar.includes("unsplash.com")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-secondary">Modern Islamic School</p>
                    <p className="mt-2 text-xl font-semibold text-white">Belajar, berkarya, dan berprestasi.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        {sliders && sliders.length > 1 && (
          <>
            <button 
              type="button"
              onClick={() => setCurrentSlide(prev => prev === 0 ? sliders.length - 1 : prev - 1)}
              aria-label="Slide sebelumnya"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              type="button"
              onClick={() => setCurrentSlide(prev => prev === sliders.length - 1 ? 0 : prev + 1)}
              aria-label="Slide berikutnya"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {sliders.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Buka slide ${idx + 1}`}
                  aria-current={idx === currentSlide ? "true" : undefined}
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
                src={sambutan?.gambar ? getDirectImageUrl(sambutan.gambar) : "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"}
                alt={sambutan?.keterangan || "Kepala Sekolah"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                unoptimized={!sambutan?.gambar || sambutan.gambar.includes("unsplash.com")}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 text-white">
                <h3 className="font-bold text-xl">{sambutan?.keterangan || siteConfig.school.headmaster}</h3>
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
                title={sambutan?.judul || "Sambutan Kepala Sekolah"}
                center={false}
                subtitle="Assalamu'alaikum Warahmatullahi Wabarakatuh"
                className="mb-6"
              />
              <div className="prose prose-lg text-muted-foreground mb-8 whitespace-pre-wrap">
                {contentState.profil === "error" ? (
                  <ErrorState title="Sambutan belum dapat dimuat" className="mb-0" />
                ) : sambutan ? (
                  <p>{sambutan.isi}</p>
                ) : (
                  <EmptyState
                    title="Sambutan belum tersedia"
                    description="Informasi sambutan kepala sekolah akan ditampilkan setelah tersedia."
                    className="min-h-40"
                  />
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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {[
              { label: "Siswa Aktif", value: stats.siswa, suffix: "+", icon: Users },
              { label: "Tenaga Pendidik", value: stats.guru, suffix: "+", icon: Briefcase },
              { label: "Kompetensi Keahlian", value: stats.jurusan, suffix: "", icon: BookOpen },
              { label: "Prestasi", value: stats.prestasi, suffix: "+", icon: Trophy },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-6 text-center backdrop-blur-sm md:px-4"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-brand-secondary opacity-80" />
                <h3 className="text-4xl md:text-5xl font-bold mb-2">
                  {contentState.stats === "error" ? "-" : <Counter value={stat.value} suffix={stat.suffix} />}
                </h3>
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
            {contentState.jurusan === "error" ? (
              <ErrorState title="Data jurusan belum dapat dimuat" className="col-span-full" />
            ) : jurusanList.length > 0 ? (
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
                      <Image src={getDirectImageUrl(dept.foto)} alt={dept.nama || "Kompetensi keahlian"} fill sizes="56px" className="object-cover" />
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
              <EmptyState title="Data jurusan belum tersedia" description="Program kompetensi akan ditampilkan setelah data tersedia." className="col-span-full" />
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
                {contentState.berita === "error" ? (
                  <ErrorState title="Berita belum dapat dimuat" className="col-span-full" />
                ) : beritaList.length > 0 ? (
                  beritaList.map((berita, i) => (
                    <div key={berita.id || i} className="group rounded-2xl overflow-hidden border bg-card">
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {berita.thumbnail ? (
                          <Image
                            src={getDirectImageUrl(berita.thumbnail)}
                            alt={berita.judul || "Berita sekolah"}
                            fill
                            sizes="(min-width: 768px) 28rem, 100vw"
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
                  <EmptyState title="Belum ada berita terbaru" description="Informasi terbaru sekolah akan ditampilkan di sini." className="col-span-full" />
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
                {contentState.agenda === "error" ? (
                  <ErrorState title="Agenda belum dapat dimuat" />
                ) : agendaList.length > 0 ? (
                  agendaList.map((agenda, i) => {
                    const dateObj = agenda.tanggal ? new Date(agenda.tanggal) : null;
                    const day = dateObj?.getDate() || "-";
                    const month = dateObj?.toLocaleString('id-ID', { month: 'short' }) || "-";

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
                  <EmptyState title="Belum ada agenda terdekat" description="Jadwal kegiatan sekolah akan ditampilkan di sini." />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Achievements (Dynamic) */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionTitle
            title="Prestasi Membanggakan"
            subtitle="Pencapaian siswa dan sekolah yang menjadi bagian dari perjalanan kami."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contentState.prestasi === "error" ? (
              <ErrorState title="Prestasi belum dapat dimuat" className="col-span-full" />
            ) : prestasiList.length > 0 ? prestasiList.map((item, i) => (
              <motion.article
                key={item.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden bg-muted">
                  {item.foto ? (
                    <Image src={getDirectImageUrl(item.foto)} alt={item.prestasi || "Prestasi sekolah"} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-secondary/20"><Trophy className="h-14 w-14 text-brand-secondary/60" /></div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-brand-secondary-dark dark:text-brand-secondary">
                    <Medal className="h-4 w-4" /> {item.tingkat || "Prestasi"} {item.tahun ? `• ${item.tahun}` : ""}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold transition-colors group-hover:text-brand-primary">{item.prestasi || "Prestasi sekolah"}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.nama || "Siswa SMK Muhammadiyah Tarogong Kidul"}</p>
                </div>
              </motion.article>
            )) : (
              <EmptyState title="Data prestasi belum tersedia" description="Pencapaian siswa dan sekolah akan tampil setelah data tersedia." className="col-span-full" />
            )}
          </div>
          <div className="mt-8 text-center"><Link href="/prestasi" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">Lihat semua prestasi <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* 7. Gallery (Dynamic) */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionTitle title="Momen di Sekolah" subtitle="Lihat berbagai kegiatan dan momen berharga dari keluarga besar SMK Muhammadiyah." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {contentState.galeri === "error" ? (
              <ErrorState title="Galeri belum dapat dimuat" className="col-span-full" />
            ) : galeriList.length > 0 ? galeriList.map((item, i) => (
              <button type="button" key={item.id || i} onClick={() => setSelectedGalleryIndex(i)} className={cn("group relative block w-full overflow-hidden rounded-2xl bg-muted text-left", i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]")} aria-label={`Buka foto ${item.deskripsi || item.kategori || "galeri sekolah"}`}>
                {item.gambar ? <Image src={getDirectImageUrl(item.gambar)} alt={item.deskripsi || "Galeri sekolah"} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="h-10 w-10 text-brand-primary/30" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 right-4 line-clamp-2 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">{item.deskripsi || item.kategori || "Lihat galeri"}</span>
              </button>
            )) : (
              <EmptyState title="Galeri foto belum tersedia" description="Dokumentasi kegiatan sekolah akan ditampilkan setelah data tersedia." className="col-span-full" />
            )}
          </div>
          <div className="mt-8 text-center"><Link href="/galeri" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">Lihat semua galeri <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      {/* 8. Video Section */}
      <section className="relative overflow-hidden bg-brand-accent py-24">
        <Image
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop"
          alt="Video Background"
          fill
          className="object-cover opacity-40"
          unoptimized
          sizes="100vw"
        />
        <div className="container-custom relative z-10 text-center">
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className={cn(buttonVariants({ size: "icon" }), "mx-auto mb-8 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-brand-secondary text-white hover:bg-brand-secondary-light")}
            aria-label="Buka video profil sekolah"
          >
            <PlayCircle className="h-10 w-10" />
          </button>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Profil SMK Muhammadiyah</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Saksikan video profil sekolah kami untuk mengenal lebih dekat lingkungan, fasilitas, dan kegiatan belajar mengajar.
          </p>
        </div>
      </section>

      {/* 9. CTA / PPDB */}
      <section className="section-padding gradient-primary text-white">
        <div className="container-custom text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-brand-secondary" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Mari Bergabung Bersama Kami!</h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Pendaftaran Peserta Didik Baru (PPDB) Tahun Ajaran Baru telah dibuka. Daftarkan diri Anda sekarang dan jadilah bagian dari generasi juara.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/ppdb" 
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-brand-primary hover:bg-white/90 rounded-full px-8 h-14 text-base flex items-center justify-center")}
            >
              Daftar Sekarang
            </Link>
            <Link 
              href="/ppdb" 
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "bg-transparent border border-white text-white hover:bg-white/20 rounded-full px-8 h-14 text-base flex items-center justify-center")}
            >
              Informasi PPDB
            </Link>
          </div>
        </div>
      </section>
      <GalleryLightbox
        items={galeriList}
        selectedIndex={selectedGalleryIndex}
        onClose={() => setSelectedGalleryIndex(null)}
        onNavigate={setSelectedGalleryIndex}
      />
      <ProfileVideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={profileVideoUrl}
      />
    </>
  );
}
