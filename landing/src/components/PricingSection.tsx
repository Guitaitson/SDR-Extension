const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    highlight: false,
    cta: "Instalar grátis",
    ctaHref: "https://chrome.google.com/webstore",
    features: [
      "10 consultas por mês",
      "Dados CNPJ completos",
      "1 mensagem IA por consulta (e-mail)",
      "Detecção automática de CNPJ",
    ],
    missing: [
      "WhatsApp + LinkedIn templates",
      "Scripts de objeção",
      "Histórico de consultas",
    ],
  },
  {
    name: "Pro",
    price: "R$ 97",
    period: "/mês",
    highlight: true,
    cta: "Assinar Pro",
    ctaHref: process.env.NEXT_PUBLIC_LEMON_URL_PRO ?? "#",
    badge: "Mais popular",
    features: [
      "200 consultas por mês",
      "Dados CNPJ completos",
      "E-mail + WhatsApp + LinkedIn templates",
      "Scripts de objeção contextualizado",
      "Cargo ideal para abordar",
      "Histórico das últimas 100 consultas",
      "Cache inteligente (sem gastar crédito)",
      "BYOK: traga sua chave OpenRouter/OpenAI",
    ],
  },
  {
    name: "Team",
    price: "R$ 247",
    period: "/mês",
    highlight: false,
    cta: "Assinar Team",
    ctaHref: process.env.NEXT_PUBLIC_LEMON_URL_TEAM ?? "#",
    features: [
      "Tudo do Pro",
      "3 seats inclusos",
      "Dashboard de atividade do time",
      "BYOK: Apollo.io + Lusha (contatos)",
      "Webhook para CRM (Pipedrive/HubSpot)",
      "Onboarding prioritário",
    ],
  },
];

const s = {
  section: {
    padding: "80px 24px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  title: {
    textAlign: "center" as const,
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 12,
  },
  sub: {
    textAlign: "center" as const,
    color: "#64748b",
    fontSize: 16,
    marginBottom: 16,
  },
  annualNote: {
    textAlign: "center" as const,
    color: "#22c55e",
    fontSize: 14,
    marginBottom: 48,
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    alignItems: "start",
  },
  card: (highlight: boolean) => ({
    background: highlight ? "#1e3a5f" : "#1e293b",
    border: `2px solid ${highlight ? "#2563eb" : "#334155"}`,
    borderRadius: 16,
    padding: 28,
    position: "relative" as const,
  }),
  badge: {
    position: "absolute" as const,
    top: -12,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2563eb",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    borderRadius: 20,
    padding: "3px 14px",
    whiteSpace: "nowrap" as const,
  },
  planName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.08em",
    marginBottom: 8,
    textTransform: "uppercase" as const,
  },
  price: {
    fontSize: 40,
    fontWeight: 800,
    color: "#f1f5f9",
    lineHeight: 1,
  },
  period: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  cta: (highlight: boolean) => ({
    display: "block",
    width: "100%",
    padding: "12px 0",
    borderRadius: 8,
    background: highlight ? "#2563eb" : "transparent",
    border: highlight ? "none" : "1px solid #475569",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    textAlign: "center" as const,
    textDecoration: "none",
    marginBottom: 24,
    cursor: "pointer",
  }),
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  feature: {
    fontSize: 14,
    color: "#94a3b8",
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
  },
  checkMark: { color: "#22c55e", flexShrink: 0 },
  xMark: { color: "#475569", flexShrink: 0 },
  missingFeat: { color: "#475569" },
};

export default function PricingSection() {
  return (
    <section style={s.section} id="precos">
      <h2 style={s.title}>Preços transparentes em BRL</h2>
      <p style={s.sub}>Sem contratos. Cancele quando quiser.</p>
      <p style={s.annualNote}>Plano anual: 20% de desconto (R$77/mês no Pro)</p>
      <div style={s.grid}>
        {plans.map((plan) => (
          <div key={plan.name} style={s.card(plan.highlight)}>
            {plan.badge && <span style={s.badge}>{plan.badge}</span>}
            <div style={s.planName}>{plan.name}</div>
            <div style={s.price}>{plan.price}</div>
            <div style={s.period}>{plan.period}</div>
            <a
              href={plan.ctaHref}
              target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={s.cta(plan.highlight)}
            >
              {plan.cta}
            </a>
            <ul style={s.featureList}>
              {plan.features.map((f) => (
                <li key={f} style={s.feature}>
                  <span style={s.checkMark}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
              {(plan.missing ?? []).map((f) => (
                <li key={f} style={s.feature}>
                  <span style={s.xMark}>✕</span>
                  <span style={s.missingFeat}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 13,
          color: "#475569",
        }}
      >
        ROI calculado: SDR que pesquisa 20 empresas/dia economiza ~100 min/dia
        com a extensão. A R$20/hora, são R$660/mês de valor gerado — com plano
        Pro a R$97/mês, ROI de 6,8x.
      </p>
    </section>
  );
}
