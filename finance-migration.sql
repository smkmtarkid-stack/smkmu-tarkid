-- Skema Database Modul Keuangan

-- 1. Tabel Kategori Tagihan
CREATE TABLE public.kategori_tagihan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kategori text NOT NULL, -- Contoh: "SPP", "Uang Gedung"
  nominal_default numeric NOT NULL DEFAULT 0,
  deskripsi text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Tabel Tagihan Siswa
CREATE TABLE public.tagihan_siswa (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  id_siswa text NOT NULL, -- Asumsi kolom id di tabel siswa bertipe text/uuid
  id_kategori uuid NOT NULL REFERENCES public.kategori_tagihan(id) ON DELETE CASCADE,
  nominal numeric NOT NULL,
  status_lunas boolean DEFAULT false,
  bulan_tagihan date, -- Untuk mencatat ini tagihan bulan apa (opsional)
  tahun_ajaran text NOT NULL DEFAULT '2026/2027', -- Tahun ajaran tagihan ini berlaku
  kelas_saat_tagihan text, -- Snapshot kelas siswa saat tagihan di-generate
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Tabel Transaksi Pembayaran
CREATE TABLE public.transaksi_pembayaran (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  id_tagihan uuid NOT NULL REFERENCES public.tagihan_siswa(id) ON DELETE CASCADE,
  id_siswa text NOT NULL,
  nominal_bayar numeric NOT NULL,
  tanggal_bayar timestamp with time zone DEFAULT now(),
  metode_pembayaran text DEFAULT 'CASH',
  petugas text, -- Nama atau ID admin yang menerima pembayaran
  created_at timestamp with time zone DEFAULT now()
);

-- Set RLS (Row Level Security) - Opsional, disesuaikan dengan kebutuhan keamanan
ALTER TABLE public.kategori_tagihan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tagihan_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi_pembayaran ENABLE ROW LEVEL SECURITY;

-- Policy dasar: Admin bisa akses semua (Diubah menjadi public untuk testing lokal)
CREATE POLICY "Enable read/write for public" ON public.kategori_tagihan FOR ALL TO public USING (true);
CREATE POLICY "Enable read/write for public" ON public.tagihan_siswa FOR ALL TO public USING (true);
CREATE POLICY "Enable read/write for public" ON public.transaksi_pembayaran FOR ALL TO public USING (true);

-- ==========================================
-- MIGRASI: Tambah kolom tahun_ajaran & kelas_saat_tagihan
-- Jalankan ini jika tabel tagihan_siswa sudah ada sebelumnya
-- ==========================================

-- Tambah kolom baru (abaikan jika sudah ada)
ALTER TABLE public.tagihan_siswa 
  ADD COLUMN IF NOT EXISTS tahun_ajaran text NOT NULL DEFAULT '2026/2027';
ALTER TABLE public.tagihan_siswa 
  ADD COLUMN IF NOT EXISTS kelas_saat_tagihan text;

-- Backfill: Isi kelas_saat_tagihan dari data siswa saat ini untuk record lama
UPDATE public.tagihan_siswa ts
SET kelas_saat_tagihan = s.kelas
FROM public.siswa s
WHERE ts.id_siswa = s.id::text
AND ts.kelas_saat_tagihan IS NULL;

-- Index untuk performa query per tahun ajaran
CREATE INDEX IF NOT EXISTS idx_tagihan_tahun_ajaran ON public.tagihan_siswa(tahun_ajaran);
CREATE INDEX IF NOT EXISTS idx_tagihan_siswa_tahun ON public.tagihan_siswa(id_siswa, tahun_ajaran);

-- ==========================================
-- MIGRASI 2: Tabel Master Tahun Ajaran
-- ==========================================

CREATE TABLE public.master_tahun_ajaran (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_tahun text NOT NULL UNIQUE, -- Contoh: "2026/2027"
  is_active boolean DEFAULT false, -- Hanya boleh 1 yang true
  created_at timestamp with time zone DEFAULT now()
);

-- Setup RLS untuk master_tahun_ajaran
ALTER TABLE public.master_tahun_ajaran ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read/write for public" ON public.master_tahun_ajaran FOR ALL TO public USING (true);

-- Insert data awal (2026/2027 aktif sebagai default)
INSERT INTO public.master_tahun_ajaran (nama_tahun, is_active)
VALUES 
  ('2025/2026', false),
  ('2026/2027', true),
  ('2027/2028', false)
ON CONFLICT (nama_tahun) DO NOTHING;
