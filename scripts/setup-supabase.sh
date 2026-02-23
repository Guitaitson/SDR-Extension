#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# SDR Extension — Supabase Setup Script
# =============================================================================
# Run this ONCE from your local machine (with supabase CLI installed).
#
# Prerequisites:
#   supabase CLI: brew install supabase/tap/supabase  (mac)
#                 npx supabase  (or: npm i -g supabase)
#   Supabase project created at: https://app.supabase.com
#
# Required env vars (export before running):
#   SUPABASE_PROJECT_REF   from URL: https://app.supabase.com/project/YOUR_REF
#   OPENROUTER_API_KEY     from https://openrouter.ai/keys  (~R$0.005 / consulta)
#   BYOK_ENCRYPTION_SECRET any 32+ char string: $(openssl rand -hex 32)
#
# Optional — add to give ALL users contact enrichment without BYOK setup:
#   PLATFORM_APOLLO_KEY    your Apollo.io key (free tier: 50 credits/month)
#   PLATFORM_LUSHA_KEY     your Lusha key
#   PLATFORM_CLAY_KEY      your Clay key
#
# Optional — configure after setting up Lemon Squeezy:
#   LEMON_WEBHOOK_SECRET   from Lemon Squeezy → Webhooks
#   LEMON_VARIANT_PRO      Pro plan variant ID
#   LEMON_VARIANT_TEAM     Team plan variant ID
#
# Usage:
#   export SUPABASE_PROJECT_REF=abcdefghijk
#   export OPENROUTER_API_KEY=sk-or-v1-...
#   export BYOK_ENCRYPTION_SECRET=$(openssl rand -hex 32)
#   bash scripts/setup-supabase.sh
# =============================================================================

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

check_var() {
  if [ -z "${!1:-}" ]; then
    echo -e "${RED}❌ Missing required env var: $1${NC}"
    echo "   Export it: export $1=your-value"
    exit 1
  fi
}

echo -e "${GREEN}🚀 SDR Extension — Supabase Setup${NC}"
echo "======================================"

# ── Check required vars ────────────────────────────────────────────────────
check_var SUPABASE_PROJECT_REF
check_var OPENROUTER_API_KEY
check_var BYOK_ENCRYPTION_SECRET

# ── Check supabase CLI ─────────────────────────────────────────────────────
if ! command -v supabase &>/dev/null; then
  echo -e "${RED}❌ supabase CLI not found.${NC}"
  echo "   macOS:  brew install supabase/tap/supabase"
  echo "   others: npm install -g supabase"
  exit 1
fi

# ── 1. Link project ────────────────────────────────────────────────────────
echo ""
echo "1️⃣  Linking to project ${SUPABASE_PROJECT_REF}..."
supabase link --project-ref "$SUPABASE_PROJECT_REF"

# ── 2. Run migrations ──────────────────────────────────────────────────────
echo ""
echo "2️⃣  Running database migrations (001, 002, 003)..."
supabase db push

# ── 3. Deploy functions ───────────────────────────────────────────────────
echo ""
echo "3️⃣  Deploying Edge Functions..."
supabase functions deploy enrich-cnpj      --no-verify-jwt || true
supabase functions deploy update-byok-keys
supabase functions deploy webhook-payment  --no-verify-jwt || true
supabase functions deploy track-usage

# ── 4. Set secrets ────────────────────────────────────────────────────────
echo ""
echo "4️⃣  Setting secrets..."
supabase secrets set \
  OPENROUTER_API_KEY="$OPENROUTER_API_KEY" \
  BYOK_ENCRYPTION_SECRET="$BYOK_ENCRYPTION_SECRET"

echo -e "   ${GREEN}✅ OPENROUTER_API_KEY set — all lookups will work${NC}"
echo -e "   ${GREEN}✅ BYOK_ENCRYPTION_SECRET set — user keys encrypted${NC}"

# Optional platform contact keys
if [ -n "${PLATFORM_APOLLO_KEY:-}" ]; then
  supabase secrets set PLATFORM_APOLLO_KEY="$PLATFORM_APOLLO_KEY"
  echo -e "   ${GREEN}✅ PLATFORM_APOLLO_KEY set — all users get contacts for free${NC}"
fi
if [ -n "${PLATFORM_LUSHA_KEY:-}" ]; then
  supabase secrets set PLATFORM_LUSHA_KEY="$PLATFORM_LUSHA_KEY"
  echo -e "   ${GREEN}✅ PLATFORM_LUSHA_KEY set${NC}"
fi
if [ -n "${PLATFORM_CLAY_KEY:-}" ]; then
  supabase secrets set PLATFORM_CLAY_KEY="$PLATFORM_CLAY_KEY"
  echo -e "   ${GREEN}✅ PLATFORM_CLAY_KEY set${NC}"
fi

# Optional payment secrets
if [ -n "${LEMON_WEBHOOK_SECRET:-}" ]; then
  supabase secrets set \
    LEMON_WEBHOOK_SECRET="$LEMON_WEBHOOK_SECRET" \
    LEMON_VARIANT_PRO="${LEMON_VARIANT_PRO:-}" \
    LEMON_VARIANT_TEAM="${LEMON_VARIANT_TEAM:-}"
  echo -e "   ${GREEN}✅ Lemon Squeezy webhook secrets set${NC}"
fi

# ── 5. Fetch project keys ─────────────────────────────────────────────────
echo ""
echo "5️⃣  Project keys for extension/.env:"
echo ""
PROJECT_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"

echo "   Get your anon key at:"
echo "   https://app.supabase.com/project/${SUPABASE_PROJECT_REF}/settings/api"
echo ""

# ── Done ──────────────────────────────────────────────────────────────────
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅  Supabase setup complete!${NC}"
echo ""
echo -e "${YELLOW}MANUAL STEP — Auth redirect URLs (CRITICAL for magic link):${NC}"
echo "  → https://app.supabase.com/project/${SUPABASE_PROJECT_REF}/auth/url-configuration"
echo "  Add these redirect URLs:"
echo "    https://sellhelper.gtaitson.space/callback.html"
echo "    http://localhost:3000/callback.html"
echo ""
echo -e "${YELLOW}NEXT — Create extension/.env:${NC}"
cat <<ENV
  VITE_SUPABASE_URL=${PROJECT_URL}
  VITE_SUPABASE_ANON_KEY=<your-anon-key-from-dashboard>
  VITE_CALLBACK_ORIGIN=https://sellhelper.gtaitson.space
ENV
echo ""
echo -e "${YELLOW}NEXT — Build and zip extension:${NC}"
echo "  cd extension && pnpm build"
echo "  cd dist && zip -r ../sdr-extension-beta.zip . && cd .."
echo ""
echo -e "${YELLOW}NEXT — Deploy VPS:${NC}"
echo "  ssh root@<VPS_IP> 'bash -s' < scripts/deploy-vps.sh"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
