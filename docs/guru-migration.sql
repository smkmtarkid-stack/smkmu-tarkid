-- GURU DATA ENRICHMENT MIGRATION
-- Jalankan sekali di Supabase SQL Editor untuk database yang tabel public.guru-nya
-- sudah terlanjur dibuat sebelum kolom data guru lengkap tersedia.
-- NIP/NUPTK sengaja tidak diberi NOT NULL agar guru tanpa nomor tersebut tetap bisa disimpan.

begin;

alter table public.guru
  add column if not exists nip_nuptk varchar(100),
  add column if not exists tempat_lahir varchar(255),
  add column if not exists tanggal_lahir date,
  add column if not exists pendidikan_terakhir varchar(255);

comment on column public.guru.nip_nuptk is
  'NIP atau NUPTK; boleh kosong untuk guru yang belum memilikinya.';

commit;

-- Catatan: kolom mapel tetap dibiarkan untuk kompatibilitas data lama.
