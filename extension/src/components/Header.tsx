import type { Session } from "@supabase/supabase-js";
import type { AppScreen } from "@/popup/App";
import { signOut } from "@/lib/api";

interface Props {
  session: Session | null;
  screen: AppScreen;
  onNavigate: (s: AppScreen) => void;
}

export default function Header({ session, screen, onNavigate }: Props) {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #1e293b", background: "#0f172a" }}>
      <button onClick={() => onNavigate("main")} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 15, color: "#f1f5f9", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <span>SDR</span>
        <span style={{ fontSize: 10, fontWeight: 600, background: "#1d4ed8", color: "#fff", borderRadius: 4, padding: "1px 5px" }}>BETA</span>
      </button>
      {session && (
        <div style={{ display: "flex", gap: 4 }}>
          <NavBtn active={screen === "history"} onClick={() => onNavigate("history")} title="Histórico">⏱</NavBtn>
          <NavBtn active={screen === "settings"} onClick={() => onNavigate("settings")} title="Configurações">⚙</NavBtn>
          <NavBtn active={false} onClick={() => signOut()} title="Sair">↩</NavBtn>
        </div>
      )}
    </header>
  );
}

function NavBtn({ children, onClick, title, active }: { children: React.ReactNode; onClick: () => void; title: string; active: boolean }) {
  return (
    <button onClick={onClick} title={title} style={{ background: active ? "#1e3a5f" : "none", border: "none", borderRadius: 6, padding: "4px 8px", color: active ? "#60a5fa" : "#64748b", cursor: "pointer", fontSize: 14 }}>
      {children}
    </button>
  );
}
