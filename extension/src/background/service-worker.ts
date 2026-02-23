/**
 * MV3 Service Worker — runs in background, orchestrates extension lifecycle.
 *
 * Important constraints:
 * - Service workers terminate after 30s of inactivity or 5min of processing.
 * - Use chrome.alarms to keep logic alive for periodic tasks.
 * - All async API calls must complete within the service worker lifecycle.
 */
import { supabase } from "@/lib/supabase";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open onboarding page on first install
    chrome.tabs.create({
      url: "https://sdrextension.com.br/bem-vindo",
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(
  (
    message: { type: string; [key: string]: unknown },
    _sender,
    sendResponse
  ) => {
    if (message.type === "PING") {
      sendResponse({ pong: true });
    }
    // Keep the service worker alive for async responses
    return true;
  }
);

// Handle external messages from callback page (auth tokens)
chrome.runtime.onMessageExternal.addListener(
  (
    message: { type: string; access_token?: string; refresh_token?: string; error?: string },
    sender,
    sendResponse
  ) => {
    console.log("[Service Worker] External message received from:", sender.url);
    
    if (message.type === "AUTH_TOKEN" && message.access_token && message.refresh_token) {
      // Use supabase.auth.setSession so the SDK writes to the correct key
      // (sb-{ref}-auth-token) and fetches the user object. Direct
      // chrome.storage.local writes used a wrong key and the popup never
      // found the session.
      supabase.auth
        .setSession({
          access_token: message.access_token,
          refresh_token: message.refresh_token,
        })
        .then(({ error }) => {
          if (error) {
            console.error("[Service Worker] setSession error:", error.message);
            sendResponse({ success: false, error: error.message });
          } else {
            console.log("[Service Worker] Session stored via SDK");
            sendResponse({ success: true });
            chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED" }).catch(() => {});
          }
        });

      return true; // Keep channel open for async response
    }
    
    if (message.type === "AUTH_ERROR") {
      console.error("[Service Worker] Auth error:", message.error);
      sendResponse({ received: true });
      return true;
    }
    
    sendResponse({ error: "Unknown message type" });
    return false;
  }
);

// Periodic alarm to refresh auth token before it expires
chrome.alarms.create("refresh-auth", { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refresh-auth") {
    // Let the Supabase SDK refresh the token via its own autoRefreshToken logic
    supabase.auth.getSession().catch(() => {});
  }
});
