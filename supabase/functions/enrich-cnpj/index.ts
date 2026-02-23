/**
 * Edge Function: enrich-cnpj
 *
 * Orchestrates:
 * 1. Input validation
 * 2. Auth & usage limit check
 * 3. Cache lookup (Supabase PostgreSQL)
 * 4. CNPJ data waterfall: OpenCNPJ → BrasilAPI → ReceitaWS
 * 5. AI message generation (OpenRouter / GPT-4o-mini)
 * 6. Contact enrichment waterfall: Apollo → Lusha → Clay
 * 7. Usage tracking
 * 8. Response
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { validateCnpj, stripCnpj } from "../_shared/cnpj.ts";
import { fetchCnpjWaterfall } from "../_shared/cnpj-apis.ts";
import { generateProspectingContent } from "../_shared/llm.ts";
import { fetchContactsWaterfall, extractDomain } from "../_shared/contact-enrichment.ts";

const SUPABASE_URL        = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ENCRYPTION_KEY       = Deno.env.get("BYOK_ENCRYPTION_SECRET") ?? "change-me-in-production";

// Platform-level contact enrichment keys — set these in Supabase secrets to
// give ALL users (including free plan) contact results without BYOK setup.
// Users who configure their own BYOK keys use those instead.
const PLATFORM_APOLLO_KEY = Deno.env.get("PLATFORM_APOLLO_KEY") ?? "";
const PLATFORM_LUSHA_KEY  = Deno.env.get("PLATFORM_LUSHA_KEY")  ?? "";
const PLATFORM_CLAY_KEY   = Deno.env.get("PLATFORM_CLAY_KEY")   ?? "";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── 1. Parse & validate input ────────────────────────────
    const body = await req.json().catch(() => ({}));
    const rawCnpj: string = body?.cnpj ?? "";
    const cnpj = stripCnpj(rawCnpj);

    if (!validateCnpj(cnpj)) {
      return errorResponse(400, "CNPJ_INVALID", "CNPJ inválido.");
    }

    // ── 2. Auth — get user from JWT ──────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse(401, "UNAUTHORIZED", "Token de autenticação ausente.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return errorResponse(401, "UNAUTHORIZED", "Sessão inválida ou expirada.");
    }

    // ── 3. Usage limit check ─────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("plan, lookups_used_this_month, lookups_limit, lookups_reset_at, byok_openrouter_key_set, byok_apollo_key_set, byok_lusha_key_set, byok_clay_key_set")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return errorResponse(500, "PROFILE_ERROR", "Erro ao carregar perfil.");
    }

    // Reset usage if new month
    if (new Date(profile.lookups_reset_at) <= new Date()) {
      await supabase.rpc("reset_monthly_usage");
      profile.lookups_used_this_month = 0;
    }

    if (profile.lookups_used_this_month >= profile.lookups_limit) {
      return errorResponse(
        429,
        "LIMIT_EXCEEDED",
        `Limite mensal de ${profile.lookups_limit} consultas atingido. Faça upgrade para continuar.`
      );
    }

    // ── 4. Cache check ───────────────────────────────────────
    const { data: cached } = await supabase
      .from("cnpj_cache")
      .select("raw_data, cached_at, is_personal")
      .eq("cnpj", cnpj)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    let cnpjData: Record<string, unknown>;
    let fromCache = false;
    let cachedAt: string | null = null;

    if (cached) {
      cnpjData = cached.raw_data as Record<string, unknown>;
      fromCache = true;
      cachedAt = cached.cached_at;
    } else {
      // ── 5. CNPJ API waterfall ────────────────────────────
      const fetchResult = await fetchCnpjWaterfall(cnpj);
      if (!fetchResult.success) {
        return errorResponse(
          502,
          "CNPJ_FETCH_ERROR",
          fetchResult.error ?? "Erro ao consultar dados do CNPJ."
        );
      }
      cnpjData = fetchResult.data!;

      // Determine if MEI/EI (personal data under LGPD)
      const natureza = (cnpjData.natureza_juridica as string) ?? "";
      const isPersonal =
        natureza.toLowerCase().includes("microempreendedor individual") ||
        natureza.toLowerCase().includes("empresário individual");

      // Cache for 30 days (MEI/EI also cached but flagged)
      await supabase.from("cnpj_cache").upsert({
        cnpj,
        raw_data: cnpjData,
        is_personal: isPersonal,
        cached_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    // ── 6. Get BYOK keys via pgcrypto RPC ────────────────────
    async function getByokKey(keyType: string): Promise<string | null> {
      const { data, error } = await supabase.rpc("get_byok_key", {
        p_user_id:     user!.id,
        p_key_type:    keyType,
        p_encrypt_key: ENCRYPTION_KEY,
      });
      if (error) {
        console.warn(`[enrich-cnpj] Failed to decrypt ${keyType} key:`, error.message);
        return null;
      }
      return data as string | null;
    }

    const byokOpenrouterKey = profile.byok_openrouter_key_set
      ? await getByokKey("openrouter")
      : null;

    // ── 7. Generate AI prospecting content ───────────────────
    const prospecting = await generateProspectingContent(cnpjData, byokOpenrouterKey);

    // ── 8. Contact enrichment waterfall (Apollo → Lusha → Clay) ─
    const needsContacts =
      profile.byok_apollo_key_set || profile.byok_lusha_key_set || profile.byok_clay_key_set ||
      !!PLATFORM_APOLLO_KEY || !!PLATFORM_LUSHA_KEY || !!PLATFORM_CLAY_KEY;

    let suggestedContacts: unknown[] = [];
    let enrichmentProvider: string | undefined;

    if (needsContacts) {
      const [apolloKey, lushaKey, clayKey] = await Promise.all([
        profile.byok_apollo_key_set ? getByokKey("apollo") : Promise.resolve(null),
        profile.byok_lusha_key_set  ? getByokKey("lusha")  : Promise.resolve(null),
        profile.byok_clay_key_set   ? getByokKey("clay")   : Promise.resolve(null),
      ]);

      const normalized = normalizeCnpjData(cnpjData);
      const domain = extractDomain(cnpjData.email as string | undefined);

      const enrichResult = await fetchContactsWaterfall(
        {
          razao_social: (normalized.razao_social as string) ?? "",
          domain,
          municipio:    normalized.municipio as string | undefined,
        },
        {
          // BYOK key (user's own) takes priority; platform key is the fallback
          apollo: apolloKey ?? (PLATFORM_APOLLO_KEY || undefined),
          lusha:  lushaKey  ?? (PLATFORM_LUSHA_KEY  || undefined),
          clay:   clayKey   ?? (PLATFORM_CLAY_KEY   || undefined),
        }
      );

      suggestedContacts  = enrichResult.contacts;
      enrichmentProvider = enrichResult.provider;
    }

    // ── 9. Track usage ───────────────────────────────────────
    const [usageUpdate] = await Promise.all([
      supabase
        .from("user_profiles")
        .update({
          lookups_used_this_month: profile.lookups_used_this_month + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id),

      supabase.from("lookup_history").insert({
        user_id: user.id,
        cnpj,
        razao_social: cnpjData.razao_social ?? null,
        result_summary: prospecting.company_summary.slice(0, 200),
      }),

      supabase.from("usage_events").insert({
        user_id: user.id,
        event_type: "lookup",
        metadata: {
          cnpj,
          plan: profile.plan,
          from_cache: fromCache,
          byok: !!byokOpenrouterKey,
        },
      }),
    ]);

    if (usageUpdate.error) {
      console.error("Failed to update usage:", usageUpdate.error.message);
    }

    // ── 10. Build response ───────────────────────────────────
    const response = {
      cnpj_data:           normalizeCnpjData(cnpjData),
      suggested_contacts:  suggestedContacts,
      enrichment_provider: enrichmentProvider,
      messages:            prospecting.messages,
      company_summary:     prospecting.company_summary,
      ideal_contact_role:  prospecting.ideal_contact_role,
      objection_scripts:   profile.plan !== "free" ? prospecting.objection_scripts : null,
      cached:              fromCache,
      cached_at:           cachedAt,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled error in enrich-cnpj:", err);
    return errorResponse(500, "INTERNAL_ERROR", "Erro interno. Tente novamente.");
  }
});

function errorResponse(
  status: number,
  code: string,
  error: string
): Response {
  return new Response(JSON.stringify({ code, error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeCnpjData(raw: Record<string, unknown>) {
  const natureza = (raw.natureza_juridica as string) ?? "";
  return {
    cnpj: raw.cnpj ?? raw.ni,
    razao_social: raw.razao_social ?? raw.nome,
    nome_fantasia: raw.nome_fantasia,
    situacao_cadastral: raw.situacao_cadastral ?? raw.situacao,
    natureza_juridica: natureza,
    is_mei:
      natureza.toLowerCase().includes("microempreendedor individual"),
    is_ei:
      natureza.toLowerCase().includes("empresário individual"),
    porte: raw.porte,
    capital_social:
      typeof raw.capital_social === "number"
        ? raw.capital_social
        : parseFloat(String(raw.capital_social ?? "0")),
    cnae_fiscal: raw.cnae_fiscal ?? (raw.cnae as Record<string, unknown>)?.codigo,
    cnae_fiscal_descricao:
      raw.cnae_fiscal_descricao ?? (raw.cnae as Record<string, unknown>)?.descricao,
    logradouro: raw.logradouro,
    numero: raw.numero,
    complemento: raw.complemento,
    bairro: raw.bairro,
    municipio: raw.municipio,
    uf: raw.uf,
    cep: raw.cep,
    telefone: raw.ddd_telefone_1
      ? `(${raw.ddd_telefone_1}) ${raw.telefone_1}`
      : raw.telefone,
    socios: raw.qsa ?? raw.socios ?? [],
    data_inicio_atividade: raw.data_inicio_atividade,
    data_situacao_cadastral: raw.data_situacao_cadastral,
  };
}
