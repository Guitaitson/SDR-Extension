import { createClient } from "@supabase/supabase-js";

// The anon key is a public client-side credential (protected by RLS) — safe to embed as fallback.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://mnihdapdnsttrjrgqblp.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaWhkYXBkbnN0dHJqcmdxYmxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzQ4NDUsImV4cCI6MjA4NzExMDg0NX0.CeGf4kyty-fR-4v_5HgGVARdF53MH1pieqzVES9uuuc";

// Use chrome.storage.local as the Supabase auth storage so the session
// persists across popup open/close cycles (localStorage is not available in MV3).
const chromeStorageAdapter = {
  getItem: (key: string): Promise<string | null> =>
    new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key] ?? null);
      });
    }),
  setItem: (key: string, value: string): Promise<void> =>
    new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    }),
  removeItem: (key: string): Promise<void> =>
    new Promise((resolve) => {
      chrome.storage.local.remove(key, resolve);
    }),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: chromeStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // MV3 service worker — no URL to detect
  },
});
