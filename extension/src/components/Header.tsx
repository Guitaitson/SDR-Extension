import type { Session } from "@supabase/supabase-js";
import { signOut } from "@/lib/api";

interface Props {
  session: Session | null;
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #1e293b",
    background: "#0f172a",
  } as const,
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 15,
    color: "#f1f5f9",
  } as const,
  badge: {
    fontSize: 10,
    fontWeight: 600,
    background: "#1d4ed8",
    color: "#fff",
    borderRadius: 4,
    padding: "1px 5px",
    letterSpacing: "0.05em",
  } as const,
  signOut: {
    fontSize: 12,
    color: "#94a3b8",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 4,
  } as const,
};

export default function Header({ session }: Props) {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <span>SDR</span>
        <span style={styles.badge}>BETA</span>
      </div>
      {session && (
        <button
          style={styles.signOut}
          onClick={() => signOut()}
          title="Sair"
        >
          Sair
        </button>
      )}
    </header>
  );
}
