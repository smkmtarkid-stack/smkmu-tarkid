import { LandingPageContent } from "./landing-content";
import { fetchSheetCached } from "@/lib/api";

export const revalidate = 0;

type ContentState = "success" | "empty" | "error";

function getContentState(status: "success" | "error", data?: unknown[]) : ContentState {
  if (status === "error") return "error";
  return data && data.length > 0 ? "success" : "empty";
}

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
     prestasiRes,
     galeriRes
  ] = await Promise.all([
    fetchSheetCached("Slider", 60),
    fetchSheetCached("Profil", 60),
    fetchSheetCached("Jurusan", 60),
    fetchSheetCached("Berita", 60),
    fetchSheetCached("Agenda", 60),
    fetchSheetCached("Siswa", 60),
    fetchSheetCached("Guru", 60),
    fetchSheetCached("Prestasi", 60),
    fetchSheetCached("Galeri", 60),
  ]);

  // Extract data arrays
  const sliders = sliderRes.data || [];
  const profilData = profilRes.data || [];
  const jurusanList = jurusanRes.data || [];
  const beritaList = beritaRes.data || [];
  const agendaList = agendaRes.data || [];
  const prestasiList = prestasiRes.data ? [...prestasiRes.data].reverse().slice(0, 3) : [];
  const galeriList = galeriRes.data ? [...galeriRes.data].slice(0, 6) : [];
  const contentState = {
    sliders: getContentState(sliderRes.status, sliders),
    profil: getContentState(profilRes.status, profilData),
    jurusan: getContentState(jurusanRes.status, jurusanList),
    berita: getContentState(beritaRes.status, beritaList),
    agenda: getContentState(agendaRes.status, agendaList),
    prestasi: getContentState(prestasiRes.status, prestasiRes.data),
    galeri: getContentState(galeriRes.status, galeriRes.data),
    stats: [siswaRes, guruRes, prestasiRes].some((res) => res.status === "error") ? "error" as const : "success" as const,
  };

  // Calculate statistics from data length
  const stats = {
    siswa: siswaRes.data?.length || 0,
    guru: guruRes.data?.length || 0,
    jurusan: jurusanList.length || 0,
    prestasi: prestasiRes.data?.length || 0,
  };

  // Find the 'Sambutan' section in Profil
  // Assuming there's a row where 'judul' contains 'Sambutan'
  const sambutan = profilData.find((p: { judul?: string }) =>
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
      prestasiList={prestasiList}
      galeriList={galeriList}
      contentState={contentState}
    />
  );
}
