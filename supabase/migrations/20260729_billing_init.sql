-- Deskzy billing + auth profile schema
-- Apply via Supabase SQL editor if MCP/CLI unavailable.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null default 'free'
    check (plan in ('free', 'pro', 'business')),
  status text not null default 'inactive'
    check (status in (
      'inactive', 'created', 'authenticated', 'active',
      'pending', 'halted', 'cancelled', 'completed', 'expired'
    )),
  billing_cycle text check (billing_cycle in ('monthly', 'yearly')),
  seats int not null default 1 check (seats >= 1 and seats <= 100),
  razorpay_subscription_id text unique,
  razorpay_plan_id text,
  razorpay_customer_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_razorpay_sub_idx
  on public.subscriptions (razorpay_subscription_id);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create table if not exists public.seat_members (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (subscription_id, user_id)
);

alter table public.seat_members enable row level security;

drop policy if exists "Members can view own seats" on public.seat_members;
create policy "Members can view own seats"
  on public.seat_members for select
  using (auth.uid() = user_id);

create table if not exists public.usage_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anon_key text,
  tool_slug text not null,
  day date not null default (timezone('utc', now()))::date,
  count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint usage_daily_identity check (user_id is not null or anon_key is not null)
);

create unique index if not exists usage_daily_user_tool_day_uidx
  on public.usage_daily (user_id, tool_slug, day)
  where user_id is not null;

create unique index if not exists usage_daily_anon_tool_day_uidx
  on public.usage_daily (anon_key, tool_slug, day)
  where anon_key is not null;

alter table public.usage_daily enable row level security;

drop policy if exists "Users can view own usage" on public.usage_daily;
create policy "Users can view own usage"
  on public.usage_daily for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
