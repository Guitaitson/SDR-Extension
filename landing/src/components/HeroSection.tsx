const s = {
  section: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 24px",
    textAlign: "center" as const,
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
  },
  eyebrow: {
    display: "inline-block",
    background: "#1e3a5f",
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 20,
    padding: "4px 14px",
    marginBottom: 24,
    letterSpacing: "0.05em",
  },
  h1: {
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#f1f5f9",
    maxWidth: 800,
    margin: "0 auto 20px",
  },
  highlight: {
    color: "#3b82f6",
  },
  subtitle: {
    fontSize: "clamp(16px, 2.5vw, 20px)",
    color: "#94a3b8",
    maxWidth: 600,
    margin: "0 auto 40px",
    lineHeight: 1.6,
  },
  ctaRow: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    flexWrap: "wrap" as const,
    marginBottom: 48,
  },
  ctaPrimary: {
    display: "inline-block",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    padding: "14px 28px",
    borderRadius: 10,
    textDecoration: "none",
  },
  ctaSecondary: {
    display: "inline-block",
    border: "1px solid #334155",
    color: "#94a3b8",
    fontWeight: 600,
    fontSize: 16,
    padding: "14px 28px",
    borderRadius: 10,
    textDecoration: "none",
  },
  stats: {
    display: "flex",
    gap: 40,
    justifyContent: "center",
    flexWrap: "wrap" as const,
    borderTop: "1px solid #1e293b",
    paddingTop: 40,
    maxWidth: 700,
    margin: "0 auto",
  },
  stat: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  statNum: {
    fontSize: 32,
    fontWeight: 800,
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    maxWidth: 140,
    lineHeight: 1.4,
  },
};

export default function HeroSection() {
  return (
    <section style={s.section}>
      <span style={s.eyebrow}>Chrome Extension para SDRs Brasileiros</span>

      <h1 style={s.h1}>
        De CNPJ a mensagem pronta{" "}
        <span style={s.highlight}>em 15 segundos</span>
      </h1>

      <p style={s.subtitle}>
        Cole qualquer CNPJ e receba o briefing completo da empresa, o cargo
        ideal para abordar e a mensagem de prospecção personalizada — tudo em
        português, sem LinkedIn, sem planilha.
      </p>

      <div style={s.ctaRow}>
        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noreferrer"
          style={s.ctaPrimary}
        >
          Instalar grátis — Chrome
        </a>
        <a href="#como-funciona" style={s.ctaSecondary}>
          Ver demonstração
        </a>
      </div>

      <div style={s.stats}>
        {[
          { num: "15s", label: "De CNPJ a mensagem pronta" },
          { num: "72%", label: "dos times BR não batem meta — você pode mudar isso" },
          { num: "R$0", label: "para começar — 10 consultas grátis/mês" },
          { num: "100%", label: "dados da Receita Federal, sem LinkedIn" },
        ].map((stat) => (
          <div key={stat.num} style={s.stat}>
            <span style={s.statNum}>{stat.num}</span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
