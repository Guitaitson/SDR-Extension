import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import path from "path";
import manifest from "./manifest";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // CRXJS handles entry points from manifest; no extra rollupOptions.input needed.
  // The popup HTML is referenced from manifest.action.default_popup.
});
