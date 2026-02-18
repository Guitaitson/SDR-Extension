const features = [
  {
    icon: "🔍",
    title: "CNPJ em briefing em 15s",
    desc: "Razão social, CNAE, porte, sócios, capital social, localização — tudo que o SDR precisa para chegar preparado.",
  },
  {
    icon: "✉️",
    title: "Mensagem personalizada com IA",
    desc: "E-mail, WhatsApp e LinkedIn InMail gerados automaticamente em português, contextualizados para o segmento da empresa.",
  },
  {
    icon: "🎯",
    title: "Cargo ideal para abordar",
    desc: "A IA analisa o CNAE e porte para indicar quem contatar — Diretor Comercial, CEO, CTO — e por quê.",
  },
  {
    icon: "💬",
    title: "Scripts de objeção",
    desc: '"Não tenho budget" e "Já temos um fornecedor" viram oportunidades. Scripts contextualizados por segmento. (Plano Pro)',
  },
  {
    icon: "🔗",
    title: "Detecção automática de CNPJ",
    desc: "A extensão detecta CNPJs em qualquer página e adiciona um botão Prospectar direto no texto — sem copiar e colar.",
  },
  {
    icon: "🔐",
    title: "Dados públicos + LGPD",
    desc: "Fontes: Receita Federal via BrasilAPI e OpenCNPJ. Base legal: legítimo interesse (LGPD Art. 7º, IX). MEI/EI tratados como dados pessoais.",
  },
];

const s = {
  section: {
    padding: "80px 24px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  sectionTitle: {
    textAlign: "center" as const,
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 800,
    color: "#f1f5f9",
    marginBottom: 12,
  },
  sectionSub: {
    textAlign: "center" as const,
    fontSize: 16,
    color: "#64748b",
    marginBottom: 56,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 24,
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  icon: { fontSize: 28 },
  title: { fontWeight: 700, fontSize: 17, color: "#f1f5f9" },
  desc: { fontSize: 14, color: "#94a3b8", lineHeight: 1.6 },
};

export default function FeaturesSection() {
  return (
    <section style={s.section}>
      <h2 style={s.sectionTitle}>Tudo que um SDR precisa</h2>
      <p style={s.sectionSub}>
        Da pesquisa à mensagem — sem sair do navegador.
      </p>
      <div style={s.grid}>
        {features.map((f) => (
          <div key={f.title} style={s.card}>
            <span style={s.icon}>{f.icon}</span>
            <div style={s.title}>{f.title}</div>
            <div style={s.desc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
