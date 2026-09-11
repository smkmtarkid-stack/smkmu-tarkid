-- FINANCE HARDENING MIGRATION
-- Run this after finance-migration.sql and security-hardening.sql.
-- It does not delete or merge any existing data. If duplicate bills are found,
-- it stops and reports them so they can be reviewed first.

begin;

-- Reject a uniqueness migration until existing duplicate bills are resolved.
do $$
begin
  if exists (
    select 1
    from public.tagihan_siswa
    group by id_siswa, id_kategori, tahun_ajaran, coalesce(bulan_tagihan, date '0001-01-01')
    having count(*) > 1
  ) then
    raise exception 'Tagihan duplikat ditemukan. Tinjau query preflight di akhir file sebelum menjalankan ulang migrasi.';
  end if;
end $$;

-- One student may receive one bill per category, academic year, and month.
-- The sentinel date handles one-time bills where bulan_tagihan is NULL.
create unique index if not exists tagihan_siswa_unique_period
on public.tagihan_siswa (
  id_siswa,
  id_kategori,
  tahun_ajaran,
  coalesce(bulan_tagihan, date '0001-01-01')
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tagihan_siswa_nominal_nonnegative'
      and conrelid = 'public.tagihan_siswa'::regclass
  ) then
    alter table public.tagihan_siswa
      add constraint tagihan_siswa_nominal_nonnegative
      check (nominal >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'transaksi_pembayaran_nominal_nonnegative'
      and conrelid = 'public.transaksi_pembayaran'::regclass
  ) then
    alter table public.transaksi_pembayaran
      add constraint transaksi_pembayaran_nominal_nonnegative
      check (nominal_bayar >= 0) not valid;
  end if;
end $$;

-- An append-only audit trail for finance changes. Old and new row data are
-- stored as JSON to support later reconciliation without exposing it publicly.
create table if not exists public.audit_keuangan (
  id uuid primary key default gen_random_uuid(),
  terjadi_pada timestamptz not null default now(),
  pelaku_email text,
  aksi text not null check (aksi in ('INSERT', 'UPDATE', 'DELETE')),
  nama_tabel text not null,
  record_id uuid,
  data_lama jsonb,
  data_baru jsonb
);

-- Operational expenses are separate from student payments. Never record a
-- payment here: cash-in always comes from transaksi_pembayaran.
create table if not exists public.pengeluaran_keuangan (
  id uuid primary key default gen_random_uuid(),
  tanggal timestamptz not null default now(),
  kategori text not null,
  deskripsi text not null,
  nominal numeric not null check (nominal > 0),
  metode_pembayaran text not null default 'CASH',
  status text not null default 'active' check (status in ('active', 'void')),
  alasan_void text,
  dibuat_oleh text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pengeluaran_keuangan enable row level security;
drop policy if exists pengeluaran_keuangan_admin_manage on public.pengeluaran_keuangan;
create policy pengeluaran_keuangan_admin_manage on public.pengeluaran_keuangan
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.audit_keuangan enable row level security;
drop policy if exists audit_keuangan_admin_read on public.audit_keuangan;
create policy audit_keuangan_admin_read on public.audit_keuangan
for select to authenticated
using (public.is_admin());

create or replace function public.audit_keuangan_perubahan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_keuangan (
    pelaku_email, aksi, nama_tabel, record_id, data_lama, data_baru
  ) values (
    auth.jwt() ->> 'email',
    tg_op,
    tg_table_name,
    case when tg_op = 'DELETE' then old.id else new.id end,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists audit_tagihan_siswa on public.tagihan_siswa;
create trigger audit_tagihan_siswa
after insert or update or delete on public.tagihan_siswa
for each row execute function public.audit_keuangan_perubahan();

drop trigger if exists audit_transaksi_pembayaran on public.transaksi_pembayaran;
create trigger audit_transaksi_pembayaran
after insert or update or delete on public.transaksi_pembayaran
for each row execute function public.audit_keuangan_perubahan();

drop trigger if exists audit_pengeluaran_keuangan on public.pengeluaran_keuangan;
create trigger audit_pengeluaran_keuangan
after insert or update or delete on public.pengeluaran_keuangan
for each row execute function public.audit_keuangan_perubahan();

-- Processes a full payment or voucher in one transaction. Row locks eliminate
-- races between two cashier tabs. Partial payments are intentionally rejected
-- because the current schema models a bill as paid/unpaid only.
create or replace function public.proses_pembayaran_tagihan(
  p_tagihan_ids uuid[],
  p_metode_pembayaran text default 'CASH'
)
returns table (id_transaksi uuid, id_tagihan uuid, nominal_bayar numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  tagihan record;
  transaksi_id uuid;
  metode text := upper(trim(coalesce(p_metode_pembayaran, 'CASH')));
  nilai_bayar numeric;
begin
  if not public.is_admin() then
    raise exception 'Tidak berwenang memproses pembayaran';
  end if;

  if coalesce(array_length(p_tagihan_ids, 1), 0) = 0 then
    raise exception 'Pilih minimal satu tagihan';
  end if;

  if metode not in ('CASH', 'TRANSFER', 'QRIS', 'VOUCHER') then
    raise exception 'Metode pembayaran tidak didukung';
  end if;

  for tagihan in
    select id, id_siswa, nominal, status_lunas
    from public.tagihan_siswa
    where id = any(p_tagihan_ids)
    order by id
    for update
  loop
    if tagihan.status_lunas then
      raise exception 'Tagihan % sudah lunas', tagihan.id;
    end if;

    nilai_bayar := case when metode = 'VOUCHER' then 0 else tagihan.nominal end;

    update public.tagihan_siswa
    set status_lunas = true
    where id = tagihan.id;

    insert into public.transaksi_pembayaran (
      id_tagihan, id_siswa, nominal_bayar, metode_pembayaran, petugas
    ) values (
      tagihan.id, tagihan.id_siswa, nilai_bayar, metode, auth.jwt() ->> 'email'
    ) returning id into transaksi_id;

    id_transaksi := transaksi_id;
    id_tagihan := tagihan.id;
    nominal_bayar := nilai_bayar;
    return next;
  end loop;

  if not found then
    raise exception 'Tidak ada tagihan yang ditemukan';
  end if;
end;
$$;

revoke all on function public.proses_pembayaran_tagihan(uuid[], text) from public;
grant execute on function public.proses_pembayaran_tagihan(uuid[], text) to authenticated;

commit;

-- PREFLIGHT DUPLICATE REPORT (read-only; run this if the migration stops):
-- select id_siswa, id_kategori, tahun_ajaran, bulan_tagihan, count(*) as jumlah,
--        array_agg(id order by created_at) as tagihan_ids
-- from public.tagihan_siswa
-- group by id_siswa, id_kategori, tahun_ajaran, bulan_tagihan
-- having count(*) > 1;
