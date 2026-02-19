/**
 * Edge Function: track-usage
 *
 * Lightweight event tracking endpoint.
 * Called by the extension for non-lookup events (copy, upgrade click, etc.)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_EVENTS = new Set([
  "message_copy",
  "upgrade_click",
  "cnpj_detected",
  "objection_view",
  "settings_open",
  "history_view",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const {
      data: { user },
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json().catch(() => ({})) as {
      event_type?: string;
      metadata?: Record<string, unknown>;
    };
    const { event_type, metadata = {} } = body;

    if (!event_type || !ALLOWED_EVENTS.has(event_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid event_type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type,
      metadata,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("track-usage error:", err);
    return new Response("Internal Error", { status: 500 });
  }
});
