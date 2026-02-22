/**
 * _shared/contact-enrichment.ts
 *
 * Contact enrichment waterfall: Apollo → Lusha → Clay
 *
 * Each provider is tried in order with the user's BYOK key.
 * Results are normalized to EnrichedContact[] before returning.
 *
 * Domain extraction: prefers email field from CNPJ data, falls back to
 * heuristic based on razao_social (less reliable).
 */

export interface EnrichedContact {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  source: "apollo" | "lusha" | "clay";
}

interface CompanyContext {
  razao_social: string;
  domain?: string;        // extracted from CNPJ email field
  municipio?: string;
}

interface ByokKeys {
  apollo?: string;
  lusha?: string;
  clay?: string;
}

const TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

// ── Domain extraction ─────────────────────────────────────────────────────────

export function extractDomain(email?: string): string | undefined {
  if (!email) return undefined;
  const match = email.match(/@([\w.-]+\.[a-z]{2,})$/i);
  return match ? match[1].toLowerCase() : undefined;
}

// ── Apollo.io ─────────────────────────────────────────────────────────────────

async function tryApollo(
  company: CompanyContext,
  apiKey: string
): Promise<EnrichedContact[]> {
  const body: Record<string, unknown> = {
    page: 1,
    per_page: 5,
    person_seniorities: ["owner", "founder", "c_suite", "vp", "director", "manager"],
  };

  if (company.domain) {
    body.q_organization_domains = [company.domain];
  } else {
    body.q_organization_name = company.razao_social;
  }

  const res = await fetchWithTimeout(
    "https://api.apollo.io/v1/mixed_people/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apollo ${res.status}: ${err.slice(0, 120)}`);
  }

  const json = await res.json() as {
    people?: Array<{
      name?: string;
      title?: string;
      email?: string;
      phone_numbers?: Array<{ sanitized_number?: string }>;
      linkedin_url?: string;
    }>;
  };

  return (json.people ?? [])
    .filter((p) => p.name)
    .slice(0, 5)
    .map((p) => ({
      name:         p.name!,
      title:        p.title ?? "",
      email:        p.email,
      phone:        p.phone_numbers?.[0]?.sanitized_number,
      linkedin_url: p.linkedin_url,
      source:       "apollo" as const,
    }));
}

// ── Lusha ─────────────────────────────────────────────────────────────────────

async function tryLusha(
  company: CompanyContext,
  apiKey: string
): Promise<EnrichedContact[]> {
  const params = new URLSearchParams();
  if (company.domain) {
    params.set("domain", company.domain);
  } else {
    params.set("company_name", company.razao_social);
  }
  params.set("limit", "5");

  const res = await fetchWithTimeout(
    `https://api.lusha.com/contacts?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "api_key": apiKey,
        "Accept":  "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Lusha ${res.status}: ${err.slice(0, 120)}`);
  }

  const json = await res.json() as {
    contacts?: Array<{
      full_name?: string;
      job_title?: string;
      email_addresses?: Array<{ value?: string }>;
      phone_numbers?:   Array<{ value?: string }>;
    }>;
  };

  return (json.contacts ?? [])
    .filter((c) => c.full_name)
    .slice(0, 5)
    .map((c) => ({
      name:   c.full_name!,
      title:  c.job_title ?? "",
      email:  c.email_addresses?.[0]?.value,
      phone:  c.phone_numbers?.[0]?.value,
      source: "lusha" as const,
    }));
}

// ── Clay ──────────────────────────────────────────────────────────────────────
// Clay's enrichment API: https://docs.clay.com/api-reference
// Endpoint: POST /v1/sources/people-search

async function tryClay(
  company: CompanyContext,
  apiKey: string
): Promise<EnrichedContact[]> {
  const payload: Record<string, unknown> = {
    company_name: company.razao_social,
    limit:        5,
    seniorities:  ["c_level", "vp", "director", "manager", "owner"],
  };
  if (company.domain) payload.company_domain = company.domain;

  const res = await fetchWithTimeout(
    "https://api.clay.com/v1/sources/people-search",
    {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "x-clay-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Clay ${res.status}: ${err.slice(0, 120)}`);
  }

  const json = await res.json() as {
    data?: Array<{
      full_name?: string;
      job_title?: string;
      email?: string;
      phone?: string;
      linkedin_url?: string;
    }>;
  };

  return (json.data ?? [])
    .filter((p) => p.full_name)
    .slice(0, 5)
    .map((p) => ({
      name:         p.full_name!,
      title:        p.job_title ?? "",
      email:        p.email,
      phone:        p.phone,
      linkedin_url: p.linkedin_url,
      source:       "clay" as const,
    }));
}

// ── Waterfall ─────────────────────────────────────────────────────────────────

export async function fetchContactsWaterfall(
  company: CompanyContext,
  keys: ByokKeys
): Promise<{ contacts: EnrichedContact[]; provider?: string; error?: string }> {
  const providers: Array<{
    name: "apollo" | "lusha" | "clay";
    key?: string;
    fn: (company: CompanyContext, key: string) => Promise<EnrichedContact[]>;
  }> = [
    { name: "apollo", key: keys.apollo, fn: tryApollo },
    { name: "lusha",  key: keys.lusha,  fn: tryLusha  },
    { name: "clay",   key: keys.clay,   fn: tryClay   },
  ];

  const errors: string[] = [];

  for (const provider of providers) {
    if (!provider.key) continue; // skip if user didn't configure this key

    try {
      console.log(`[contact-enrichment] Trying ${provider.name}...`);
      const contacts = await provider.fn(company, provider.key);
      if (contacts.length > 0) {
        console.log(`[contact-enrichment] ${provider.name}: ${contacts.length} contacts found`);
        return { contacts, provider: provider.name };
      }
      errors.push(`${provider.name}: 0 results`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[contact-enrichment] ${provider.name} failed:`, msg);
      errors.push(`${provider.name}: ${msg}`);
    }
  }

  return {
    contacts: [],
    error: errors.length > 0 ? errors.join("; ") : "No BYOK contact keys configured",
  };
}
