import type { UserProfile } from "@/types";

const PLAN_LABELS: Record<string, string> = { free: "Grátis", pro: "Pro", team: "Team" };
const PLAN_COLORS: Record<string, string> = { free: "#475569", pro: "#1d4ed8", team: "#7c3aed" };

interface Props { profile: UserProfile }

export default function UsageBadge({ profile }: Props) {
  const pct = Math.min(100, Math.round((profile.lookups_used_this_month / profile.lookups_limit) * 100));
  const nearLimit = pct >= 80;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#64748b" }}>
      <span style={{ background: PLAN_COLORS[profile.plan] ?? "#475569", color: "#fff", fontWeight: 700, borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>
        {PLAN_LABELS[profile.plan] ?? profile.plan}
      </span>
      <span style={{ color: nearLimit ? "#f87171" : "#64748b" }}>
        {profile.lookups_used_this_month}/{profile.lookups_limit} consultas este mês
      </span>
      {profile.plan === "free" && pct >= 70 && (
        <a href="https://sdrextension.com.br/pricing" target="_blank" rel="noreferrer" style={{ color: "#60a5fa", textDecoration: "none", marginLeft: "auto" }}>
          Upgrade
        </a>
      )}
    </div>
  );
}
