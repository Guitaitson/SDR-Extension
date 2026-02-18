/**
 * MV3 Service Worker — runs in background, orchestrates extension lifecycle.
 *
 * Important constraints:
 * - Service workers terminate after 30s of inactivity or 5min of processing.
 * - Use chrome.alarms to keep logic alive for periodic tasks.
 * - All async API calls must complete within the service worker lifecycle.
 */

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

// Periodic alarm to refresh auth token before it expires
chrome.alarms.create("refresh-auth", { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refresh-auth") {
    // Trigger token refresh by getting the session
    // The Supabase client handles refresh automatically via chromeStorageAdapter
    chrome.storage.local.get("supabase.auth.token", () => {
      // No-op — Supabase's autoRefreshToken handles this
    });
  }
});
