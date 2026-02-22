/**
 * Edge Function: update-byok-keys
 *
 * Saves or removes a user's BYOK API keys (OpenRouter, Apollo, Lusha).
 * Keys are encrypted at rest with pgcrypto using ENCRYPTION_KEY secret.
 *
 * Body (all fields optional):
 *   { openrouter_key?: string, apollo_key?: string, lusha_key?: string }
 *
 * Pass an empty string "" to remove a key.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL        = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ENCRYPTION_KEY       = Deno.env.get("BYOK_ENCRYPTION_SECRET") ?? "change-me-in-production";

type KeyType = "openrouter" | "apollo" | "lusha";

interface ByokPayload {
  openrouter_key?: string;
  apollo_key?:     string;
  lusha_key?:      string;
}

// Maps payload field names to DB key_type values and user_profile flag columns
const KEY_MAP: Array<{
  field: keyof ByokPayload;
  keyType: KeyType;
  profileCol: string;
}> = [
  { field: "openrouter_key", keyType: "openrouter", profileCol: "byok_openrouter_key_set" },
  { field: "apollo_key",     keyType: "apollo",     profileCol: "byok_apollo_key_set"     },
  { field: "lusha_key",      keyType: "lusha",      profileCol: "byok_lusha_key_set"      },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Auth ───────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Parse body ─────────────────────────────────────────────────────────
    const body = await req.json().catch(() => ({})) as ByokPayload;

    if (!Object.keys(body).some((k) => KEY_MAP.some((m) => m.field === k))) {
      return new Response(
        JSON.stringify({ error: "No keys provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Process each key ────────────────────────────────────────────────────
    const profileUpdates: Record<string, boolean> = {};

    for (const { field, keyType, profileCol } of KEY_MAP) {
      const value = body[field];
      if (value === undefined) continue; // Field not in payload — skip

      if (value === "") {
        // Empty string = delete the key
        await supabase
          .from("byok_keys")
          .delete()
          .eq("user_id", user.id)
          .eq("key_type", keyType);
        profileUpdates[profileCol] = false;
      } else {
        // Encrypt and upsert the key using pgcrypto
        const { error: upsertError } = await supabase.rpc("upsert_byok_key", {
          p_user_id:       user.id,
          p_key_type:      keyType,
          p_raw_key:       value,
          p_encrypt_key:   ENCRYPTION_KEY,
        });

        if (upsertError) {
          console.error(`[update-byok-keys] Failed to upsert ${keyType}:`, upsertError.message);
          return new Response(
            JSON.stringify({ error: `Failed to save ${keyType} key` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        profileUpdates[profileCol] = true;
      }
    }

    // ── Update user_profile flags ───────────────────────────────────────────
    if (Object.keys(profileUpdates).length > 0) {
      await supabase
        .from("user_profiles")
        .update(profileUpdates)
        .eq("id", user.id);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[update-byok-keys] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
