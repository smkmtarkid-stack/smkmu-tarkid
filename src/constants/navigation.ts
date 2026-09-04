import {
  Home,
  School,
  Users,
  Newspaper,
  Trophy,
  Image,
  Calendar,
  Download,
  Phone,
  GraduationCap,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    label: "Beranda",
    href: "/",
    icon: Home,
  },
  {
    label: "Profil",
    href: "/profil",
    icon: School,
    children: [
      { label: "Sambutan Kepala Sekolah", href: "/profil/sambutan" },
      { label: "Sejarah", href: "/profil/sejarah" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
      { label: "Fasilitas", href: "/profil/fasilitas" },
    ],
  },
  {
    label: "Jurusan",
    href: "/jurusan",
    icon: BookOpen,
  },
  {
    label: "Guru",
    href: "/guru",
    icon: Users,
  },
  {
    label: "Berita",
    href: "/berita",
    icon: Newspaper,
  },
  {
    label: "Prestasi",
    href: "/prestasi",
    icon: Trophy,
  },
  {
    label: "Galeri",
    href: "/galeri",
    icon: Image,
  },
  {
    label: "PPDB",
    href: "/ppdb",
    icon: GraduationCap,
  },
  {
    label: "Download",
    href: "/download",
    icon: Download,
  },
  {
    label: "Kontak",
    href: "/kontak",
    icon: Phone,
  },
];

export const footerNavigation = {
  tentang: [
    { label: "Sambutan Kepsek", href: "/profil/sambutan" },
    { label: "Sejarah", href: "/profil/sejarah" },
    { label: "Visi & Misi", href: "/profil/visi-misi" },
    { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
    { label: "Fasilitas", href: "/profil/fasilitas" },
  ],
  akademik: [
    { label: "Jurusan", href: "/jurusan" },
    { label: "Guru & Staff", href: "/guru" },
    { label: "Prestasi", href: "/prestasi" },
    { label: "PPDB", href: "/ppdb" },
  ],
  informasi: [
    { label: "Berita", href: "/berita" },
    { label: "Agenda", href: "/agenda" },
    { label: "Galeri", href: "/galeri" },
    { label: "Download", href: "/download" },
    { label: "Kontak", href: "/kontak" },
  ],
} as const;

// Dashboard navigations are defined below
export const adminNav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "LayoutDashboard" },
  {
    label: "Data Administrasi",
    icon: "Database",
    children: [
      { label: "Jurusan", href: "/dashboard/admin/jurusan", icon: "BookOpen" },
      { label: "Kelas & Rombel", href: "/dashboard/admin/kelas", icon: "School" },
      { label: "Guru", href: "/dashboard/admin/guru", icon: "Users" },
      { label: "Tata Usaha & Staf", href: "/dashboard/admin/staff", icon: "UserCheck" },
      { label: "Data Siswa", href: "/dashboard/admin/siswa", icon: "Users" },
      { label: "Wali Siswa", href: "/dashboard/admin/wali-siswa", icon: "Users" },
      { label: "Data Alumni", href: "/dashboard/admin/alumni", icon: "GraduationCap" },
      { label: "Keuangan & SPP", href: "/dashboard/admin/keuangan", icon: "Wallet" },
      { label: "Proses Naik Kelas", href: "/dashboard/admin/keuangan/naik-kelas", icon: "ArrowUpCircle" },
    ]
  },
  { label: "Pengumuman", href: "/dashboard/admin/pengumuman", icon: "Bell" },
  { label: "PPDB", href: "/dashboard/admin/ppdb", icon: "UserPlus" },
  { label: "Download", href: "/dashboard/admin/download", icon: "Download" },
  {
    label: "Pengaturan",
    icon: "Settings",
    children: [
      { label: "Manajemen Profil", href: "/dashboard/admin/profil", icon: "School" },
      { label: "Pengaturan Website", href: "/dashboard/admin/pengaturan", icon: "Settings" },
      { label: "Manajemen Akun", href: "/dashboard/admin/manajemen-akun", icon: "UserCog" },
      { label: "Berita", href: "/dashboard/admin/berita", icon: "FileText" },
      { label: "Prestasi", href: "/dashboard/admin/prestasi", icon: "Trophy" },
      { label: "Agenda", href: "/dashboard/admin/agenda", icon: "Calendar" },
      { label: "Galeri", href: "/dashboard/admin/galeri", icon: "Image" },
      { label: "Slider", href: "/dashboard/admin/slider", icon: "MonitorPlay" },
    ]
  },
];

export const siswaNav = [
  { label: "Dashboard", href: "/dashboard/siswa", icon: "LayoutDashboard" },
  { label: "Profil Saya", href: "/dashboard/siswa/profil", icon: "User" },
  { label: "Pengumuman", href: "/dashboard/siswa/pengumuman", icon: "Bell" },
  { label: "Agenda", href: "/dashboard/siswa/agenda", icon: "Calendar" },
  { label: "Download Dokumen", href: "/dashboard/siswa/download", icon: "Download" },
];

export const alumniNav = [
  { label: "Dashboard", href: "/dashboard/alumni", icon: "LayoutDashboard" },
  { label: "Profil Alumni", href: "/dashboard/alumni/profil", icon: "User" },
  { label: "Tracer Study", href: "/dashboard/alumni/tracer-study", icon: "MapPin" },
  { label: "Lowongan Kerja", href: "/dashboard/alumni/loker", icon: "Briefcase" },
  { label: "Testimoni", href: "/dashboard/alumni/testimoni", icon: "MessageSquare" },
];
