#!/usr/bin/env bash
# =============================================================================
# SDR Extension — Interactive Setup Script
# Configures .env.local for both extension and landing in one run.
# =============================================================================

set -e

BOLD=$(tput bold 2>/dev/null || echo "")
RESET=$(tput sgr0 2>/dev/null || echo "")
GREEN=$(tput setaf 2 2>/dev/null || echo "")
YELLOW=$(tput setaf 3 2>/dev/null || echo "")
CYAN=$(tput setaf 6 2>/dev/null || echo "")
RED=$(tput setaf 1 2>/dev/null || echo "")

banner() {
  echo ""
  echo "${CYAN}${BOLD}╔═══════════════════════════════════════════╗${RESET}"
  echo "${CYAN}${BOLD}║     SDR Extension — Setup Inicial          ║${RESET}"
  echo "${CYAN}${BOLD}╚═══════════════════════════════════════════╝${RESET}"
  echo ""
}

step() {
  echo ""
  echo "${BOLD}${YELLOW}▸ $1${RESET}"
}

ok() {
  echo "${GREEN}  ✓ $1${RESET}"
}

warn() {
  echo "${YELLOW}  ⚠ $1${RESET}"
}

ask() {
  local label="$1"
  local default="$2"
  local secret="$3"
  local value

  if [[ "$secret" == "true" ]]; then
    read -rsp "  ${label} [${default:+********}]: " value
    echo ""
  else
    read -rp "  ${label}${default:+ [${default}]}: " value
  fi

  echo "${value:-$default}"
}

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

banner

# ─── Check prerequisites ────────────────────────────────────────────────────

step "Verificando pré-requisitos..."

if ! command -v node &>/dev/null; then
  echo "${RED}  ✗ Node.js não encontrado. Instale em https://nodejs.org${RESET}"
  exit 1
fi
ok "Node $(node --version)"

if ! command -v pnpm &>/dev/null; then
  warn "pnpm não encontrado. Instalando via npm..."
  npm install -g pnpm
fi
ok "pnpm $(pnpm --version)"

# ─── Supabase ────────────────────────────────────────────────────────────────

step "Supabase — obtenha em https://app.supabase.com/project/_/settings/api"
echo "  ${CYAN}(Crie um projeto gratuito se ainda não tiver)${RESET}"

SUPABASE_URL=$(ask "Project URL (ex: https://abc123.supabase.co)" "")
SUPABASE_ANON_KEY=$(ask "Anon/Public Key" "" "true")
SUPABASE_SERVICE_KEY=$(ask "Service Role Key (mantenha secreta!)" "" "true")

if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "${RED}  ✗ URL e Anon Key são obrigatórios.${RESET}"
  exit 1
fi

# ─── OpenRouter ─────────────────────────────────────────────────────────────

step "OpenRouter — LLM para gerar mensagens de prospecção"
echo "  ${CYAN}Crie sua chave em https://openrouter.ai/keys${RESET}"
echo "  ${CYAN}O plano gratuito do OpenRouter é suficiente para desenvolvimento.${RESET}"

OPENROUTER_KEY=$(ask "API Key (sk-or-v1-...)" "" "true")

# ─── Lemon Squeezy (opcional) ────────────────────────────────────────────────

step "Lemon Squeezy — pagamentos (opcional para dev local)"
echo "  ${CYAN}Pule se quiser configurar depois. Crie em https://lemonsqueezy.com${RESET}"

LEMON_WEBHOOK_SECRET=$(ask "Webhook Secret [Enter para pular]" "")
LEMON_VARIANT_PRO=$(ask "Variant ID — Plano Pro [Enter para pular]" "")
LEMON_VARIANT_TEAM=$(ask "Variant ID — Plano Team [Enter para pular]" "")

# ─── PostHog (opcional) ──────────────────────────────────────────────────────

step "PostHog — analytics (opcional)"
echo "  ${CYAN}Crie em https://posthog.com (free tier: 1M eventos/mês)${RESET}"

POSTHOG_KEY=$(ask "Project API Key [Enter para pular]" "")

# ─── Write extension/.env.local ──────────────────────────────────────────────

step "Criando extension/.env.local..."

cat > "${root_dir}/extension/.env.local" << EOF
# Supabase — gerado por scripts/setup.sh
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
EOF

if [[ -n "$POSTHOG_KEY" ]]; then
  echo "VITE_POSTHOG_KEY=${POSTHOG_KEY}" >> "${root_dir}/extension/.env.local"
  echo "VITE_POSTHOG_HOST=https://app.posthog.com" >> "${root_dir}/extension/.env.local"
fi

ok "extension/.env.local criado"

# ─── Write supabase/functions/.env ───────────────────────────────────────────

step "Criando supabase/functions/.env..."

cat > "${root_dir}/supabase/functions/.env" << EOF
# Supabase — gerado por scripts/setup.sh
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}

# OpenRouter
OPENROUTER_API_KEY=${OPENROUTER_KEY}
EOF

if [[ -n "$LEMON_WEBHOOK_SECRET" ]]; then
  echo "LEMON_WEBHOOK_SECRET=${LEMON_WEBHOOK_SECRET}" >> "${root_dir}/supabase/functions/.env"
fi
if [[ -n "$LEMON_VARIANT_PRO" ]]; then
  echo "LEMON_VARIANT_PRO=${LEMON_VARIANT_PRO}" >> "${root_dir}/supabase/functions/.env"
fi
if [[ -n "$LEMON_VARIANT_TEAM" ]]; then
  echo "LEMON_VARIANT_TEAM=${LEMON_VARIANT_TEAM}" >> "${root_dir}/supabase/functions/.env"
fi

ok "supabase/functions/.env criado"

# ─── Write landing/.env.local ────────────────────────────────────────────────

step "Criando landing/.env.local..."

cat > "${root_dir}/landing/.env.local" << EOF
# Gerado por scripts/setup.sh
NEXT_PUBLIC_LEMON_URL_PRO=https://sdrextension.lemonsqueezy.com/checkout/buy/${LEMON_VARIANT_PRO:-CONFIGURE_ME}
NEXT_PUBLIC_LEMON_URL_TEAM=https://sdrextension.lemonsqueezy.com/checkout/buy/${LEMON_VARIANT_TEAM:-CONFIGURE_ME}
EOF

if [[ -n "$POSTHOG_KEY" ]]; then
  echo "NEXT_PUBLIC_POSTHOG_KEY=${POSTHOG_KEY}" >> "${root_dir}/landing/.env.local"
  echo "NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com" >> "${root_dir}/landing/.env.local"
fi

ok "landing/.env.local criado"

# ─── Install dependencies ────────────────────────────────────────────────────

step "Instalando dependências..."
(cd "${root_dir}/extension" && pnpm install --frozen-lockfile 2>/dev/null) && ok "extension/ — OK"
(cd "${root_dir}/landing"   && pnpm install --frozen-lockfile 2>/dev/null) && ok "landing/ — OK"

# ─── Database migrations ─────────────────────────────────────────────────────

step "Banco de dados — aplicar schema no Supabase"
echo ""
echo "  Execute o conteúdo de ${BOLD}supabase/migrations/001_initial_schema.sql${RESET}"
echo "  diretamente no SQL Editor do seu projeto Supabase:"
echo "  ${CYAN}https://app.supabase.com/project/_/sql/new${RESET}"
echo ""
echo "  ${YELLOW}(Supabase CLI local também funciona: supabase db push)${RESET}"

# ─── Done ───────────────────────────────────────────────────────────────────

echo ""
echo "${GREEN}${BOLD}══════════════════════════════════════${RESET}"
echo "${GREEN}${BOLD}  Setup concluído!${RESET}"
echo "${GREEN}${BOLD}══════════════════════════════════════${RESET}"
echo ""
echo "  Próximos passos:"
echo ""
echo "  1. Aplicar migrations no Supabase (link acima)"
echo "  2. ${BOLD}cd extension && pnpm dev${RESET}"
echo "     Carregue a pasta ${BOLD}extension/dist${RESET} no Chrome (chrome://extensions → modo desenvolvedor)"
echo "  3. ${BOLD}cd landing && pnpm dev${RESET}  →  http://localhost:3000"
echo "  4. Para deploy das Edge Functions:"
echo "     ${BOLD}supabase functions deploy --project-ref SEU_PROJECT_REF${RESET}"
echo ""
