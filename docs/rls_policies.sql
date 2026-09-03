-- =======================================================
-- Supabase Row Level Security (RLS) Policies
-- 
-- Petunjuk Penggunaan:
-- 1. Buka dashboard Supabase proyek Anda.
-- 2. Masuk ke menu "SQL Editor".
-- 3. Copy-paste seluruh kueri ini.
-- 4. Klik "Run".
-- 
-- Skrip ini memastikan bahwa siapa saja bisa membaca (SELECT) data,
-- namun hanya user yang sudah login (authenticated admin) yang bisa 
-- melakukan INSERT, UPDATE, dan DELETE.
-- =======================================================

-- Aktifkan RLS di setiap tabel
ALTER TABLE IF EXISTS siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS walisiswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ppdb ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS master_tahun_ajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS kategori_tagihan ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tagihan_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transaksi_pembayaran ENABLE ROW LEVEL SECURITY;

-- 1. Berikan hak akses BACA (SELECT) kepada PUBLIC (Semua orang)
CREATE POLICY "Allow public read access" ON siswa FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON guru FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON staff FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON walisiswa FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON kelas FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON jurusan FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ppdb FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON berita FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON galeri FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agenda FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON pengumuman FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON master_tahun_ajaran FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON kategori_tagihan FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON tagihan_siswa FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON transaksi_pembayaran FOR SELECT USING (true);

-- 2. Berikan hak akses TULIS (INSERT) hanya untuk AUTHENTICATED
CREATE POLICY "Allow authenticated insert access" ON siswa FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON guru FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON staff FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON walisiswa FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON kelas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON jurusan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON ppdb FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON berita FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON galeri FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON agenda FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON pengumuman FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON master_tahun_ajaran FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON kategori_tagihan FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON tagihan_siswa FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert access" ON transaksi_pembayaran FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Berikan hak akses UBAH (UPDATE) hanya untuk AUTHENTICATED
CREATE POLICY "Allow authenticated update access" ON siswa FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON guru FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON staff FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON walisiswa FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON kelas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON jurusan FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON ppdb FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON berita FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON galeri FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON agenda FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON pengumuman FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON master_tahun_ajaran FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON kategori_tagihan FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON tagihan_siswa FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update access" ON transaksi_pembayaran FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Berikan hak akses HAPUS (DELETE) hanya untuk AUTHENTICATED
CREATE POLICY "Allow authenticated delete access" ON siswa FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON guru FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON staff FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON walisiswa FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON kelas FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON jurusan FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON ppdb FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON berita FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON galeri FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON agenda FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON pengumuman FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON master_tahun_ajaran FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON kategori_tagihan FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON tagihan_siswa FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete access" ON transaksi_pembayaran FOR DELETE USING (auth.role() = 'authenticated');

-- Khusus untuk tabel PPDB, izinkan public (anon) untuk melakukan INSERT (agar siswa baru bisa daftar sendiri)
DROP POLICY IF EXISTS "Allow authenticated insert access" ON ppdb;
CREATE POLICY "Allow public insert for PPDB" ON ppdb FOR INSERT WITH CHECK (true);
