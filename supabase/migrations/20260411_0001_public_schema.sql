create extension if not exists pgcrypto;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admins
    where user_id = auth.uid()
  );
$$;

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  item text not null,
  path text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id text primary key,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  phone text not null,
  email text default '',
  service text not null,
  date text not null,
  time text not null,
  notes text default '',
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats (id) on delete cascade,
  sender text not null check (sender in ('user', 'agent', 'system')),
  text text,
  attachment_url text,
  attachment_name text,
  attachment_type text,
  audio_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referral_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  place_of_work text not null,
  phone text not null,
  status text not null check (status in ('pending', 'confirmed')),
  referrals_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.touch_chat_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.chats
  set updated_at = timezone('utc', now())
  where id = new.chat_id;

  return new;
end;
$$;

drop trigger if exists touch_chat_updated_at on public.chat_messages;
create trigger touch_chat_updated_at
after insert on public.chat_messages
for each row
execute function public.touch_chat_updated_at();

alter table public.admins enable row level security;
alter table public.analytics_events enable row level security;
alter table public.appointments enable row level security;
alter table public.chats enable row level security;
alter table public.chat_messages enable row level security;
alter table public.referral_partners enable row level security;

drop policy if exists "Admins can manage admins" on public.admins;
create policy "Admins can manage admins"
on public.admins
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage analytics" on public.analytics_events;
create policy "Admins can manage analytics"
on public.analytics_events
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage appointments" on public.appointments;
create policy "Admins can manage appointments"
on public.appointments
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admins can manage referrals" on public.referral_partners;
create policy "Admins can manage referrals"
on public.referral_partners
for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Users can create chats" on public.chats;
create policy "Users can create chats"
on public.chats
for insert
to authenticated
with check (auth.uid() = user_id or public.is_admin_user());

drop policy if exists "Users can read chats" on public.chats;
create policy "Users can read chats"
on public.chats
for select
to authenticated
using (auth.uid() = user_id or public.is_admin_user());

drop policy if exists "Admins can manage chats" on public.chats;
create policy "Admins can manage chats"
on public.chats
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Users can create chat messages" on public.chat_messages;
create policy "Users can create chat messages"
on public.chat_messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.chats
    where chats.id = chat_id
      and (chats.user_id = auth.uid() or public.is_admin_user())
  )
);

drop policy if exists "Users can read chat messages" on public.chat_messages;
create policy "Users can read chat messages"
on public.chat_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.chats
    where chats.id = chat_id
      and (chats.user_id = auth.uid() or public.is_admin_user())
  )
);

insert into storage.buckets (id, name, public)
values ('silhouette', 'silhouette', true)
on conflict (id) do update
set public = excluded.public;
