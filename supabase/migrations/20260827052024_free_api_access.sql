-- API keys for Free, Pro, and Business accounts.
-- Plaintext secrets are shown once; only SHA-256 hashes are stored.

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Default' check (char_length(name) between 1 and 64),
  key_prefix text not null,
  key_hash text not null unique,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists api_keys_user_id_idx
  on public.api_keys (user_id, created_at desc);

alter table public.api_keys enable row level security;

-- Server routes are the only intended data path. Explicit grants are required
-- for projects using Supabase's 2026 opt-in Data API defaults.
revoke all on table public.api_keys from anon, authenticated;
grant select, insert, update, delete on table public.api_keys to service_role;

drop policy if exists "Users can view own API keys" on public.api_keys;
drop policy if exists "Users can view own api keys" on public.api_keys;
create policy "Users can view own API keys"
  on public.api_keys for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Creation, revocation, and hash resolution stay behind server-side service-role code.

-- This trigger function should only run from auth.users inserts, never as a public RPC.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
