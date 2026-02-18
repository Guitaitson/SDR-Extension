/**
 * Edge Function: webhook-payment
 *
 * Handles Lemon Squeezy webhooks to keep user plans in sync.
 *
 * Events handled:
 * - subscription_created → set plan to pro/team
 * - subscription_updated → update plan or status
 * - subscription_cancelled → downgrade to free at period end
 * - subscription_expired → downgrade to free immediately
 * - order_created → one-time purchase handling (future)
 *
 * Security: validates HMAC-SHA256 signature from Lemon Squeezy.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LEMON_WEBHOOK_SECRET = Deno.env.get("LEMON_WEBHOOK_SECRET")!;

// Plan variant IDs from Lemon Squeezy (set these in env vars)
const VARIANT_PRO = Deno.env.get("LEMON_VARIANT_PRO") ?? "";
const VARIANT_TEAM = Deno.env.get("LEMON_VARIANT_TEAM") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await req.text();

  // ── Verify HMAC signature ────────────────────────────────
  const signature = req.headers.get("x-signature");
  if (!signature || !(await verifySignature(body, signature))) {
    console.error("Invalid Lemon Squeezy signature");
    return new Response("Forbidden", { status: 403 });
  }

  let payload: LemonWebhookPayload;
  try {
    payload = JSON.parse(body) as LemonWebhookPayload;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const eventName = payload.meta?.event_name;
  const attrs = payload.data?.attributes;
  const userEmail = attrs?.user_email ?? attrs?.order_email;

  if (!userEmail || !eventName) {
    return new Response("OK", { status: 200 }); // Ignore irrelevant events
  }

  console.log(`[webhook-payment] Event: ${eventName} for ${userEmail}`);

  const variantId = String(attrs?.variant_id ?? "");
  const plan =
    variantId === VARIANT_TEAM
      ? "team"
      : variantId === VARIANT_PRO
        ? "pro"
        : null;

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      if (!plan) break;
      const limit = plan === "pro" ? 200 : 200; // team: 200 per seat
      await supabase
        .from("user_profiles")
        .update({
          plan,
          lookups_limit: limit,
          lemon_subscription_id: String(payload.data?.id ?? ""),
          lemon_subscription_status: attrs?.status ?? "active",
          updated_at: new Date().toISOString(),
        })
        .eq("email", userEmail);
      break;
    }

    case "subscription_cancelled": {
      // Keep plan active until period end; mark as cancelled
      await supabase
        .from("user_profiles")
        .update({
          lemon_subscription_status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("email", userEmail);
      break;
    }

    case "subscription_expired": {
      // Downgrade to free immediately
      await supabase
        .from("user_profiles")
        .update({
          plan: "free",
          lookups_limit: 10,
          lemon_subscription_status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("email", userEmail);
      break;
    }

    default:
      console.log(`[webhook-payment] Unhandled event: ${eventName}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

async function verifySignature(
  body: string,
  signature: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(LEMON_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedHex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expectedHex === signature;
}

// ─── Types ───────────────────────────────────────────────────

interface LemonWebhookPayload {
  meta?: {
    event_name?: string;
  };
  data?: {
    id?: string | number;
    attributes?: {
      user_email?: string;
      order_email?: string;
      status?: string;
      variant_id?: string | number;
    };
  };
}
