# ADR 001 — CNPJ API Waterfall Strategy

**Date:** 2026-02
**Status:** Accepted

## Context

We need reliable access to Brazilian company data (CNPJ). Several free public APIs exist but each has limitations:

| API | Limit | Reliability | Update Frequency |
|-----|-------|-------------|-----------------|
| OpenCNPJ | 50 req/s | High | Monthly |
| BrasilAPI | Informal | Medium | Depends on ReceitaWS |
| ReceitaWS | 3 req/min (free) | Medium | Variable |

## Decision

Implement a waterfall pattern: try APIs in priority order, fall back on failure.

Priority: **OpenCNPJ → BrasilAPI → ReceitaWS**

Cache results in PostgreSQL for 30 days to minimize external API calls.

## Consequences

**Positive:**
- Zero cost for CNPJ data
- High availability through redundancy
- Cache reduces load on external APIs

**Negative:**
- Data freshness: cached data may be up to 30 days old
- Complexity of normalizing 3 different response schemas
- ReceitaWS rate limit (3/min) means we cannot use it as primary at scale

## Alternatives Considered

1. **CNPJ.ws paid tier** (R$200+/month) — rejected as it would require passing cost to users or eating margin
2. **Single API provider** — rejected due to reliability risk
3. **Minha Receita self-hosted** — viable future option if we need full control; monthly Receita Federal dump
