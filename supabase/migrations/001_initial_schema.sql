-- ============================================================
-- SDR Extension — Initial Schema
-- ============================================================
-- Run order: this file first, then subsequent migrations.
-- All tables use RLS — every row is owned by a user or team.
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── Plans & Limits ─────────────────────────────────────────

create type plan_type as enum ('free', 'pro', 'team');

-- ─── Teams ───────────────────────────────────────────────────

create table teams (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  plan        plan_type not null default 'team',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table teams enable row level security;

-- ─── User Profiles ───────────────────────────────────────────

create table user_profiles (
  id                          uuid primary key references auth.users(id) on delete cascade,
  email                       text not null,
  plan                        plan_type not null default 'free',
  lookups_used_this_month     integer not null default 0,
  lookups_limit               integer not null default 10,  -- free tier
  lookups_reset_at            timestamptz not null default date_trunc('month', now()) + interval '1 month',
  team_id                     uuid references teams(id) on delete set null,
  -- BYOK flags (actual keys stored encrypted separately)
  byok_openrouter_key_set     boolean not null default false,
  byok_apollo_key_set         boolean not null default false,
  byok_lusha_key_set          boolean not null default false,
  -- Lemon Squeezy
  lemon_customer_id           text,
  lemon_subscription_id       text,
  lemon_subscription_status   text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

alter table user_profiles enable row level security;

-- Users can only see and update their own profile
create policy "user_profiles_select_own"
  on user_profiles for select
  using (auth.uid() = id);

create policy "user_profiles_update_own"
  on user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── BYOK Keys (encrypted at rest) ──────────────────────────

create table byok_keys (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  key_type    text not null check (key_type in ('openrouter', 'apollo', 'lusha')),
  -- Encrypted with pgcrypto using a server-side secret
  encrypted_key text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, key_type)
);

alter table byok_keys enable row level security;

-- Users can only access their own keys; the actual value is always encrypted
create policy "byok_keys_own"
  on byok_keys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── CNPJ Cache ──────────────────────────────────────────────

create table cnpj_cache (
  cnpj          text primary key,  -- 14-digit stripped CNPJ
  raw_data      jsonb not null,    -- Raw response from CNPJ API
  -- LGPD: flag MEI/EI rows — these contain personal data
  is_personal   boolean not null default false,
  cached_at     timestamptz not null default now(),
  expires_at    timestamptz not null default now() + interval '30 days'
);

-- No RLS on cnpj_cache — it's shared across all users (no PII stored here)
-- Service role only writes; anon key cannot write
alter table cnpj_cache enable row level security;

create policy "cnpj_cache_select_all"
  on cnpj_cache for select
  using (true);

-- Only service role (Edge Functions) can insert/update
create policy "cnpj_cache_write_service"
  on cnpj_cache for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── Lookup History ──────────────────────────────────────────

create table lookup_history (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  cnpj          text not null,
  razao_social  text,
  looked_up_at  timestamptz not null default now(),
  -- Store only the summary, no enriched personal data
  result_summary text
);

alter table lookup_history enable row level security;

create policy "lookup_history_own"
  on lookup_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── Usage Events (for analytics) ───────────────────────────

create table usage_events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_type  text not null,  -- 'lookup', 'message_copy', 'upgrade_click'
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

alter table usage_events enable row level security;

create policy "usage_events_own"
  on usage_events for select
  using (auth.uid() = user_id);

-- Only service role inserts
create policy "usage_events_insert_service"
  on usage_events for insert
  with check (auth.role() = 'service_role');

-- ─── Auto-create profile on sign-up ─────────────────────────

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, plan, lookups_limit)
  values (
    new.id,
    new.email,
    'free',
    10
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Reset usage monthly ─────────────────────────────────────

create or replace function reset_monthly_usage()
returns void
language plpgsql
security definer
as $$
begin
  update user_profiles
  set
    lookups_used_this_month = 0,
    lookups_reset_at = date_trunc('month', now()) + interval '1 month',
    updated_at = now()
  where lookups_reset_at <= now();
end;
$$;

-- ─── Indexes ─────────────────────────────────────────────────

create index idx_lookup_history_user_id on lookup_history(user_id);
create index idx_lookup_history_looked_up_at on lookup_history(looked_up_at desc);
create index idx_cnpj_cache_expires_at on cnpj_cache(expires_at);
create index idx_usage_events_user_id on usage_events(user_id);
create index idx_usage_events_created_at on usage_events(created_at desc);
create index idx_user_profiles_team_id on user_profiles(team_id);
