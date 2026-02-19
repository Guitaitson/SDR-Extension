"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Os dados são da Receita Federal?",
    a: "Sim. A extensão usa as APIs públicas BrasilAPI e OpenCNPJ, que espelham os dados do CNPJ da Receita Federal (CNPJ, razão social, CNAE, sócios, endereço). Esses dados são públicos sob a Lei de Acesso à Informação.",
  },
  {
    q: "E a LGPD? Posso usar para prospecção?",
    a: "Dados de pessoa jurídica (CNPJ) são públicos e não são protegidos pela LGPD. Para empresas MEI e EI (Empresário Individual), os dados são pessoais e a extensão os flagra. A base legal para prospecção B2B é o legítimo interesse (Art. 7º, IX da LGPD). Documentação disponível em nosso site.",
  },
  {
    q: "Preciso de chave da OpenAI?",
    a: "Não. O plano Grátis e Pro inclui IA subsidiada (GPT-4o-mini). O BYOK (traga sua própria chave) é opcional para usuários que querem usar sua própria conta OpenAI/OpenRouter — disponível no plano Pro.",
  },
  {
    q: "Como funciona o limite de consultas?",
    a: "O limite reseta todo mês. Consultas repetidas do mesmo CNPJ não consomem crédito (cache de 30 dias). O contador aparece sempre na extensão.",
  },
  {
    q: "A extensão usa LinkedIn?",
    a: "Não. A extensão não toca no LinkedIn nem lê perfis. Toda a inteligência vem de dados públicos do CNPJ + IA. Isso evita risco de banimento de conta no LinkedIn.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Sem fidelidade, sem contrato. Cancele em 1 clique no painel Lemon Squeezy. O plano fica ativo até o fim do período pago.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        padding: "80px 24px",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 800,
          color: "#f1f5f9",
          marginBottom: 48,
        }}
      >
        Perguntas frequentes
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px 20px",
                background: "none",
                border: "none",
                color: "#f1f5f9",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              {faq.q}
              <span style={{ flexShrink: 0, color: "#3b82f6" }}>
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <div
                style={{
                  padding: "0 20px 16px",
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
