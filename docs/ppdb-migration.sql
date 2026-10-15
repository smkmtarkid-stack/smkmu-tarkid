-- =====================================================
-- PPDB MIGRATION: Penyelarasan Tabel PPDB untuk Calon Siswa Baru
-- SMK Muhammadiyah Tarogong Kidul
-- =====================================================
-- Jalankan file ini di Supabase SQL Editor.
-- Skrip ini memastikan tabel ppdb memiliki seluruh kolom
-- yang dibutuhkan oleh Formulir PPDB Online publik dan
-- Dashboard Admin PPDB, serta mengonfigurasi RLS agar calon siswa
-- dapat mendaftar tanpa harus login terlebih dahulu.

begin;

-- 1. Buat tabel jika belum ada, atau sesuaikan kolomnya
create table if not exists public.ppdb (
    id uuid primary key default uuid_generate_v4(),
    no_pendaftaran varchar(50) unique,
    nama_lengkap varchar(255) not null,
    nisn varchar(50),
    tempat_lahir varchar(100),
    tanggal_lahir date,
    jenis_kelamin varchar(20),
    asal_sekolah varchar(255),
    jurusan varchar(100),
    nama_ortu varchar(255),
    no_hp varchar(50),
    alamat text,
    status varchar(50) default 'Menunggu',
    catatan text,
    -- Kompatibilitas dengan skema lama (bila ada)
    judul varchar(255),
    isi text,
    link text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. Jika tabel sudah ada dari skema lama, pastikan kolom judul tidak NOT NULL
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'ppdb' and column_name = 'judul'
  ) then
    alter table public.ppdb alter column judul drop not null;
  end if;
end $$;

-- 3. Tambahkan kolom-kolom baru jika belum ada
alter table public.ppdb
  add column if not exists no_pendaftaran varchar(50) unique,
  add column if not exists nama_lengkap varchar(255),
  add column if not exists nisn varchar(50),
  add column if not exists tempat_lahir varchar(100),
  add column if not exists tanggal_lahir date,
  add column if not exists jenis_kelamin varchar(20),
  add column if not exists asal_sekolah varchar(255),
  add column if not exists jurusan varchar(100),
  add column if not exists nama_ortu varchar(255),
  add column if not exists no_hp varchar(50),
  add column if not exists alamat text,
  add column if not exists status varchar(50) default 'Menunggu',
  add column if not exists catatan text;

-- 4. Indeks performa & pencarian
create index if not exists ppdb_status_idx on public.ppdb (status);
create index if not exists ppdb_jurusan_idx on public.ppdb (jurusan);
create index if not exists ppdb_created_at_idx on public.ppdb (created_at desc);

-- 5. Konfigurasi Row Level Security (RLS)
alter table public.ppdb enable row level security;

-- Hapus kebijakan lama jika ada agar bersih
drop policy if exists "ppdb_public_insert" on public.ppdb;
drop policy if exists "ppdb_public_select" on public.ppdb;
drop policy if exists "ppdb_admin_all" on public.ppdb;
drop policy if exists "Public Read PPDB" on public.ppdb;
drop policy if exists "Anon Write PPDB" on public.ppdb;
drop policy if exists "public_read" on public.ppdb;
drop policy if exists "admin_manage" on public.ppdb;

-- A. Calon siswa (anon/publik) diizinkan mendaftar (INSERT)
create policy "ppdb_public_insert"
on public.ppdb
for insert
to anon, authenticated
with check (true);

-- B. Calon siswa dapat membaca/mengecek status pendaftaran mereka sendiri (SELECT publik)
create policy "ppdb_public_select"
on public.ppdb
for select
to anon, authenticated
using (true);

-- C. Admin dan Super Admin memiliki akses penuh (SELECT, UPDATE status, DELETE)
create policy "ppdb_admin_all"
on public.ppdb
for all
to authenticated
using (
  coalesce(
    (select role from public.users where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and status = 'active' limit 1) in ('admin', 'superadmin'),
    false
  )
)
with check (
  coalesce(
    (select role from public.users where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and status = 'active' limit 1) in ('admin', 'superadmin'),
    false
  )
);

commit;
