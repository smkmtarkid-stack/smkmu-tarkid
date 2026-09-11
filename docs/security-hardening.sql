-- SECURITY HARDENING MIGRATION
-- Run once in Supabase SQL Editor as the project owner.
-- This replaces every existing policy on the listed application tables.
-- Test in a staging project first and keep an owner/superadmin account active.

begin;

-- Resolve application roles on the database side. SECURITY DEFINER avoids
-- circular RLS checks while the function remains callable only by logged-in users.
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.users
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status = 'active'
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in ('admin', 'superadmin');
$$;

revoke all on function public.current_app_role() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.current_app_role() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- Remove legacy broad policies and enable RLS for every managed table that
-- exists. This also covers prior "Anon Write" and "Allow public" policies.
do $$
declare
  managed_tables text[] := array[
    'profil', 'guru', 'jurusan', 'berita', 'prestasi', 'pengumuman', 'agenda',
    'galeri', 'ppdb', 'download', 'slider', 'siswa', 'alumni', 'users',
    'kelas', 'staff', 'walisiswa', 'pengaturan', 'kategori_tagihan',
    'tagihan_siswa', 'transaksi_pembayaran', 'master_tahun_ajaran'
  ];
  policy_record record;
  table_name text;
begin
  for table_name in select unnest(managed_tables) loop
    if to_regclass('public.' || table_name) is not null then
      for policy_record in
        select policyname from pg_policies
        where schemaname = 'public' and tablename = table_name
      loop
        execute format('drop policy if exists %I on public.%I', policy_record.policyname, table_name);
      end loop;
      execute format('alter table public.%I enable row level security', table_name);
    end if;
  end loop;
end $$;

-- Public website content: read-only. No anonymous INSERT, UPDATE, or DELETE.
do $$
declare
  public_tables text[] := array[
    'profil', 'guru', 'jurusan', 'berita', 'prestasi', 'pengumuman', 'agenda',
    'galeri', 'ppdb', 'download', 'slider', 'pengaturan'
  ];
  table_name text;
begin
  for table_name in select unnest(public_tables) loop
    if to_regclass('public.' || table_name) is not null then
      execute format(
        'create policy public_read on public.%I for select to anon, authenticated using (true)',
        table_name
      );
    end if;
  end loop;
end $$;

-- Only active admin/superadmin accounts may manage application data.
do $$
declare
  managed_tables text[] := array[
    'profil', 'guru', 'jurusan', 'berita', 'prestasi', 'pengumuman', 'agenda',
    'galeri', 'ppdb', 'download', 'slider', 'siswa', 'alumni', 'users',
    'kelas', 'staff', 'walisiswa', 'pengaturan', 'kategori_tagihan',
    'tagihan_siswa', 'transaksi_pembayaran', 'master_tahun_ajaran'
  ];
  table_name text;
begin
  for table_name in select unnest(managed_tables) loop
    if to_regclass('public.' || table_name) is not null then
      execute format(
        'create policy admin_manage on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
        table_name
      );
    end if;
  end loop;
end $$;

-- A signed-in user may read only their own application profile and their own
-- student/alumni record. Records are linked by their Supabase Auth email.
create policy users_read_own on public.users
for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy siswa_read_own on public.siswa
for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy alumni_read_own on public.alumni
for select to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

commit;

-- Storage is configured separately. For bucket "uploads", keep public SELECT
-- only if its contents are intended for the public website. Do not create any
-- INSERT/UPDATE/DELETE policy for anon. Grant write permissions only to admins
-- using public.is_admin() in storage.objects policies.
