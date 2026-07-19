-- LingoDaily — Supabase schema
-- รัน SQL นี้ใน Supabase Dashboard → SQL Editor หลังสร้างโปรเจกต์ใหม่
-- ทุกตารางเปิด Row Level Security: ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตัวเอง

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text default 'ผู้เรียน',
  daily_goal_xp integer default 50,
  ui_lang text default 'th',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "own profile - select" on public.profiles
  for select using (auth.uid() = id);
create policy "own profile - upsert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "own profile - update" on public.profiles
  for update using (auth.uid() = id);

-- สร้างแถว profile อัตโนมัติเมื่อมีผู้ใช้ใหม่
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- srs_progress ----------
create table if not exists public.srs_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  lang text not null,
  ease real not null default 2.5,
  interval_days integer not null default 0,
  repetitions integer not null default 0,
  lapses integer not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  primary key (user_id, item_id)
);

alter table public.srs_progress enable row level security;

create policy "own srs - all" on public.srs_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists srs_due_idx on public.srs_progress (user_id, due_at);

-- ---------- unit_progress ----------
create table if not exists public.unit_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text not null,
  status text not null default 'in_progress',
  best_score integer not null default 0,
  completed_at timestamptz,
  primary key (user_id, unit_id)
);

alter table public.unit_progress enable row level security;

create policy "own unit - all" on public.unit_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- daily_stats ----------
create table if not exists public.daily_stats (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  xp integer not null default 0,
  reviews_done integer not null default 0,
  new_items integer not null default 0,
  minutes integer not null default 0,
  primary key (user_id, date)
);

alter table public.daily_stats enable row level security;

create policy "own daily - all" on public.daily_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
