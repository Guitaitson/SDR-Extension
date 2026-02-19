const steps = [
  {
    num: "1",
    title: "Instale a extensão",
    desc: 'Adicione ao Chrome grátis. Entre com seu e-mail — link mágico, sem senha. 10 consultas mensais no plano gratuito.',
  },
  {
    num: "2",
    title: "Cole o CNPJ",
    desc: 'Abra o popup e cole qualquer CNPJ. Ou a extensão detecta CNPJs automaticamente nas páginas que você visita.',
  },
  {
    num: "3",
    title: "Receba o briefing + mensagem",
    desc: 'Em 15 segundos: dados da empresa, cargo ideal para abordar e a mensagem personalizada pronta para enviar.',
  },
  {
    num: "4",
    title: "Copie e prospecte",
    desc: 'Copie a mensagem de e-mail ou WhatsApp com 1 clique. Mais reuniões, menos tempo pesquisando.',
  },
];

const s = {
  section: {
    padding: "80px 24px",
    background: "#0a0f1e",
  },
  inner: {
    maxWidth: 900,
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
    marginBottom: 56,
  },
  steps: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  },
  step: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
    paddingBottom: 32,
    borderLeft: "2px solid #1e3a5f",
    paddingLeft: 28,
    position: "relative" as const,
  },
  num: {
    position: "absolute" as const,
    left: -16,
    top: 0,
    width: 30,
    height: 30,
    background: "#2563eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    color: "#fff",
  },
  stepTitle: {
    fontWeight: 700,
    fontSize: 17,
    color: "#f1f5f9",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
  },
};

export default function HowItWorksSection() {
  return (
    <section style={s.section} id="como-funciona">
      <div style={s.inner}>
        <h2 style={s.title}>Como funciona</h2>
        <p style={s.sub}>4 passos do CNPJ à reunião agendada.</p>
        <div style={s.steps}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                ...s.step,
                borderLeft: i === steps.length - 1 ? "2px solid transparent" : s.step.borderLeft,
              }}
            >
              <div style={s.num}>{step.num}</div>
              <div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
