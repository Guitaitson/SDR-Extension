import { z } from "zod";

// ─── CNPJ Data ───────────────────────────────────────────────────────────────

export const SocioSchema = z.object({
  nome: z.string(),
  qualificacao: z.string().optional(),
  cpf_cnpj_socio: z.string().optional(),
});

export const CnpjDataSchema = z.object({
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string().optional(),
  situacao_cadastral: z.string(),
  data_situacao_cadastral: z.string().optional(),
  natureza_juridica: z.string().optional(),
  // MEI/EI flag — important for LGPD treatment
  is_mei: z.boolean().optional(),
  is_ei: z.boolean().optional(),
  porte: z.enum(["ME", "EPP", "MEDIA", "GRANDE"]).optional(),
  capital_social: z.number().optional(),
  cnae_fiscal: z.string().optional(),
  cnae_fiscal_descricao: z.string().optional(),
  cnaes_secundarios: z
    .array(
      z.object({
        codigo: z.string(),
        descricao: z.string(),
      })
    )
    .optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().optional(),
  socios: z.array(SocioSchema).optional(),
  data_inicio_atividade: z.string().optional(),
});

export type CnpjData = z.infer<typeof CnpjDataSchema>;
export type Socio = z.infer<typeof SocioSchema>;

// ─── Suggested Contact ────────────────────────────────────────────────────────

export const SuggestedContactSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin_url: z.string().optional(),
  source: z.enum(["apollo", "lusha", "clay", "inferred"]),
});

export type SuggestedContact = z.infer<typeof SuggestedContactSchema>;

// ─── Enrichment Result ───────────────────────────────────────────────────────

export const EnrichmentResultSchema = z.object({
  cnpj_data: CnpjDataSchema,
  suggested_contacts: z.array(SuggestedContactSchema).optional(),
  enrichment_provider: z.string().optional(),
  messages: z.object({
    email: z.string(),
    whatsapp: z.string(),
    linkedin: z.string().optional(),
  }),
  objection_scripts: z
    .array(
      z.object({
        objection: z.string(),
        response: z.string(),
      })
    )
    .optional(),
  ideal_contact_role: z.string().optional(),
  company_summary: z.string(),
  cached: z.boolean().optional(),
  cached_at: z.string().optional(),
});

export type EnrichmentResult = z.infer<typeof EnrichmentResultSchema>;

// ─── User & Auth ─────────────────────────────────────────────────────────────

export const PlanSchema = z.enum(["free", "pro", "team"]);
export type Plan = z.infer<typeof PlanSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  plan: PlanSchema,
  lookups_used_this_month: z.number(),
  lookups_limit: z.number(),
  team_id: z.string().uuid().optional(),
  byok_openrouter_key_set: z.boolean(),
  byok_apollo_key_set: z.boolean(),
  byok_lusha_key_set: z.boolean(),
  byok_clay_key_set: z.boolean(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// ─── Storage (chrome.storage.local) ─────────────────────────────────────────

export interface ExtensionStorage {
  supabase_session?: string; // serialised Supabase session JSON
  user_profile?: UserProfile;
  lookup_history?: LookupHistoryItem[];
  settings?: ExtensionSettings;
}

export interface LookupHistoryItem {
  cnpj: string;
  razao_social: string;
  looked_up_at: string;
  result_summary: string;
}

export interface ExtensionSettings {
  default_message_type: "email" | "whatsapp" | "linkedin";
  language: "pt-BR";
  auto_detect_cnpj: boolean;
}

// ─── Messages (extension internal) ──────────────────────────────────────────

export type ExtensionMessage =
  | {
      type: "LOOKUP_CNPJ";
      cnpj: string;
    }
  | {
      type: "LOOKUP_RESULT";
      result: EnrichmentResult;
    }
  | {
      type: "LOOKUP_ERROR";
      error: string;
    }
  | {
      type: "GET_USER_PROFILE";
    }
  | {
      type: "USER_PROFILE_RESULT";
      profile: UserProfile | null;
    };

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 10,
  pro: 200,
  team: 200, // per seat
};
