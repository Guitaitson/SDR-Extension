-- Migration 003: add Clay to BYOK infrastructure
-- Extends the byok_keys table to support Clay API keys and adds the
-- corresponding flag column to user_profiles.

-- ── 1. Alter key_type check constraint to include 'clay' ──────────────────────
-- PostgreSQL doesn't support ALTER CONSTRAINT directly; drop + recreate.
ALTER TABLE byok_keys DROP CONSTRAINT IF EXISTS byok_keys_key_type_check;
ALTER TABLE byok_keys
  ADD CONSTRAINT byok_keys_key_type_check
  CHECK (key_type IN ('openrouter', 'apollo', 'lusha', 'clay'));

-- ── 2. Add Clay flag to user_profiles ────────────────────────────────────────
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS byok_clay_key_set boolean NOT NULL DEFAULT false;

-- ── 3. Update upsert_byok_key RPC to accept 'clay' ───────────────────────────
-- The function itself doesn't need changes — it only validates via the DB
-- constraint, which was updated above. No DDL changes needed for the RPC.
