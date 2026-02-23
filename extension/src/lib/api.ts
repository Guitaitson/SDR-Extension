import { supabase } from "./supabase";
import type { EnrichmentResult, UserProfile } from "@/types";

const EDGE_FN_BASE = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

/** Generic authenticated fetch to a Supabase Edge Function */
async function edgeFetch<T>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${EDGE_FN_BASE}/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody as { error?: string }).error ??
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/** Look up a CNPJ and generate prospecting intelligence */
export async function lookupCnpj(cnpj: string): Promise<EnrichmentResult> {
  return edgeFetch<EnrichmentResult>("enrich-cnpj", { cnpj });
}

/** Get the current user's profile (plan, usage, etc.) */
export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      "id, email, plan, lookups_used_this_month, lookups_limit, team_id, byok_openrouter_key_set, byok_apollo_key_set, byok_lusha_key_set"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[SDR] Failed to fetch user profile:", error.message);
    return null;
  }

  return data as UserProfile;
}

/** Send magic-link sign-in email */
export async function signInWithMagicLink(email: string): Promise<void> {
  const extensionId = chrome.runtime.id;
  // Supabase redirects here after verification; tokens land in the URL hash.
  // Even if the page renders as plain text, the user can copy the full URL
  // from the browser address bar and paste it into the extension.
  const emailRedirectTo =
    "https://mnihdapdnsttrjrgqblp.supabase.co/storage/v1/object/public/static/callback.html" +
    `?extension_id=${extensionId}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo },
  });
  if (error) throw new Error(error.message);
}

/** Sign out */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Update BYOK API keys (stored encrypted server-side) */
export async function updateByokKeys(keys: {
  openrouter_key?: string;
  apollo_key?: string;
  lusha_key?: string;
}): Promise<void> {
  await edgeFetch<void>("update-byok-keys", keys);
}
