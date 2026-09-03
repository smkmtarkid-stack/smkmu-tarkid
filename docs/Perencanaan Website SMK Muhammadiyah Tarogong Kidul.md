# Perencanaan Website SMK Muhammadiyah Tarogong Kidul

## 1. Gambaran Umum

Website SMK Muhammadiyah Tarogong Kidul akan dibangun sebagai **Website Profile & Information System** yang berfungsi sebagai media informasi resmi sekolah, publikasi kegiatan, promosi PPDB, serta portal sederhana bagi siswa dan alumni.

Website menggunakan arsitektur **Supabase (PostgreSQL Database, Supabase Auth, dan Supabase Storage)**, sehingga performa data sangat cepat, aman, dan mudah dikelola melalui dashboard modern.

---

# 2. Tujuan Website

- Menjadi media informasi resmi sekolah.
- Menampilkan profil sekolah secara profesional.
- Menjadi media publikasi berita dan kegiatan sekolah.
- Menampilkan informasi PPDB.
- Menampilkan informasi jurusan.
- Menampilkan prestasi sekolah.
- Menampilkan agenda kegiatan.
- Menampilkan galeri foto dan video.
- Menyediakan portal sederhana untuk siswa dan alumni.
- Memudahkan pengelolaan konten melalui Dashboard Supabase / Dashboard Admin Next.js.

---

# 3. Teknologi yang Digunakan

## Frontend

- Next.js 15 / 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Framer Motion
- SwiperJS

## Backend & Database

- Supabase (PostgreSQL Database)
- Supabase Auth (Autentikasi User)
- Supabase Storage (Penyimpanan Media/Gambar)

## Hosting

- **Vercel** (Frontend Next.js)
- **Supabase Cloud** (Backend, Database & Storage)

---

# Arsitektur Deployment

```text
                  Pengunjung / User
                         │
                         ▼
                Vercel Hosting
           (Next.js Frontend App)
                         │
                  Supabase JS SDK
                         │
                         ▼
                  Supabase Cloud
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
PostgreSQL DB      Supabase Auth       Supabase Storage
 (Data Tabel)     (Authentication)    (Foto/Media/Berkas)
```

---

# 4. Arsitektur Sistem

```text
                    Pengunjung
                         │
                         ▼
        Website (Frontend)
     HTML + Tailwind + JavaScript
                         │
                    Fetch API
                         │
                         ▼
        Google Apps Script (REST API)
                         │
                         ▼
             Google Spreadsheet
                         │
                         ▼
                 Dashboard Admin
```

---

# 5. Role Pengguna

## 1. Super Admin

Pengguna:
- Developer
- Administrator IT

Hak Akses:

- Mengelola seluruh sistem
- Membuat akun pengguna
- Mengubah role akun
- Menghapus akun
- Mengaktifkan / menonaktifkan akun
- Reset password
- Pengaturan website
- Backup & Restore
- Pengaturan API
- Melihat log aktivitas
- Mengelola seluruh data

---

## 2. Admin

Pengguna:

- Operator Sekolah
- Humas
- Ketua Program (Kaprog)
- Staf yang ditunjuk

Hak Akses:

- Dashboard
- Profil Sekolah
- Sambutan Kepala Sekolah
- Visi & Misi
- Jurusan
- Data Guru
- Berita
- Pengumuman
- Agenda
- Prestasi
- Galeri
- PPDB
- Download Dokumen
- Slider
- Kontak
- Mengelola data siswa
- Mengelola data alumni

Tidak dapat:

- Mengelola role pengguna
- Mengubah konfigurasi sistem

---

## 3. Siswa

Hak Akses:

- Login
- Dashboard
- Profil Saya
- Melihat Pengumuman
- Download Dokumen
- Melihat Agenda
- Mengubah data profil pribadi

---

## 4. Alumni

Hak Akses:

- Login
- Dashboard Alumni
- Profil Alumni
- Tracer Study
- Testimoni
- Informasi Lowongan Kerja
- Update Data Alumni

---

## 5. Pengunjung

Tanpa Login

Hak Akses:

- Melihat Profil Sekolah
- Membaca Berita
- Melihat Jurusan
- Melihat Prestasi
- Melihat Galeri
- Mengakses PPDB
- Download Dokumen Publik
- Menghubungi Sekolah

---

# 6. Struktur Menu Website

```text
Home

Profil
├── Sambutan Kepala Sekolah
├── Sejarah
├── Visi & Misi
├── Struktur Organisasi
├── Fasilitas
└── Akreditasi

Jurusan

Guru

Berita

Prestasi

Galeri

PPDB

Download

Kontak

Login
```

---

# 7. Struktur Dashboard

## Super Admin

```text
Dashboard

Manajemen Pengguna
Role Pengguna

Website
├── Pengaturan Website
├── Backup
├── Restore
├── Log Aktivitas

Konten
├── Profil
├── Jurusan
├── Guru
├── Berita
├── Pengumuman
├── Agenda
├── Prestasi
├── Galeri
├── PPDB
├── Download
└── Slider
```

---

## Admin

```text
Dashboard

Profil

Jurusan

Guru

Berita

Pengumuman

Agenda

Prestasi

Galeri

PPDB

Download

Slider

Kontak

Data Siswa

Data Alumni
```

---

## Dashboard Siswa

```text
Dashboard

Profil Saya

Pengumuman

Agenda

Download Dokumen
```

---

## Dashboard Alumni

```text
Dashboard

Profil Alumni

Tracer Study

Lowongan Kerja

Testimoni
```

---

# 8. Struktur Google Spreadsheet

## Sheet Profil

| id | judul | isi |

---

## Sheet Guru

| id | nama | mapel | jabatan | foto |

---

## Sheet Jurusan

| id | nama | deskripsi | icon | foto |

---

## Sheet Berita

| id | judul | slug | kategori | tanggal | isi | thumbnail |

---

## Sheet Prestasi

| id | nama | prestasi | tingkat | tahun | foto |

---

## Sheet Pengumuman

| id | judul | tanggal | isi |

---

## Sheet Agenda

| id | kegiatan | tanggal | lokasi |

---

## Sheet Galeri

| id | kategori | gambar | deskripsi |

---

## Sheet PPDB

| id | judul | isi | link |

---

## Sheet Download

| id | nama_file | kategori | link |

---

## Sheet Slider

| id | judul | deskripsi | gambar | tombol |

---

## Sheet Guru

| id | nama | mapel | jabatan | foto |

---

## Sheet Siswa

| id | nis | nama | kelas | jurusan | email | foto |

---

## Sheet Alumni

| id | nisn | nama | tahun_lulus | pekerjaan | kampus | email | foto |

---

## Sheet User

| id | nama | email | password | role | status |

---

# 9. API Endpoint

## Public API

```
GET /api/profil

GET /api/jurusan

GET /api/guru

GET /api/berita

GET /api/prestasi

GET /api/agenda

GET /api/galeri

GET /api/ppdb

GET /api/download

GET /api/slider
```

---

## Authentication

```
POST /api/login

POST /api/logout

POST /api/reset-password
```

---

## Admin API

```
POST /api/berita

PUT /api/berita

DELETE /api/berita

POST /api/guru

POST /api/prestasi

POST /api/galeri

POST /api/jurusan

POST /api/pengumuman

POST /api/ppdb

POST /api/download
```

---

## Super Admin API

```
POST /api/users

PUT /api/users

DELETE /api/users

PUT /api/users/role

PUT /api/users/status

POST /api/backup

POST /api/restore
```

---

# 10. Fitur Website

## Halaman Home

- Hero Slider
- Sambutan Kepala Sekolah
- Statistik Sekolah
- Jurusan
- Berita Terbaru
- Prestasi
- Agenda
- Galeri
- Video Profil
- Lokasi Sekolah
- Footer

---

## Profil

- Sambutan Kepala Sekolah
- Sejarah
- Visi & Misi
- Struktur Organisasi
- Fasilitas
- Akreditasi

---

## Jurusan

- Profil Jurusan
- Kompetensi
- Fasilitas
- Galeri Jurusan

---

## Guru

- Data Guru
- Mata Pelajaran
- Jabatan

---

## Berita

- Daftar Berita
- Detail Berita
- Pencarian
- Kategori

---

## Prestasi

- Prestasi Sekolah
- Prestasi Guru
- Prestasi Siswa

---

## Galeri

- Foto
- Video
- Filter Kategori

---

## PPDB

- Jadwal
- Persyaratan
- Alur Pendaftaran
- Brosur
- Link Pendaftaran

---

## Download

- Dokumen Sekolah
- Kalender Akademik
- Formulir
- Brosur

---

## Portal Siswa

- Profil
- Pengumuman
- Agenda
- Download

---

## Portal Alumni

- Profil Alumni
- Tracer Study
- Lowongan Kerja
- Testimoni

---

# 11. Keamanan

- Login menggunakan JWT/Session Google Apps Script
- Password di-hash
- Validasi seluruh request API
- Spreadsheet tidak dipublikasikan
- Role Based Access Control (RBAC)
- Rate Limiting
- Logging aktivitas pengguna
- Backup berkala

---

# 12. Optimasi SEO

- Friendly URL
- Meta Title
- Meta Description
- Open Graph
- Schema.org
- Sitemap.xml
- Robots.txt
- Lazy Loading Image
- WebP Image
- Responsive Design

---

# 13. Tahapan Pengembangan

## Tahap 1

- Analisis kebutuhan
- Perancangan database
- Perancangan UI/UX

---

## Tahap 2

- Pembuatan Frontend
- Integrasi API
- Dashboard Admin

---

## Tahap 3

- Portal Siswa
- Portal Alumni
- Authentication

---

## Tahap 4

- Testing
- Optimasi
- Deployment
- Dokumentasi

---

# 14. Target Pengembangan

Versi pertama website akan difokuskan sebagai **website profil sekolah modern** dengan dashboard pengelolaan konten yang sederhana namun lengkap. Seluruh data dikelola melalui Google Spreadsheet sehingga mudah digunakan oleh operator sekolah tanpa memerlukan pengetahuan teknis mengenai database.

Arsitektur ini juga dirancang agar dapat dikembangkan di masa depan, misalnya dengan menambahkan sistem akademik, e-learning, atau integrasi layanan sekolah lainnya tanpa harus membangun ulang website dari awal.