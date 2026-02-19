/**
 * Settings Screen — BYOK keys + auto-detect toggle.
 *
 * Design principle: zero friction for basic users.
 * BYOK is an optional "power user" section, collapsed by default.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { ExtensionSettings } from "@/types";

interface Props {
  onBack: () => void;
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  default_message_type: "whatsapp",
  language: "pt-BR",
  auto_detect_cnpj: true,
};

export default function SettingsScreen({ onBack }: Props) {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [byokOpen, setByokOpen] = useState(false);
  const [keys, setKeys] = useState({ openrouter: "", apollo: "", lusha: "" });
  const [saved, setSaved] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Load settings from chrome.storage.local
    chrome.storage.local.get("settings", (result: { settings?: ExtensionSettings }) => {
      if (result.settings) setSettings(result.settings);
    });
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };

  const saveBYOK = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const body: Record<string, string> = {};
    if (keys.openrouter.trim()) body.openrouter_key = keys.openrouter.trim();
    if (keys.apollo.trim()) body.apollo_key = keys.apollo.trim();
    if (keys.lusha.trim()) body.lusha_key = keys.lusha.trim();
    if (!Object.keys(body).length) return;

    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-byok-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    setKeys({ openrouter: "", apollo: "", lusha: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={onBack} style={btnBack}>← Voltar</button>

      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Configurações</h2>

      {userEmail && (
        <div style={{ fontSize: 12, color: "#64748b" }}>
          Conta: <strong style={{ color: "#94a3b8" }}>{userEmail}</strong>
        </div>
      )}

      {/* General settings */}
      <Section title="Geral">
        <Label>Tipo de mensagem padrão</Label>
        <select
          value={settings.default_message_type}
          onChange={(e) => setSettings({ ...settings, default_message_type: e.target.value as ExtensionSettings["default_message_type"] })}
          style={selectStyle}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="email">E-mail</option>
          <option value="linkedin">LinkedIn</option>
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <input
            type="checkbox"
            id="auto-detect"
            checked={settings.auto_detect_cnpj}
            onChange={(e) => setSettings({ ...settings, auto_detect_cnpj: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <label htmlFor="auto-detect" style={{ fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
            Detectar CNPJs automaticamente nas páginas
          </label>
        </div>

        <button onClick={saveSettings} style={{ ...btnPrimary, marginTop: 10 }}>
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </Section>

      {/* BYOK — collapsed by default */}
      <div>
        <button
          onClick={() => setByokOpen((o) => !o)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 12px", color: "#94a3b8", cursor: "pointer", fontSize: 13 }}
        >
          <span>Chaves próprias (BYOK) — opcional</span>
          <span>{byokOpen ? "−" : "+"}</span>
        </button>

        {byokOpen && (
          <div style={{ padding: "12px", background: "#0f1e2e", borderRadius: "0 0 8px 8px", border: "1px solid #1e293b", borderTop: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.5 }}>
              Configure suas próprias chaves de API para usar modelos IA ou enriquecimento de contatos (Apollo/Lusha). As chaves são armazenadas criptografadas no servidor — nunca ficam no dispositivo.
            </p>

            <ByokField
              label="OpenRouter API Key (LLM)"
              placeholder="sk-or-v1-..."
              hint="Use seu próprio modelo IA. Grátis no plano básico do OpenRouter."
              value={keys.openrouter}
              onChange={(v) => setKeys({ ...keys, openrouter: v })}
            />
            <ByokField
              label="Apollo.io API Key (Contatos)"
              placeholder="sua-chave-apollo"
              hint="Busca contatos verificados por domínio. Plano Team."
              value={keys.apollo}
              onChange={(v) => setKeys({ ...keys, apollo: v })}
            />
            <ByokField
              label="Lusha API Key (Telefones)"
              placeholder="sua-chave-lusha"
              hint="Telefones diretos de decisores. Plano Team."
              value={keys.lusha}
              onChange={(v) => setKeys({ ...keys, lusha: v })}
            />

            <button onClick={saveBYOK} style={btnPrimary}>
              {saved ? "Chaves salvas!" : "Salvar chaves"}
            </button>
          </div>
        )}
      </div>

      <a href="https://sdrextension.com.br/pricing" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#3b82f6", textDecoration: "none", textAlign: "center" }}>
        Ver planos e preços →
      </a>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, color: "#64748b" }}>{children}</div>;
}

function ByokField({ label, placeholder, hint, value, onChange }: { label: string; placeholder: string; hint: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{label}</div>
      <input
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 12, fontFamily: "monospace" }}
        autoComplete="off"
      />
      <div style={{ fontSize: 11, color: "#475569" }}>{hint}</div>
    </div>
  );
}

const btnBack: React.CSSProperties = { background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: 0, textAlign: "left" };
const btnPrimary: React.CSSProperties = { padding: "8px 14px", borderRadius: 7, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" };
const selectStyle: React.CSSProperties = { padding: "6px 8px", borderRadius: 6, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, width: "100%" };
