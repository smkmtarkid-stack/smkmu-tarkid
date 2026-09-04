-- ==========================================
-- Schema Database Supabase
-- SMK Muhammadiyah Tarogong Kidul
-- ==========================================

-- Enable Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Profil Sekolah
CREATE TABLE IF NOT EXISTS public.profil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    keterangan VARCHAR(255),
    gambar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Guru & Staf
CREATE TABLE IF NOT EXISTS public.guru (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    mapel VARCHAR(255),
    jabatan VARCHAR(255),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Jurusan / Program Keahlian
CREATE TABLE IF NOT EXISTS public.jurusan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    icon VARCHAR(255),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Berita & Artikel
CREATE TABLE IF NOT EXISTS public.berita (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    tanggal DATE DEFAULT CURRENT_DATE,
    isi TEXT NOT NULL,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Prestasi
CREATE TABLE IF NOT EXISTS public.prestasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    prestasi VARCHAR(255) NOT NULL,
    tingkat VARCHAR(100),
    tahun VARCHAR(10),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Pengumuman
CREATE TABLE IF NOT EXISTS public.pengumuman (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    isi TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Agenda Kegiatan
CREATE TABLE IF NOT EXISTS public.agenda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kegiatan VARCHAR(255) NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    lokasi VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabel Galeri (Foto / Video)
CREATE TABLE IF NOT EXISTS public.galeri (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kategori VARCHAR(100) DEFAULT 'Foto',
    gambar TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabel PPDB
CREATE TABLE IF NOT EXISTS public.ppdb (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    isi TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabel Download Dokumen
CREATE TABLE IF NOT EXISTS public.download (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_file VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabel Hero Slider
CREATE TABLE IF NOT EXISTS public.slider (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    gambar TEXT NOT NULL,
    tombol VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabel Siswa
CREATE TABLE IF NOT EXISTS public.siswa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nis VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    kelas VARCHAR(50),
    jurusan VARCHAR(100),
    email VARCHAR(255),
    telepon VARCHAR(100),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Tabel Alumni
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nisn VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    tahun_lulus VARCHAR(10),
    pekerjaan VARCHAR(255),
    kampus VARCHAR(255),
    email VARCHAR(255),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Tabel Application Users / Management Role
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- 'superadmin', 'admin', 'siswa', 'alumni'
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Tabel Kelas & Rombel
CREATE TABLE IF NOT EXISTS public.kelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kelas VARCHAR(100) NOT NULL,
    tingkat VARCHAR(50),
    jurusan VARCHAR(255),
    wali_kelas VARCHAR(255),
    jumlah_siswa VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Tabel Staff / Tata Usaha
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(100),
    kategori VARCHAR(100),
    jabatan VARCHAR(255),
    telepon VARCHAR(100),
    foto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Tabel Wali Siswa
CREATE TABLE IF NOT EXISTS public.walisiswa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_wali VARCHAR(255) NOT NULL,
    hubungan VARCHAR(100),
    nama_siswa VARCHAR(255),
    kelas VARCHAR(100),
    pekerjaan VARCHAR(255),
    telepon VARCHAR(100),
    alamat TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration (Akses Publik Read-Only)
ALTER TABLE public.profil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppdb ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walisiswa ENABLE ROW LEVEL SECURITY;

-- Policy untuk read public
CREATE POLICY "Public Read Profil" ON public.profil FOR SELECT USING (true);
CREATE POLICY "Public Read Guru" ON public.guru FOR SELECT USING (true);
CREATE POLICY "Public Read Jurusan" ON public.jurusan FOR SELECT USING (true);
CREATE POLICY "Public Read Berita" ON public.berita FOR SELECT USING (true);
CREATE POLICY "Public Read Prestasi" ON public.prestasi FOR SELECT USING (true);
CREATE POLICY "Public Read Pengumuman" ON public.pengumuman FOR SELECT USING (true);
CREATE POLICY "Public Read Agenda" ON public.agenda FOR SELECT USING (true);
CREATE POLICY "Public Read Galeri" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Public Read PPDB" ON public.ppdb FOR SELECT USING (true);
CREATE POLICY "Public Read Download" ON public.download FOR SELECT USING (true);
CREATE POLICY "Public Read Slider" ON public.slider FOR SELECT USING (true);
CREATE POLICY "Public Read Siswa" ON public.siswa FOR SELECT USING (true);
CREATE POLICY "Public Read Alumni" ON public.alumni FOR SELECT USING (true);
CREATE POLICY "Public Read Kelas" ON public.kelas FOR SELECT USING (true);
CREATE POLICY "Public Read Staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Public Read WaliSiswa" ON public.walisiswa FOR SELECT USING (true);

-- Policy untuk Full Access (Insert/Update/Delete) via Anon/Auth
CREATE POLICY "Anon Write Profil" ON public.profil FOR ALL USING (true);
CREATE POLICY "Anon Write Guru" ON public.guru FOR ALL USING (true);
CREATE POLICY "Anon Write Jurusan" ON public.jurusan FOR ALL USING (true);
CREATE POLICY "Anon Write Berita" ON public.berita FOR ALL USING (true);
CREATE POLICY "Anon Write Prestasi" ON public.prestasi FOR ALL USING (true);
CREATE POLICY "Anon Write Pengumuman" ON public.pengumuman FOR ALL USING (true);
CREATE POLICY "Anon Write Agenda" ON public.agenda FOR ALL USING (true);
CREATE POLICY "Anon Write Galeri" ON public.galeri FOR ALL USING (true);
CREATE POLICY "Anon Write PPDB" ON public.ppdb FOR ALL USING (true);
CREATE POLICY "Anon Write Download" ON public.download FOR ALL USING (true);
CREATE POLICY "Anon Write Slider" ON public.slider FOR ALL USING (true);
CREATE POLICY "Anon Write Siswa" ON public.siswa FOR ALL USING (true);
CREATE POLICY "Anon Write Alumni" ON public.alumni FOR ALL USING (true);
CREATE POLICY "Anon Write Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Anon Write Kelas" ON public.kelas FOR ALL USING (true);
CREATE POLICY "Anon Write Staff" ON public.staff FOR ALL USING (true);
CREATE POLICY "Anon Write WaliSiswa" ON public.walisiswa FOR ALL USING (true);

-- STORAGE BUCKETS INSTRUCTIONS:
-- Buat Bucket bernama "uploads" di Supabase Dashboard -> Storage -> Create New Bucket
-- Set bucket "uploads" sebagai PUBLIC.

-- ===============================================================================================
-- 23. PENGATURAN (Settings/Contact Info)
-- ===============================================================================================
CREATE TABLE public.pengaturan (
    id INT PRIMARY KEY DEFAULT 1,
    alamat TEXT,
    telepon VARCHAR(50),
    email VARCHAR(100),
    whatsapp VARCHAR(50),
    facebook TEXT,
    instagram TEXT,
    youtube TEXT,
    tiktok TEXT,
    map_embed TEXT,
    jam_operasional TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.pengaturan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Pengaturan" ON public.pengaturan FOR SELECT USING (true);
CREATE POLICY "Anon Write Pengaturan" ON public.pengaturan FOR ALL USING (true);

