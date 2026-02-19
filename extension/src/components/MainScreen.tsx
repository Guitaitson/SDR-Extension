import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { lookupCnpj, getUserProfile } from "@/lib/api";
import { isValidCnpj, formatCnpj, stripCnpj } from "@/lib/cnpj";
import type { EnrichmentResult, UserProfile } from "@/types";
import CnpjInput from "./CnpjInput";
import ResultCard from "./ResultCard";
import UsageBadge from "./UsageBadge";

interface Props {
  session: Session;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "result"; data: EnrichmentResult }
  | { status: "error"; message: string };

export default function MainScreen({ session: _session }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    getUserProfile().then(setProfile).catch(console.error);

    // Pick up CNPJ queued by content script
    chrome.storage.local.get("pending_cnpj", (result: { pending_cnpj?: string }) => {
      if (result.pending_cnpj) {
        setCnpj(formatCnpj(result.pending_cnpj));
        chrome.storage.local.remove("pending_cnpj");
      }
    });
  }, []);

  const handleLookup = async () => {
    const raw = stripCnpj(cnpj);
    if (!isValidCnpj(raw)) {
      setState({ status: "error", message: "CNPJ inválido. Verifique os dígitos." });
      return;
    }

    const atLimit = profile && profile.lookups_used_this_month >= profile.lookups_limit;
    if (atLimit) {
      setState({
        status: "error",
        message: `Limite mensal atingido (${profile.lookups_limit} consultas). Faça upgrade para continuar.`,
      });
      return;
    }

    setState({ status: "loading" });
    try {
      const result = await lookupCnpj(raw);
      setState({ status: "result", data: result });
      getUserProfile().then(setProfile).catch(console.error);
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Erro ao consultar CNPJ.",
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {profile && (
        <div style={{ padding: "8px 16px 0" }}>
          <UsageBadge profile={profile} />
        </div>
      )}

      <div style={{ padding: "12px 16px" }}>
        <CnpjInput
          value={cnpj}
          onChange={setCnpj}
          onSubmit={handleLookup}
          loading={state.status === "loading"}
          formatFn={formatCnpj}
        />
      </div>

      {state.status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 32 }}>
          <div style={{ width: 28, height: 28, border: "3px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%" }} />
          <div style={{ fontSize: 13, color: "#64748b" }}>Consultando CNPJ e gerando mensagem...</div>
        </div>
      )}

      {state.status === "error" && (
        <div style={{ margin: "0 16px 16px", padding: 12, background: "#450a0a", borderRadius: 8, border: "1px solid #7f1d1d", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, color: "#fca5a5" }}>{state.message}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setState({ status: "idle" })} style={{ fontSize: 12, color: "#93c5fd", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Tentar novamente
            </button>
            {state.message.includes("Limite") && (
              <a href="https://sdrextension.com.br/pricing" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#fbbf24", textDecoration: "none" }}>
                Ver planos →
              </a>
            )}
          </div>
        </div>
      )}

      {state.status === "result" && <ResultCard result={state.data} />}

      {state.status === "idle" && (
        <div style={{ padding: "0 16px 16px", fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
          Cole um CNPJ acima para gerar o briefing da empresa e a mensagem de prospecção.
        </div>
      )}
    </div>
  );
}
