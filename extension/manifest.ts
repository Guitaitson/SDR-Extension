import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

const { version } = packageJson;

export default defineManifest({
  manifest_version: 3,
  name: "SDR Extension — Prospecção B2B",
  description:
    "Cole um CNPJ e receba em 15s o briefing completo da empresa, os contatos certos e a mensagem personalizada pronta para enviar.",
  version,
  action: {
    default_popup: "src/popup/index.html",
    default_title: "SDR Extension",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content-script.ts"],
      run_at: "document_idle",
    },
  ],
  permissions: ["storage", "activeTab"],
  host_permissions: [
    // Supabase Edge Functions — replace with your actual project URL
    "https://*.supabase.co/*",
  ],
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; connect-src 'self' https://*.supabase.co;",
  },
});
