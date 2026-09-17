-- SISWA: TAHUN AJARAN MIGRATION
-- Jalankan sekali di Supabase SQL Editor agar data siswa dapat difilter
-- berdasarkan Tahun Ajaran dan nilai tersebut dapat disimpan saat input/impor.

begin;

alter table public.siswa
  add column if not exists tahun_ajaran varchar(20);

create index if not exists siswa_tahun_ajaran_kelas_idx
  on public.siswa (tahun_ajaran, kelas);

commit;
