import { useState } from "react";
import type { EnrichmentResult, SuggestedContact } from "@/types";
import { formatCnpj } from "@/lib/cnpj";

interface Props {
  result: EnrichmentResult;
}

type Tab = "briefing" | "email" | "whatsapp" | "objections" | "contacts";

const TAB_LABELS: Record<Tab, string> = {
  briefing:   "Briefing",
  email:      "E-mail",
  whatsapp:   "WhatsApp",
  objections: "Objeções",
  contacts:   "Contatos",
};

const SOURCE_LABEL: Record<SuggestedContact["source"], { label: string; color: string }> = {
  apollo:   { label: "Apollo",   color: "#1d4ed8" },
  lusha:    { label: "Lusha",    color: "#15803d" },
  clay:     { label: "Clay",     color: "#7e22ce" },
  inferred: { label: "Inferido", color: "#475569" },
};

export default function ResultCard({ result }: Props) {
  const [tab, setTab] = useState<Tab>("briefing");
  const [copied, setCopied] = useState(false);

  const { cnpj_data: c, messages, company_summary, objection_scripts } = result;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const currentMessage =
    tab === "email"
      ? messages.email
      : tab === "whatsapp"
        ? messages.whatsapp
        : null;

  return (
    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Company header */}
      <div
        style={{
          background: "#1e293b",
          borderRadius: 8,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
          {c.razao_social}
        </div>
        {c.nome_fantasia && (
          <div style={{ fontSize: 12, color: "#64748b" }}>{c.nome_fantasia}</div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          <Chip>{formatCnpj(c.cnpj)}</Chip>
          {c.porte && <Chip>{porteLabel(c.porte)}</Chip>}
          {c.uf && <Chip>{c.municipio ? `${c.municipio}/${c.uf}` : c.uf}</Chip>}
          {c.situacao_cadastral && (
            <Chip
              color={
                c.situacao_cadastral.toLowerCase() === "ativa"
                  ? "#166534"
                  : "#7f1d1d"
              }
            >
              {c.situacao_cadastral}
            </Chip>
          )}
        </div>
        {c.cnae_fiscal_descricao && (
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            {c.cnae_fiscal_descricao}
          </div>
        )}
        {(c.is_mei || c.is_ei) && (
          <div
            style={{
              fontSize: 11,
              color: "#fbbf24",
              background: "#422006",
              padding: "2px 6px",
              borderRadius: 4,
              alignSelf: "flex-start",
              marginTop: 4,
            }}
          >
            MEI/EI — dados pessoais protegidos pela LGPD
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #1e293b", paddingBottom: 0 }}>
        {(["briefing", "email", "whatsapp", "objections", "contacts"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: tab === t ? 700 : 400,
              color: tab === t ? "#60a5fa" : "#64748b",
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "briefing" && (
        <div
          style={{
            fontSize: 13,
            color: "#cbd5e1",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {company_summary}
        </div>
      )}

      {(tab === "email" || tab === "whatsapp") && currentMessage && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              background: "#1e293b",
              borderRadius: 8,
              padding: 12,
              fontSize: 13,
              color: "#cbd5e1",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {currentMessage}
          </div>
          <button
            onClick={() => copyText(currentMessage)}
            style={{
              alignSelf: "flex-end",
              padding: "6px 14px",
              background: copied ? "#166534" : "#334155",
              color: copied ? "#86efac" : "#f1f5f9",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? "Copiado!" : "Copiar mensagem"}
          </button>
        </div>
      )}

      {tab === "objections" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {objection_scripts && objection_scripts.length > 0 ? (
            objection_scripts.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  borderRadius: 8,
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>
                  {item.objection}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                  {item.response}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: 13, color: "#475569" }}>
              Scripts de objeção disponíveis no plano Pro.
            </div>
          )}
        </div>
      )}

      {tab === "contacts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.suggested_contacts && result.suggested_contacts.length > 0 ? (
            result.suggested_contacts.map((contact, i) => {
              const src = SOURCE_LABEL[contact.source] ?? SOURCE_LABEL.inferred;
              return (
                <div
                  key={i}
                  style={{ background: "#1e293b", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#f1f5f9" }}>{contact.name}</div>
                    <span style={{ fontSize: 10, background: src.color, color: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                      {src.label}
                    </span>
                  </div>
                  {contact.title && (
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{contact.title}</div>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none" }}>
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{contact.phone}</div>
                  )}
                  {contact.linkedin_url && (
                    <a href={contact.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#3b82f6", textDecoration: "none" }}>
                      LinkedIn →
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
              Nenhum contato encontrado.{" "}
              Configure suas chaves Apollo, Lusha ou Clay em{" "}
              <strong style={{ color: "#94a3b8" }}>Configurações → BYOK</strong>.
            </div>
          )}
        </div>
      )}

      {/* Contacts suggestion */}
      {result.ideal_contact_role && (
        <div
          style={{
            background: "#0f3460",
            borderRadius: 8,
            padding: 10,
            fontSize: 12,
            color: "#93c5fd",
          }}
        >
          <strong>Cargo ideal para abordar:</strong> {result.ideal_contact_role}
        </div>
      )}

      {result.cached && (
        <div style={{ fontSize: 10, color: "#334155", textAlign: "right" }}>
          Dados em cache de {result.cached_at ? new Date(result.cached_at).toLocaleDateString("pt-BR") : ""}
        </div>
      )}
    </div>
  );
}

function Chip({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        fontSize: 11,
        background: color ?? "#1e3a5f",
        color: "#cbd5e1",
        padding: "2px 6px",
        borderRadius: 4,
      }}
    >
      {children}
    </span>
  );
}

function porteLabel(porte: string) {
  const map: Record<string, string> = {
    ME: "Micro Empresa",
    EPP: "Pequeno Porte",
    MEDIA: "Média Empresa",
    GRANDE: "Grande Empresa",
  };
  return map[porte] ?? porte;
}
