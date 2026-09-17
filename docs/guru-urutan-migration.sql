-- GURU: URUTAN TETAP BERDASARKAN FILE IMPOR
-- Jalankan sekali di Supabase SQL Editor. Baris lama dipertahankan urutannya
-- berdasarkan waktu dibuat; data impor berikutnya akan mengikuti urutan baris file.

begin;

alter table public.guru
  add column if not exists urutan bigint;

create sequence if not exists public.guru_urutan_seq;

-- Beri nomor pada data lama tanpa mengubah urutan tampilannya saat ini.
with baris_lama as (
  select
    id,
    coalesce((select max(urutan) from public.guru), 0)
      + row_number() over (order by created_at asc, id asc) as nomor
  from public.guru
  where urutan is null
)
update public.guru
set urutan = baris_lama.nomor
from baris_lama
where public.guru.id = baris_lama.id;

alter table public.guru
  alter column urutan set default nextval('public.guru_urutan_seq');

select setval(
  'public.guru_urutan_seq',
  coalesce((select max(urutan) from public.guru), 1),
  exists(select 1 from public.guru)
);

create unique index if not exists guru_urutan_unique_idx
  on public.guru (urutan);

commit;
