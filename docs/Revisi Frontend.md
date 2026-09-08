# Revisi Frontend Website SMK Muhammadiyah Tarogong Kidul

## 1. Tujuan Revisi

Revisi ini bertujuan untuk meningkatkan kualitas **frontend website SMK Muhammadiyah Tarogong Kidul** agar terlihat lebih:

* Modern
* Profesional
* Bersih dan rapi
* Informatif
* Responsif
* Nyaman digunakan
* Memiliki identitas visual sekolah yang kuat
* Lebih menarik bagi siswa, orang tua, alumni, dan masyarakat

### Catatan Penting

Revisi ini **hanya berfokus pada frontend**.

Tidak mengubah:

* Struktur database
* Struktur tabel
* Nama field database
* Sistem dashboard admin
* Mekanisme input data
* API
* Backend
* Alur CRUD
* Data yang nantinya akan diinput oleh admin

Frontend tetap menggunakan data yang tersedia dari sistem yang sudah direncanakan.

---

# 2. Prinsip Utama Revisi

Frontend harus menggunakan prinsip:

> **"Data tetap dinamis, tampilan yang diperbaiki."**

Artinya, seluruh komponen yang menampilkan data tetap mengambil data dari database.

Tidak boleh membuat data statis hanya untuk mempercantik tampilan.

Contoh:

```text
Database
   ↓
Data asli sekolah
   ↓
Frontend
   ↓
UI / Card / Section
```

Jika admin menambahkan atau mengubah data melalui dashboard, tampilan website akan mengikuti data tersebut.

---

# 3. Arah Visual Website

## Konsep

Gunakan konsep:

> **Modern Islamic School + Technology + Education**

Website harus menggambarkan karakter SMK Muhammadiyah Tarogong Kidul sebagai sekolah yang:

* Modern
* Berbasis pendidikan dan teknologi
* Memiliki nuansa Muhammadiyah
* Berorientasi pada siswa
* Profesional
* Aktif dalam kegiatan sekolah

---

# 4. Design System

## 4.1 Warna

Pertahankan identitas utama website yang sudah ada dengan dominasi:

* Biru Muhammadiyah
* Putih
* Abu-abu
* Kuning/gold sebagai accent

Gunakan warna secara konsisten.

### Penggunaan warna

**Primary**

Untuk:

* Navbar
* Button utama
* Link aktif
* Highlight
* CTA

**Secondary**

Untuk:

* Background
* Section
* Card
* Border

**Accent**

Untuk:

* Badge
* Icon tertentu
* Highlight angka
* Hover
* Elemen penting

Hindari penggunaan terlalu banyak warna dalam satu section.

---

# 5. Typography

Gunakan typography yang modern dan mudah dibaca.

## Heading

Gunakan font dengan karakter tegas dan modern.

Contoh hierarki:

```text
H1
48–64px desktop
36–44px tablet
30–36px mobile

H2
36–48px desktop
28–36px mobile

H3
20–28px

Body
16–18px

Small
13–14px
```

Heading harus memiliki hierarki yang jelas.

---

# 6. Navbar

Navbar yang sudah ada dipertahankan.

Menu tetap:

* Beranda
* Profil
* Jurusan
* Guru
* Berita
* Prestasi
* Galeri
* PPDB
* Download
* Kontak

## Revisi tampilan

Navbar dibuat:

* Sticky
* Memiliki background yang tetap nyaman dibaca ketika scrolling
* Smooth transition ketika scroll
* Active menu indicator
* Hover animation ringan
* Responsive mobile navigation

### Desktop

Logo berada di sebelah kiri.

Menu berada di tengah/kanan.

CTA:

```text
PPDB
```

dapat diberikan visual lebih menonjol.

### Mobile

Gunakan hamburger menu.

Menu tampil dalam mobile navigation yang:

* Bersih
* Tidak terlalu lebar
* Mudah disentuh
* Memiliki animasi masuk/keluar

---

# 7. Hero Section

Hero merupakan bagian paling penting dari homepage.

Struktur yang sudah ada **dipertahankan**, tetapi visualnya diperkuat.

## Layout

Gunakan dua area:

```text
┌──────────────────────────────────────────────┐
│                                              │
│  CONTENT                    VISUAL           │
│                                              │
│  Judul Sekolah              Foto / Visual    │
│  Deskripsi                  Sekolah/Siswa    │
│                                              │
│  [PPDB] [Jurusan]                            │
│                                              │
└──────────────────────────────────────────────┘
```

## Elemen visual

Tambahkan elemen dekoratif yang tidak mengganggu:

* Gradient
* Floating shapes
* Pattern
* Glow ringan
* Icon pendidikan
* Icon teknologi
* Elemen geometris

Jangan membuat hero terlalu ramai.

## Animasi

Gunakan animasi ringan:

* Text fade-up
* Image reveal
* Floating animation
* Button hover

Durasi sekitar:

```text
300–800ms
```

Hindari animasi berlebihan.

---

# 8. Section Sambutan Kepala Sekolah

Struktur sambutan tetap digunakan.

## Revisi layout

Gunakan komposisi:

```text
┌─────────────────────────────────────────────┐
│                                             │
│   FOTO              SAMBUTAN                │
│                                             │
│   Kepala            Kepala Sekolah          │
│   Sekolah                                   │
│                     Nama                    │
│                     Jabatan                 │
│                                             │
│                     Isi Sambutan            │
│                                             │
└─────────────────────────────────────────────┘
```

## Visual

Foto dibuat:

* Rounded corner
* Shadow ringan
* Border/ornament sederhana

Tambahkan elemen dekoratif kecil agar foto tidak terlihat terlalu datar.

---

# 9. Statistik Sekolah

Section statistik dipertahankan karena sudah menjadi elemen yang baik.

## Tampilan

Gunakan card atau horizontal statistic layout.

Contoh:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│    ICON    │ │    ICON    │ │    ICON    │ │    ICON    │
│            │ │            │ │            │ │            │
│    XXX+    │ │    XX+     │ │     X      │ │    XX+     │
│   Siswa    │ │   Guru     │ │  Jurusan   │ │ Prestasi   │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

## Animasi

Ketika section masuk viewport:

```text
0 → angka sebenarnya
```

Gunakan counter animation.

Data tetap berasal dari database.

---

# 10. Section Jurusan

Section kompetensi keahlian dipertahankan.

## Card

Setiap jurusan menggunakan card:

```text
┌─────────────────────────┐
│                         │
│       IMAGE / ICON      │
│                         │
│  Rekayasa Perangkat     │
│  Lunak                  │
│                         │
│  Deskripsi singkat      │
│                         │
│  [Lihat Jurusan →]      │
│                         │
└─────────────────────────┘
```

## Hover effect

Ketika cursor diarahkan ke card:

* Card sedikit naik
* Image sedikit zoom
* Shadow berubah
* Button/icon bergerak ringan

Gunakan animasi halus.

---

# 11. Section Berita

Section berita dibuat lebih menarik secara visual.

## Layout

Gunakan konsep:

```text
┌─────────────────────────────────────────────┐
│                 BERITA                      │
│                                             │
│  ┌───────────────────┐ ┌─────────────────┐  │
│  │                   │ │                 │  │
│  │   FEATURED NEWS   │ │    BERITA 2     │  │
│  │                   │ │                 │  │
│  │                   │ ├─────────────────┤  │
│  │                   │ │    BERITA 3     │  │
│  │                   │ ├─────────────────┤  │
│  │                   │ │    BERITA 4     │  │
│  └───────────────────┘ └─────────────────┘  │
│                                             │
│               [Lihat Semua]                 │
└─────────────────────────────────────────────┘
```

Berita yang tersedia dari database ditampilkan secara dinamis.

Tidak perlu membuat berita dummy.

---

# 12. Empty State Berita

Jika database belum memiliki berita, jangan membuat tampilan terlihat seperti error.

Gunakan empty state yang elegan.

Contoh:

```text
┌─────────────────────────────────────┐
│                                     │
│             📰                      │
│                                     │
│      Belum Ada Berita Terbaru       │
│                                     │
│  Informasi terbaru sekolah akan     │
│  ditampilkan di halaman ini.        │
│                                     │
└─────────────────────────────────────┘
```

Jika data sudah tersedia, empty state otomatis tidak ditampilkan.

---

# 13. Section Agenda

Agenda dibuat lebih visual daripada sekadar daftar.

Gunakan timeline/card.

Contoh:

```text
2026
 │
 ├── [Tanggal]
 │    Kegiatan
 │    Lokasi
 │
 ├── [Tanggal]
 │    Kegiatan
 │    Lokasi
 │
 └── [Tanggal]
      Kegiatan
      Lokasi
```

Pada mobile, ubah menjadi card vertikal.

---

# 14. Section Prestasi

Prestasi dibuat menggunakan card yang menonjolkan:

* Foto
* Nama prestasi
* Nama siswa/tim
* Tingkat
* Tahun/tanggal

Contoh:

```text
┌──────────────────────────┐
│                          │
│          FOTO            │
│                          │
├──────────────────────────┤
│  🏆 Nama Prestasi        │
│                          │
│  Siswa / Tim             │
│  Tingkat                 │
│                          │
└──────────────────────────┘
```

Jika data banyak, gunakan:

* Grid
* Carousel
* Filter kategori jika diperlukan

---

# 15. Gallery

Gallery perlu dibuat lebih visual.

Gunakan:

## Masonry / Responsive Grid

Contoh:

```text
┌──────────┐ ┌──────────┐ ┌──────────┐
│          │ │          │ │          │
│   FOTO   │ │   FOTO   │ │   FOTO   │
│          │ │          │ │          │
├──────────┤ └──────────┘ └──────────┘
│          │ ┌──────────┐ ┌──────────┐
│   FOTO   │ │          │ │          │
│          │ │   FOTO   │ │   FOTO   │
└──────────┘ └──────────┘ └──────────┘
```

## Interaksi

Ketika foto diklik:

* Buka lightbox
* Foto diperbesar
* Background overlay
* Tombol close
* Navigasi foto jika diperlukan

---

# 16. Video Profil

Pertahankan section video profil.

Namun tampilkan dalam bentuk video preview yang lebih kuat.

```text
┌─────────────────────────────────────────┐
│                                         │
│              VIDEO                      │
│                                         │
│                 ▶                       │
│                                         │
│       Kenali Sekolah Kami               │
│                                         │
└─────────────────────────────────────────┘
```

Gunakan overlay gelap/transparan agar tombol play terlihat jelas.

Klik video → buka modal.

---

# 17. CTA PPDB

Section CTA PPDB tetap dipertahankan karena merupakan bagian penting website.

Gunakan desain yang lebih kuat:

```text
┌─────────────────────────────────────────────┐
│                                             │
│       Mari Bergabung Bersama Kami           │
│                                             │
│   Bangun masa depan bersama                 │
│   SMK Muhammadiyah Tarogong Kidul           │
│                                             │
│          [ Daftar Sekarang ]                │
│                                             │
└─────────────────────────────────────────────┘
```

Gunakan background yang berbeda dari section biasa agar CTA terasa sebagai **closing section**.

---

# 18. Footer

Footer tetap menggunakan struktur yang sudah ada.

Kelompok:

* Tentang Kami
* Akademik
* Informasi
* Kontak

## Revisi visual

Tambahkan:

* Logo sekolah
* Deskripsi singkat
* Social media icon
* WhatsApp
* Instagram
* Facebook
* YouTube jika tersedia
* Copyright

Footer dibuat lebih sederhana dan tidak terlalu penuh.

---

# 19. Dark Mode

Dark mode tetap dipertahankan.

Pastikan semua komponen memiliki versi dark mode:

* Navbar
* Hero
* Card
* Button
* Statistik
* Berita
* Agenda
* Gallery
* Modal
* Footer

Perhatikan kontras teks.

Hindari penggunaan hitam murni untuk seluruh background.

Gunakan beberapa level surface agar terdapat depth:

```text
Background
↓
Surface
↓
Card
↓
Border
↓
Content
```

---

# 20. Responsive Design

Frontend harus dibuat mobile-first.

Minimal diuji pada:

* Mobile kecil
* Mobile standar
* Tablet
* Laptop
* Desktop besar

## Mobile

Pastikan:

* Tidak ada horizontal scrolling
* Text tidak terpotong
* Button mudah ditekan
* Card tidak terlalu kecil
* Image tidak pecah
* Navbar mudah digunakan
* Gallery berubah menjadi grid mobile
* Modal nyaman digunakan

---

# 21. Micro Interaction

Tambahkan interaksi ringan untuk membuat website terasa hidup.

Contoh:

### Button

```text
Normal
↓
Hover
↓
Sedikit bergerak / berubah
```

### Card

```text
Hover
↓
translateY ringan
↓
shadow meningkat
```

### Image

```text
Hover
↓
scale 1.03
```

### Link

```text
Hover
↓
underline / indicator
```

Gunakan secara konsisten.

---

# 22. Scroll Animation

Gunakan animasi ketika section masuk viewport.

Contoh:

* Fade Up
* Fade In
* Slide In
* Scale In

Namun semua animasi harus ringan.

Jangan menggunakan animasi yang membuat website terasa lambat.

---

# 23. Loading State

Karena frontend mengambil data dari database, setiap komponen dinamis sebaiknya mempunyai loading state.

Contoh:

```text
Loading
   ↓
Skeleton
   ↓
Data tersedia
   ↓
Content
```

Jangan menampilkan:

```text
Tidak ada data
```

sebelum proses loading selesai.

---

# 24. Empty State

Semua section yang datanya berasal dari database harus mempunyai kondisi:

### Loading

Data sedang dimuat.

### Success

Data tersedia.

### Empty

Belum terdapat data.

### Error

Data gagal dimuat.

Contoh:

```text
LOADING
   ↓
SUCCESS ─────→ Tampilkan data
   │
   ├──── EMPTY ──→ Tampilkan empty state
   │
   └──── ERROR ──→ Tampilkan pesan error
```

Ini merupakan bagian penting dari frontend dinamis.

---

# 25. Accessibility

Frontend harus tetap memperhatikan aksesibilitas.

Pastikan:

* Kontras warna cukup
* Button memiliki label jelas
* Image memiliki alt text
* Navigasi keyboard dapat digunakan
* Focus state terlihat
* Ukuran teks mudah dibaca
* Tidak hanya mengandalkan warna untuk informasi

---

# 26. Performance

Jangan menambahkan efek visual yang mengorbankan performa.

Prioritas:

* Optimasi gambar
* Lazy loading image
* Lazy loading video
* Gunakan WebP/AVIF jika memungkinkan
* Hindari JavaScript animation berlebihan
* Gunakan CSS animation jika cukup
* Minimalkan elemen berat di hero

Target utama:

> **Tampilan premium tetapi tetap cepat.**

---

# 27. Konsistensi Komponen

Gunakan komponen UI yang konsisten.

Contoh:

```text
Button
Card
Badge
Section Title
Image
Modal
Input
Tabs
Pagination
Empty State
Loading State
```

Jangan membuat desain berbeda-beda untuk komponen yang memiliki fungsi sama.

---

# 28. Section Title

Setiap section sebaiknya memiliki pola judul yang konsisten.

Contoh:

```text
LABEL KECIL
BERITA TERBARU

Deskripsi singkat mengenai
section tersebut.
```

Kemudian konten.

Hal ini akan membuat halaman terlihat lebih terstruktur.

---

# 29. Spacing

Gunakan spacing yang konsisten antar-section.

Desktop:

```text
Section padding:
80–120px
```

Tablet:

```text
60–80px
```

Mobile:

```text
48–64px
```

Jangan membuat setiap section memiliki jarak yang berbeda tanpa alasan.

---

# 30. Hal yang Tidak Boleh Diubah

Dalam proses revisi frontend, **jangan mengubah**:

* Data sekolah
* Data guru
* Data jurusan
* Data berita
* Data agenda
* Data prestasi
* Data galeri
* Data PPDB
* Struktur database
* Field database
* Dashboard admin
* API
* Sistem authentication
* Sistem CRUD
* Mekanisme input data

Perubahan hanya dilakukan pada:

> **UI + UX + Layout + Responsive + Animation + Visual Design + Component Design**

---

# 31. Prioritas Implementasi

Urutan pengerjaan frontend:

### Tahap 1 — Design System

* Warna
* Typography
* Button
* Card
* Spacing
* Border radius
* Shadow

### Tahap 2 — Homepage

* Navbar
* Hero
* Sambutan
* Statistik
* Jurusan
* Berita
* Agenda
* Prestasi
* Gallery
* Video
* CTA
* Footer

### Tahap 3 — Responsive

Optimalkan:

* Mobile
* Tablet
* Desktop

### Tahap 4 — Interaction

Tambahkan:

* Hover
* Scroll animation
* Counter
* Modal
* Lightbox
* Mobile navigation

### Tahap 5 — Dynamic UI State

Implementasikan:

* Loading
* Success
* Empty
* Error

### Tahap 6 — Final UI Polish

Periksa:

* Spacing
* Typography
* Alignment
* Image ratio
* Button
* Responsive
* Dark mode
* Accessibility
* Performance

---

# 32. Target Akhir

Frontend website SMK Muhammadiyah Tarogong Kidul harus tetap mempertahankan struktur dan data yang sudah direncanakan, tetapi mengalami peningkatan dari sisi visual dan pengalaman pengguna.

Target akhirnya:

```text
Modern
   +
Professional
   +
Clean
   +
Responsive
   +
Interactive
   +
School Identity
   +
Dynamic Content
   =
Frontend Website SMKM TARKID
```

Website tidak perlu dibuat terlalu ramai.

Prioritaskan:

> **Visual yang kuat + informasi yang jelas + navigasi mudah + animasi ringan + performa cepat.**

Dengan pendekatan ini, ketika data nyata sudah diinput melalui dashboard admin, **frontend otomatis terlihat penuh dan profesional tanpa perlu mengubah struktur frontend lagi.**