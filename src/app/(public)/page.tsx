import { LandingPageContent } from "./landing-content";
import { fetchSheetCached } from "@/lib/api";

export const revalidate = 0;

export default async function Home() {
  // Fetch all necessary data concurrently with caching (60 seconds)
  const [
    sliderRes,
    profilRes,
    jurusanRes,
    beritaRes,
    agendaRes,
    siswaRes,
    guruRes,
    prestasiRes
  ] = await Promise.all([
    fetchSheetCached("Slider", 60),
    fetchSheetCached("Profil", 60),
    fetchSheetCached("Jurusan", 60),
    fetchSheetCached("Berita", 60),
    fetchSheetCached("Agenda", 60),
    fetchSheetCached("Siswa", 60),
    fetchSheetCached("Guru", 60),
    fetchSheetCached("Prestasi", 60),
  ]);

  // Extract data arrays
  const sliders = sliderRes.data || [];
  const profilData = profilRes.data || [];
  const jurusanList = jurusanRes.data || [];
  const beritaList = beritaRes.data || [];
  const agendaList = agendaRes.data || [];

  // Calculate statistics from data length
  const stats = {
    siswa: siswaRes.data?.length || 0,
    guru: guruRes.data?.length || 0,
    jurusan: jurusanList.length || 0,
    prestasi: prestasiRes.data?.length || 0,
  };

  // Find the 'Sambutan' section in Profil
  // Assuming there's a row where 'judul' contains 'Sambutan'
  const sambutan = profilData.find((p: any) => 
    p.judul && p.judul.toLowerCase().includes("sambutan")
  ) || null;

  // Get only top 2 latest news (assuming they are appended, so last items are newest)
  // Reversing the array to get the newest first
  const latestBerita = [...beritaList].reverse().slice(0, 2);

  // Get top 3 upcoming agenda
  const upcomingAgenda = [...agendaList].reverse().slice(0, 3);

  return (
    <LandingPageContent 
      sliders={sliders}
      sambutan={sambutan}
      stats={stats}
      jurusanList={jurusanList}
      beritaList={latestBerita}
      agendaList={upcomingAgenda}
    />
  );
}
