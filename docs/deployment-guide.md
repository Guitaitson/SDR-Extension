# Deployment Guide — SDR Extension

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION STACK                        │
├─────────────────────────────────────────────────────────────┤
│  Chrome Extension (MV3)    →  Chrome Web Store              │
│  Landing Page (Next.js)    →  Vercel                        │
│  Edge Functions (Deno)     →  Supabase                      │
│  Database (PostgreSQL)     →  Supabase                      │
│  Auth                      →  Supabase Auth                  │
│  Payments                  →  Lemon Squeezy                  │
│  Error Monitoring          →  Sentry                        │
│  Analytics                 →  PostHog                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Supabase CLI (`brew install supabase/tap/supabase` or `npm i -g supabase`)
- GitHub account (for CI/CD)
- Accounts created for: Supabase, Lemon Squeezy, Sentry, PostHog

---

## 1. Supabase Setup (Backend)

### 1.1 Create a Supabase project

```bash
# Login to Supabase CLI
supabase login

# Initialize (only if not already done)
supabase init
```

Go to [app.supabase.com](https://app.supabase.com), create a new project, and note:
- **Project URL** (e.g., `https://xyzabc.supabase.co`)
- **Anon Key** (public, safe to include in extension)
- **Service Role Key** (secret — never expose client-side)

### 1.2 Run database migrations

```bash
cd supabase

# Link to your remote project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to production
supabase db push
```

### 1.3 Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy lookup
supabase functions deploy update-byok-keys
supabase functions deploy webhooks

# Set environment variables for functions
supabase secrets set OPENROUTER_API_KEY=sk-or-...
supabase secrets set SENTRY_DSN=https://...@sentry.io/...
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=...
```

### 1.4 Configure Auth

In the Supabase dashboard:
1. Go to **Authentication > Providers**
2. Enable **Google** (OAuth)
3. Set redirect URL: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
4. Enable **Email** auth (for non-Google sign-up)

### 1.5 Configure RLS (Row Level Security)

RLS is enabled by default in the migrations. Verify in the dashboard:
- `profiles` table: users can only read/write their own row
- `lookups` table: users can only read their own lookups
- `api_keys` table: users can only read/write their own keys

---

## 2. Extension Build & Distribution

### 2.1 Local development

```bash
cd extension
pnpm install

# Copy and fill in environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_POSTHOG_KEY=phc_your_posthog_key
VITE_SENTRY_DSN=https://...@sentry.io/...
```

```bash
# Start development build with hot reload
pnpm dev

# Load in Chrome:
# 1. Go to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select extension/dist folder
```

### 2.2 Production build

```bash
cd extension
pnpm build
# Output: extension/dist/
```

### 2.3 Package for Chrome Web Store

```bash
# Zip the dist directory
cd extension
zip -r ../sdr-extension-v1.0.0.zip dist/
```

Upload `sdr-extension-v1.0.0.zip` to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/).

### 2.4 Automated release via GitHub Actions

The `.github/workflows/release-extension.yml` workflow triggers on tags:

```bash
# Create and push a version tag to trigger the release workflow
git tag v1.0.0
git push origin v1.0.0
```

The workflow will:
1. Run tests
2. Build the extension
3. Create a GitHub Release with the zip attached
4. (Optional) Upload to Chrome Web Store via API if secrets are configured

**Required GitHub Secrets for automated CWS upload:**
- `CHROME_EXTENSION_ID` — from the CWS developer dashboard
- `CHROME_CLIENT_ID` — from Google Cloud Console OAuth app
- `CHROME_CLIENT_SECRET` — from Google Cloud Console OAuth app
- `CHROME_REFRESH_TOKEN` — generated via OAuth flow

---

## 3. Landing Page Deployment (Vercel)

### 3.1 Connect to Vercel

```bash
cd landing
pnpm install

# Install Vercel CLI
npm i -g vercel

# Deploy (first time — follow prompts)
vercel
```

Or connect via GitHub in the Vercel dashboard for automatic deployments on every push to `main`.

### 3.2 Environment variables in Vercel

In the Vercel dashboard, add:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
```

### 3.3 Custom domain

In Vercel > Settings > Domains, add your domain (e.g., `sdrextension.com.br`) and follow DNS configuration instructions.

### 3.4 Verify SEO setup

After deployment:
1. Submit sitemap at `https://sdrextension.com.br/sitemap.xml` to Google Search Console
2. Verify `robots.txt` is accessible
3. Test Open Graph tags with [opengraph.xyz](https://opengraph.xyz)
4. Test page speed with PageSpeed Insights

---

## 4. Payments — Lemon Squeezy

### 4.1 Create products

In [Lemon Squeezy](https://app.lemonsqueezy.com):
1. Create a **Store**
2. Create 2 Products:
   - **SDR Extension Pro** — R$97/month recurring
   - **SDR Extension Team** — R$247/month recurring
3. For each product, create a **Variant** with the correct pricing
4. Note the **Variant IDs** — you'll need them

### 4.2 Configure webhooks

In Lemon Squeezy > Settings > Webhooks:
- URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/webhooks`
- Events to subscribe:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_expired`
  - `order_created`
- Secret: generate a random string and save it as `LEMON_SQUEEZY_WEBHOOK_SECRET` in Supabase secrets

### 4.3 Test the payment flow

```bash
# Use Lemon Squeezy test mode
# Test card: 4242 4242 4242 4242
# Any future expiry, any CVV
```

Verify that:
- Subscription creation fires webhook → Supabase function updates user tier
- Subscription cancellation fires webhook → Supabase function downgrades user

---

## 5. Monitoring

### 5.1 Sentry

```bash
# Create a Sentry project (JavaScript/Browser + Node)
# Get DSN from Sentry dashboard
# Add SENTRY_DSN to extension .env and Supabase secrets
```

Key alerts to configure:
- Error rate > 1% → PagerDuty/email
- P95 latency > 10s on `lookup` function → email
- New error type detected → Slack

### 5.2 PostHog

```bash
# Create a PostHog project
# Get API key from Project Settings
# Add POSTHOG_KEY to extension .env and landing .env
```

Key events to track (already in codebase):
- `lookup_performed` — with properties: `porte`, `cnae_group`, `used_byok`
- `message_copied` — channel: `whatsapp` | `email`
- `upgrade_clicked` — from: `free_limit` | `settings` | `history`
- `signup_completed`
- `plan_upgraded` — to: `pro` | `team`

### 5.3 Supabase Dashboard

Monitor in [app.supabase.com](https://app.supabase.com):
- Database: connections, query performance
- Edge Functions: invocation count, error rate, duration
- Auth: new signups, active sessions

---

## 6. CI/CD Pipeline

### GitHub Actions Workflows

**`.github/workflows/ci.yml`** — runs on every PR:
1. Lint (ESLint)
2. Type check (tsc)
3. Build extension
4. Build landing page

**`.github/workflows/release-extension.yml`** — runs on version tags:
1. Full CI
2. Build production extension
3. Create GitHub Release + attach zip
4. (Optional) Submit to Chrome Web Store

### Branch Strategy

```
main           ← production-ready, deploys to Vercel automatically
develop        ← integration branch, PRs merge here first
feature/*      ← feature branches (claude/*, feat/*, fix/*)
```

---

## 7. Security Checklist

- [ ] No secrets in `.env` files committed to git (check with `git grep "sk-"`)
- [ ] All Supabase secrets set via `supabase secrets set`, not in code
- [ ] RLS policies tested: user A cannot access user B's data
- [ ] Webhook signature verified before processing (LEMON_SQUEEZY_WEBHOOK_SECRET)
- [ ] CNPJ input validated (14 digits, Mod-11 checksum) before API call
- [ ] Rate limiting on Edge Functions (Supabase built-in + custom per-user check)
- [ ] Extension permissions minimal: `storage`, `identity` only
- [ ] Content Security Policy header set in Next.js landing page
- [ ] HTTPS enforced everywhere (Vercel and Supabase handle this by default)

---

## 8. Rollback Procedures

### Extension rollback
In the Chrome Developer Dashboard:
1. Go to your extension
2. Click "Package" tab
3. Find the previous version
4. Click "Rollback" (available for ~30 days after a release)

### Database migration rollback
```bash
# Supabase migrations are forward-only by default
# For rollback, create a new migration that reverts the change:
supabase migration new rollback_migration_name
# Write the rollback SQL in the new migration file
supabase db push
```

### Edge Function rollback
```bash
# Deploy a previous version by checking out the old commit
git checkout <previous-commit-hash> -- supabase/functions/
supabase functions deploy lookup
```

### Landing page rollback
In Vercel dashboard:
1. Go to Deployments
2. Find the last good deployment
3. Click "..." > "Promote to Production"

---

## 9. Maintenance

### Monthly tasks
- [ ] Check Supabase database size (free tier: 500MB)
- [ ] Review Sentry error trends
- [ ] Review PostHog funnel (free → pro conversion)
- [ ] Update dependencies: `pnpm update --interactive` in each package
- [ ] Review CNPJ API uptime (OpenCNPJ, BrasilAPI, ReceitaWS status pages)

### Quarterly tasks
- [ ] Rotate Supabase service role key
- [ ] Review and update LGPD documentation
- [ ] Security audit of Edge Functions
- [ ] Review Chrome Web Store policy changes (Google announces quarterly)
- [ ] Update Chrome Extension manifest if new APIs are available
