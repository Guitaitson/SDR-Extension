/**
 * CNPJ API Waterfall
 *
 * Priority order:
 * 1. OpenCNPJ (open-source, 50 req/s, monthly updates)
 * 2. BrasilAPI (free, backed by multiple sources)
 * 3. ReceitaWS (free, 3 req/min — use as last resort)
 *
 * Each provider is tried in order. On failure (non-2xx or timeout),
 * the next provider is tried. Results are normalized before returning.
 */

const TIMEOUT_MS = 8_000; // Stay well within MV3 service worker limits

interface WaterfallResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  provider?: string;
}

// ─── Provider implementations ────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function tryOpenCnpj(cnpj: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithTimeout(
      `https://api.opencnpj.com.br/api/${cnpj}`
    );
    if (!res.ok) return null;
    return res.json() as Promise<Record<string, unknown>>;
  } catch {
    return null;
  }
}

async function tryBrasilApi(cnpj: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithTimeout(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
    );
    if (!res.ok) return null;
    return res.json() as Promise<Record<string, unknown>>;
  } catch {
    return null;
  }
}

async function tryReceitaWs(cnpj: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetchWithTimeout(
      `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
      {
        headers: {
          // ReceitaWS requires Accept: application/json header
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    // ReceitaWS returns { status: "ERROR" } for invalid CNPJs
    if (data.status === "ERROR") return null;
    return data;
  } catch {
    return null;
  }
}

// ─── Waterfall orchestrator ──────────────────────────────────

export async function fetchCnpjWaterfall(cnpj: string): Promise<WaterfallResult> {
  const providers: Array<{
    name: string;
    fn: (cnpj: string) => Promise<Record<string, unknown> | null>;
  }> = [
    { name: "opencnpj", fn: tryOpenCnpj },
    { name: "brasilapi", fn: tryBrasilApi },
    { name: "receitaws", fn: tryReceitaWs },
  ];

  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const data = await provider.fn(cnpj);
      if (data) {
        console.log(`[cnpj-waterfall] Success via ${provider.name}`);
        return { success: true, data, provider: provider.name };
      }
      errors.push(`${provider.name}: no data`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${provider.name}: ${msg}`);
      console.warn(`[cnpj-waterfall] ${provider.name} failed:`, msg);
    }
  }

  return {
    success: false,
    error: `Todos os provedores de CNPJ falharam: ${errors.join("; ")}`,
  };
}
