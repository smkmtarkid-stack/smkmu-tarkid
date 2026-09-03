// ========================================
// Data Models — Google Spreadsheet Schema
// ========================================

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

/** Sheet: Profil */
export interface Profile {
  id: string;
  judul: string;
  isi: string;
}

/** Sheet: Guru */
export interface Teacher {
  id: string;
  nama: string;
  mapel: string;
  jabatan: string;
  foto: string;
}

/** Sheet: Jurusan */
export interface Department {
  id: string;
  nama: string;
  deskripsi: string;
  icon: string;
  foto: string;
}

/** Sheet: Berita */
export interface News {
  id: string;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  isi: string;
  thumbnail: string;
}

/** Sheet: Prestasi */
export interface Achievement {
  id: string;
  nama: string;
  prestasi: string;
  tingkat: string;
  tahun: string;
  foto: string;
}

/** Sheet: Pengumuman */
export interface Announcement {
  id: string;
  judul: string;
  tanggal: string;
  isi: string;
}

/** Sheet: Agenda */
export interface Agenda {
  id: string;
  kegiatan: string;
  tanggal: string;
  lokasi: string;
}

/** Sheet: Galeri */
export interface Gallery {
  id: string;
  kategori: string;
  gambar: string;
  deskripsi: string;
}

/** Sheet: PPDB */
export interface PPDB {
  id: string;
  judul: string;
  isi: string;
  link: string;
}

/** Sheet: Download */
export interface DownloadItem {
  id: string;
  nama_file: string;
  kategori: string;
  link: string;
}

/** Sheet: Slider */
export interface Slider {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  tombol: string;
}

/** Sheet: Siswa */
export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  email: string;
  foto: string;
}

/** Sheet: Alumni */
export interface Alumni {
  id: string;
  nisn: string;
  nama: string;
  tahun_lulus: string;
  pekerjaan: string;
  kampus: string;
  email: string;
  foto: string;
}

/** Sheet: User */
export interface User {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "siswa" | "alumni";
  status: "active" | "inactive";
}

/** Statistics displayed on homepage */
export interface SchoolStats {
  totalSiswa: number;
  totalGuru: number;
  totalJurusan: number;
  totalPrestasi: number;
  totalAlumni: number;
}
