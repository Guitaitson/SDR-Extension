-- Migration 002: add upsert_byok_key RPC
-- Called by the update-byok-keys Edge Function to encrypt and persist API keys.
-- Uses pgcrypto for symmetric encryption; the passphrase comes from ENCRYPTION_KEY secret.

create extension if not exists pgcrypto;

-- ── RPC: upsert_byok_key ─────────────────────────────────────────────────────
-- Upserts a BYOK API key for a user, encrypting it with pgcrypto.
-- Only callable via service-role (Edge Function); RLS prevents direct user access.
create or replace function upsert_byok_key(
  p_user_id     uuid,
  p_key_type    text,
  p_raw_key     text,
  p_encrypt_key text
)
returns void
language plpgsql
security definer   -- runs as the function owner (postgres), bypasses RLS
set search_path = public
as $$
begin
  insert into byok_keys (user_id, key_type, encrypted_key, updated_at)
  values (
    p_user_id,
    p_key_type,
    pgp_sym_encrypt(p_raw_key, p_encrypt_key),
    now()
  )
  on conflict (user_id, key_type) do update
    set encrypted_key = excluded.encrypted_key,
        updated_at    = now();
end;
$$;

-- ── RPC: get_byok_key ─────────────────────────────────────────────────────────
-- Decrypts and returns a BYOK key for the requesting user.
-- The Edge Function (service-role) can pass any user_id; used inside enrich-cnpj.
create or replace function get_byok_key(
  p_user_id     uuid,
  p_key_type    text,
  p_encrypt_key text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_decrypted text;
begin
  select pgp_sym_decrypt(encrypted_key::bytea, p_encrypt_key)
    into v_decrypted
    from byok_keys
   where user_id = p_user_id
     and key_type = p_key_type
   limit 1;

  return v_decrypted;   -- returns NULL if not found
end;
$$;

-- ── Secret env reminder ───────────────────────────────────────────────────────
-- Run before deploying Edge Functions:
--   supabase secrets set BYOK_ENCRYPTION_SECRET=$(openssl rand -hex 32)
-- Do NOT put the value here; it lives only in Supabase secrets.
