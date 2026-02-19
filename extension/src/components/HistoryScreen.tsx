/**
 * History Screen — last 50 CNPJ lookups for the current user.
 * Clicking an item re-runs the lookup.
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatCnpj } from "@/lib/cnpj";

interface Props {
  onBack: () => void;
}

interface HistoryItem {
  cnpj: string;
  razao_social: string | null;
  looked_up_at: string;
  result_summary: string | null;
}

export default function HistoryScreen({ onBack }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("lookup_history")
        .select("cnpj, razao_social, looked_up_at, result_summary")
        .eq("user_id", user.id)
        .order("looked_up_at", { ascending: false })
        .limit(50);

      setItems((data as HistoryItem[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const handleReopen = (cnpj: string) => {
    chrome.storage.local.set({ pending_cnpj: cnpj });
    onBack();
  };

  return (
    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: 0 }}>
          ← Voltar
        </button>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Histórico</h2>
      </div>

      {loading && <div style={{ color: "#475569", fontSize: 13 }}>Carregando...</div>}

      {!loading && items.length === 0 && (
        <div style={{ fontSize: 13, color: "#475569", textAlign: "center", padding: "24px 0" }}>
          Nenhuma consulta ainda.<br />Cole um CNPJ para começar.
        </div>
      )}

      {items.map((item) => (
        <div
          key={`${item.cnpj}-${item.looked_up_at}`}
          onClick={() => handleReopen(item.cnpj)}
          style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#f1f5f9" }}>
              {item.razao_social ?? formatCnpj(item.cnpj)}
            </div>
            <div style={{ fontSize: 10, color: "#475569", whiteSpace: "nowrap", marginLeft: 8 }}>
              {new Date(item.looked_up_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{formatCnpj(item.cnpj)}</div>
          {item.result_summary && (
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.result_summary}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
