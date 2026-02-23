#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# SDR Extension — VPS Deploy Script
# =============================================================================
# Run this ON your VPS (Ubuntu 22.04 / Debian 12) to deploy the landing page.
#
# Usage (from your local machine):
#   ssh root@<VPS_IP> "bash -s" < scripts/deploy-vps.sh
#
# OR on the VPS directly:
#   git clone https://github.com/Guitaitson/SDR-Extension.git
#   cd SDR-Extension
#   bash scripts/deploy-vps.sh
#
# What this does:
#   1. Installs nginx, certbot, Node.js 20, pnpm (if missing)
#   2. Builds the Next.js landing (static export → out/)
#   3. Deploys files to /var/www/sellhelper.gtaitson.space/out/
#   4. Configures nginx (HTTP first, then HTTPS via certbot)
#   5. Obtains SSL certificate from Let's Encrypt
#   6. Installs full HTTPS nginx config and reloads
#
# Prerequisites:
#   - DNS A record pointing sellhelper.gtaitson.space → this VPS IP
#   - Ports 80 and 443 open in firewall
#   - Root or sudo access
# =============================================================================

DOMAIN="sellhelper.gtaitson.space"
ADMIN_EMAIL="admin@gtaitson.space"        # change if different
WEB_ROOT="/var/www/${DOMAIN}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${GREEN}🚀 SDR Extension — VPS Deploy${NC}"
echo "Domain:  ${DOMAIN}"
echo "WebRoot: ${WEB_ROOT}"
echo "Repo:    ${REPO_DIR}"
echo ""

# ── Must run as root or with sudo ────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Run as root: sudo bash scripts/deploy-vps.sh${NC}"
  exit 1
fi

# ── 1. Install system dependencies ───────────────────────────────────────────
echo "1️⃣  Installing system dependencies..."

apt-get update -q

if ! command -v nginx &>/dev/null; then
  echo "   Installing nginx..."
  apt-get install -y nginx
fi

if ! command -v certbot &>/dev/null; then
  echo "   Installing certbot..."
  apt-get install -y certbot python3-certbot-nginx
fi

if ! command -v node &>/dev/null || [[ "$(node -v)" < "v20" ]]; then
  echo "   Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pnpm &>/dev/null; then
  echo "   Installing pnpm..."
  npm install -g pnpm
fi

echo -e "   ${GREEN}✅ Dependencies ready${NC}"

# ── 2. Build landing (static export) ─────────────────────────────────────────
echo ""
echo "2️⃣  Building landing page..."
cd "${REPO_DIR}/landing"

# Landing needs env vars for Lemon Squeezy links (uses NEXT_PUBLIC_* at build time)
# If you have a .env.production, it will be picked up automatically.
pnpm install --frozen-lockfile
pnpm build   # outputs to landing/out/ because next.config.js has output: 'export'

echo -e "   ${GREEN}✅ Build complete (landing/out/)${NC}"

# ── 3. Deploy static files ────────────────────────────────────────────────────
echo ""
echo "3️⃣  Deploying to ${WEB_ROOT}/out/..."
mkdir -p "${WEB_ROOT}/out"
rsync -av --delete "${REPO_DIR}/landing/out/" "${WEB_ROOT}/out/"
echo -e "   ${GREEN}✅ Files deployed${NC}"

# ── 4. nginx — HTTP only (needed for certbot ACME challenge) ─────────────────
echo ""
echo "4️⃣  Configuring nginx (HTTP for certbot challenge)..."
mkdir -p /var/www/certbot

NGINX_AVAIL="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

# Write minimal HTTP config for certbot
cat > "${NGINX_AVAIL}" <<HTTPCONF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root ${WEB_ROOT}/out;
        try_files \$uri \$uri/ \$uri.html /index.html;
    }
}
HTTPCONF

# Enable site
[ -L "${NGINX_ENABLED}" ] || ln -s "${NGINX_AVAIL}" "${NGINX_ENABLED}"

# Disable default site if present
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl reload nginx 2>/dev/null || service nginx reload

echo -e "   ${GREEN}✅ nginx HTTP running${NC}"

# ── 5. SSL via Let's Encrypt ──────────────────────────────────────────────────
echo ""
echo "5️⃣  Obtaining SSL certificate..."

if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
  echo "   Certificate already exists — renewing if needed..."
  certbot renew --quiet
else
  certbot --nginx \
    -d "${DOMAIN}" \
    --non-interactive \
    --agree-tos \
    -m "${ADMIN_EMAIL}"
fi

echo -e "   ${GREEN}✅ SSL certificate ready${NC}"

# ── 6. Install full HTTPS nginx config ───────────────────────────────────────
echo ""
echo "6️⃣  Installing full HTTPS nginx config..."
cp "${REPO_DIR}/nginx-sellhelper.conf" "${NGINX_AVAIL}"
nginx -t
systemctl reload nginx 2>/dev/null || service nginx reload
echo -e "   ${GREEN}✅ nginx HTTPS running${NC}"

# ── 7. Set up auto-renewal cron ──────────────────────────────────────────────
echo ""
echo "7️⃣  Configuring certbot auto-renewal..."
if ! crontab -l 2>/dev/null | grep -q certbot; then
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
fi
echo -e "   ${GREEN}✅ Auto-renewal configured (daily at 3am)${NC}"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅  VPS deploy complete!${NC}"
echo ""
echo "   Landing:  https://${DOMAIN}"
echo "   Callback: https://${DOMAIN}/callback.html"
echo ""
echo "Verify:"
echo "   curl -I https://${DOMAIN}/callback.html"
echo ""
echo -e "${YELLOW}To redeploy after code changes:${NC}"
echo "   cd ${REPO_DIR} && git pull && bash scripts/deploy-vps.sh"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
