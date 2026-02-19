# Architecture — SDR Extension

## Overview

SDR Extension is a Chrome Extension (Manifest V3) backed by a Supabase serverless backend. The architecture is deliberately simple to minimize maintenance overhead and cost for a solo micro-SaaS.

```
┌─────────────────────────────────────────────────────────┐
│                  CHROME EXTENSION (MV3)                  │
│                                                          │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │  Popup    │  │ Content Script│  │ Service Worker   │ │
│  │  (React)  │  │ (CNPJ detect) │  │ (lifecycle mgmt) │ │
│  └────┬─────┘  └───────────────┘  └────────┬─────────┘ │
│       │                                      │           │
└───────┼──────────────────────────────────────┼───────────┘
        │ HTTPS / JWT                          │ chrome.alarms
        ▼                                      ▼
┌─────────────────────────────────────────────────────────┐
│               SUPABASE (Backend)                         │
│                                                          │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────────┐│
│  │ Auth        │ │ Edge Funcs   │ │ PostgreSQL (RLS)  ││
│  │ (magic link)│ │ - enrich-cnpj│ │ - user_profiles   ││
│  │             │ │ - webhook-pay│ │ - cnpj_cache      ││
│  │             │ │ - track-usage│ │ - lookup_history  ││
│  │             │ │              │ │ - byok_keys       ││
│  └─────────────┘ └──────┬───────┘ └───────────────────┘│
│                          │                               │
└──────────────────────────┼───────────────────────────────┘
                           │
          ┌────────────────┼──────────────┐
          ▼                ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ CNPJ APIs  │ │ OpenRouter │ │ Apollo /   │
   │ (waterfall)│ │ (LLM)      │ │ Lusha API  │
   │ Free       │ │ GPT-4o mini│ │ (BYOK only)│
   └────────────┘ └────────────┘ └────────────┘
```

## Key Design Decisions

### 1. All API calls go through Edge Functions (not from extension directly)

**Why:** The extension popup cannot safely store LLM/enrichment API keys. Edge Functions act as a secure proxy, authenticate the user, check usage limits, and apply caching — all server-side.

**Trade-off:** +50-100ms latency vs. direct browser call. Acceptable for a 15-second target.

### 2. CNPJ waterfall: OpenCNPJ → BrasilAPI → ReceitaWS

**Why:** No single free CNPJ API is reliable enough for production. The waterfall provides redundancy at zero cost.

**Cache:** Results cached in PostgreSQL for 30 days. A cache hit costs R$0 and returns in ~100ms.

### 3. Supabase as the only infrastructure dependency

**Why:** Supabase provides auth, database, Edge Functions, and RLS in one platform with a generous free tier. Eliminates the need for a separate auth service, API gateway, or cache layer.

**Risk:** Platform dependency. Mitigated by standard PostgreSQL — migration to self-hosted possible.

### 4. Magic Link auth (no password)

**Why:** SDRs are not technical; password reset flows add friction. Magic link is 1 step from email to session.

**Implementation:** Supabase auth with chrome.storage.local adapter (localStorage is not available in MV3 service workers).

### 5. BYOK as an optional upgrade, not the default

**Why:** Requiring users to get an OpenAI API key kills activation. The default model (GPT-4o-mini via operator key) costs ~R$0.005/lookup — trivial to subsidize.

**BYOK scope:** OpenRouter key (any LLM), Apollo.io key (contacts), Lusha key (phones). Keys stored encrypted server-side, never in the extension.

## Data Flow: CNPJ Lookup

```
1. User pastes CNPJ in popup
2. isValidCnpj() — client-side validation (no API call wasted)
3. POST /functions/v1/enrich-cnpj {cnpj}
   Authorization: Bearer <supabase_session_token>
4. Edge Function:
   a. Verify JWT → get user
   b. Check usage limit (user_profiles.lookups_used < lookups_limit)
   c. Check cnpj_cache (PostgreSQL) — return if fresh
   d. CNPJ waterfall: OpenCNPJ → BrasilAPI → ReceitaWS
   e. generateProspectingContent(cnpjData, byokKey?) → OpenRouter
   f. Store in cnpj_cache
   g. Increment lookups_used_this_month
   h. Insert lookup_history row
5. Return {cnpj_data, messages, company_summary, ideal_contact_role, ...}
6. Popup renders ResultCard with tabs
```

## MV3 Service Worker Constraints

Chrome's Manifest V3 imposes:
- Service workers terminate after **30s of inactivity**
- Maximum **5 minutes** of continuous processing
- No `XMLHttpRequest` (use `fetch`)
- No DOM access

Our mitigations:
- All async work happens in Edge Functions (not the service worker)
- Service worker only handles `chrome.alarms` and `chrome.runtime.onMessage`
- Auth token refresh is handled by `supabase.auth.autoRefreshToken` with `chrome.alarms`

## Security Model

| Layer | Protection |
|-------|-----------|
| Extension → Supabase | HTTPS + JWT (Supabase auth) |
| API keys (BYOK) | Encrypted at rest, never sent to extension |
| User data in DB | Row Level Security (user can only see own rows) |
| CNPJ cache | Shared (no PII), service_role write only |
| Chrome Extension | CSP blocks eval and inline scripts |
| Payment webhook | HMAC-SHA256 signature verification |

## Cost Model

At steady state (100 active users, 500 lookups/month total):

| Item | Monthly Cost |
|------|-------------|
| Supabase Free tier | R$ 0 |
| OpenRouter (GPT-4o-mini, 500 calls) | ~R$ 2.35 |
| Vercel (landing, free tier) | R$ 0 |
| Lemon Squeezy (5% fee on R$485 MRR) | ~R$ 24 |
| **Total** | **~R$ 26** |

Break-even: 1 Pro customer (R$97/month).
