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

// Handle external messages from callback page (auth tokens)
chrome.runtime.onMessageExternal.addListener(
  (
    message: { type: string; access_token?: string; refresh_token?: string; error?: string },
    sender,
    sendResponse
  ) => {
    console.log("[Service Worker] External message received from:", sender.url);
    
    if (message.type === "AUTH_TOKEN" && message.access_token && message.refresh_token) {
      // Store the session in chrome.storage.local
      const session = {
        access_token: message.access_token,
        refresh_token: message.refresh_token,
        token_type: "bearer",
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        expires_in: 3600,
        user: null, // Will be populated by Supabase client
      };
      
      chrome.storage.local.set({ "supabase.auth.token": session }, () => {
        console.log("[Service Worker] Auth token stored successfully");
        sendResponse({ success: true });
        
        // Notify all extension pages that auth state changed
        chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED" }).catch(() => {
          // No listeners, that's fine
        });
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
    // Trigger token refresh by getting the session
    // The Supabase client handles refresh automatically via chromeStorageAdapter
    chrome.storage.local.get("supabase.auth.token", () => {
      // No-op — Supabase's autoRefreshToken handles this
    });
  }
});
