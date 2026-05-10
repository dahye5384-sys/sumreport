-- Meeting Minutes Summarizer — Supabase schema
-- Run this in your Supabase project's SQL Editor (Dashboard → SQL → New query).
--
-- This creates:
--   1. The `meetings` table (one row per saved summary)
--   2. Row Level Security (RLS) policies so each user only sees their own rows
--   3. An index on (user_id, created_at) for fast history listing

-- 1. Table -------------------------------------------------------------------
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  original_text text not null,
  summary text not null,
  model text,
  created_at timestamptz not null default now()
);

-- 2. Indexes -----------------------------------------------------------------
create index if not exists meetings_user_created_idx
  on public.meetings (user_id, created_at desc);

-- 3. Row Level Security ------------------------------------------------------
alter table public.meetings enable row level security;

-- Policy: a user can read only their own rows
drop policy if exists "Users can read their own meetings" on public.meetings;
create policy "Users can read their own meetings"
  on public.meetings
  for select
  using (auth.uid() = user_id);

-- Policy: a user can insert rows only for their own user_id
drop policy if exists "Users can insert their own meetings" on public.meetings;
create policy "Users can insert their own meetings"
  on public.meetings
  for insert
  with check (auth.uid() = user_id);

-- Policy: a user can delete only their own rows (optional — for future delete UI)
drop policy if exists "Users can delete their own meetings" on public.meetings;
create policy "Users can delete their own meetings"
  on public.meetings
  for delete
  using (auth.uid() = user_id);

-- (No update policy: rows are immutable. Re-summarize creates a new row.)
