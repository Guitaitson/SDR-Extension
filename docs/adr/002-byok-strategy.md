# ADR 002 — BYOK vs. Operator-Managed API Keys

**Date:** 2026-02
**Status:** Accepted

## Context

The extension requires an LLM API key to generate prospecting messages. Two models:

1. **Pure BYOK:** User brings their own OpenAI/OpenRouter key. Zero LLM cost for operator.
2. **Operator-managed:** Operator pays for LLM calls, passes cost to users via subscription.
3. **Hybrid:** Operator subsidizes basic usage; BYOK available as power-user option.

## Decision

**Hybrid model (option 3).**

- Default: operator-managed GPT-4o-mini via OpenRouter (~R$0.005/call)
- BYOK available in Pro/Team plans for users who want to use their own model or OpenRouter key
- Apollo.io and Lusha keys are always BYOK (operator cannot subsidize at scale)

## Consequences

**Positive:**
- Eliminates the #2 fatal risk: "BYOK friction kills activation"
- SDRs can use the extension without any technical setup
- Operator LLM cost is R$5-25/month at current user volumes — trivial

**Negative:**
- Operator carries LLM cost; must be priced into subscription
- If OpenRouter pricing changes significantly, margins could compress

## BYOK Implementation

User BYOK keys are:
1. Submitted via extension settings UI
2. Sent encrypted to the `update-byok-keys` Edge Function
3. Stored encrypted in `byok_keys` PostgreSQL table (service_role only)
4. Retrieved by Edge Functions at call time, never sent to the extension

The `byok_openrouter_key_set` boolean flag in `user_profiles` is visible to the extension — the actual key is not.
