import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como prospectar empresas B2B pelo CNPJ: guia completo para SDRs | SDR Extension",
  description:
    "Aprenda a transformar qualquer CNPJ em inteligência de prospecção acionável. Dados da Receita Federal, análise de porte e CNAE, e mensagem personalizada em menos de um minuto.",
  keywords: [
    "prospectar empresas B2B CNPJ",
    "prospecção CNPJ",
    "como prospectar B2B Brasil",
    "guia SDR Brasil",
    "prospecção empresa CNPJ",
    "Receita Federal prospecção",
  ],
  openGraph: {
    title: "Como prospectar empresas B2B pelo CNPJ — Guia completo",
    description:
      "Aprenda a transformar qualquer CNPJ em inteligência de prospecção acionável para o mercado B2B brasileiro.",
    type: "article",
    locale: "pt_BR",
  },
};

const s = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "#f1f5f9",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    padding: "20px 24px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLogo: { color: "#3b82f6", fontWeight: 800, fontSize: 18, textDecoration: "none" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: 14 },
  article: { maxWidth: 720, margin: "0 auto", padding: "60px 24px 100px" },
  meta: { display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" as const },
  category: {
    background: "#1e3a5f", color: "#60a5fa", fontSize: 12,
    fontWeight: 600, borderRadius: 12, padding: "3px 10px",
  },
  dateLine: { color: "#64748b", fontSize: 13 },
  h1: {
    fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, lineHeight: 1.2,
    color: "#f1f5f9", marginBottom: 20,
  },
  lead: {
    fontSize: 19, color: "#94a3b8", lineHeight: 1.7,
    marginBottom: 40, borderLeft: "3px solid #3b82f6", paddingLeft: 20,
  },
  h2: { fontSize: 26, fontWeight: 700, color: "#e2e8f0", marginTop: 48, marginBottom: 16 },
  h3: { fontSize: 20, fontWeight: 600, color: "#cbd5e1", marginTop: 32, marginBottom: 12 },
  p: { fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 20 },
  ul: { paddingLeft: 24, marginBottom: 20 },
  li: { fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 8 },
  callout: {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 12,
    padding: "24px 28px", margin: "32px 0",
  },
  calloutTitle: { fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 },
  calloutText: { fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 },
  table: {
    width: "100%", borderCollapse: "collapse" as const,
    marginBottom: 32, fontSize: 14,
  },
  th: {
    background: "#1e293b", color: "#e2e8f0", fontWeight: 600,
    padding: "12px 16px", textAlign: "left" as const, border: "1px solid #334155",
  },
  td: {
    color: "#94a3b8", padding: "12px 16px",
    border: "1px solid #1e293b", verticalAlign: "top" as const,
  },
  cta: {
    background: "linear-gradient(135deg, #1e3a5f, #1e293b)",
    border: "1px solid #2563eb", borderRadius: 16,
    padding: "32px 36px", margin: "48px 0", textAlign: "center" as const,
  },
  ctaTitle: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 },
  ctaText: { fontSize: 16, color: "#94a3b8", marginBottom: 24 },
  ctaBtn: {
    display: "inline-block", background: "#2563eb", color: "#fff",
    fontWeight: 700, fontSize: 16, padding: "14px 28px",
    borderRadius: 10, textDecoration: "none",
  },
  code: {
    background: "#1e293b", color: "#60a5fa", borderRadius: 6,
    padding: "2px 8px", fontSize: 14, fontFamily: "monospace",
  },
};

export default function BlogPost1() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/blog" style={s.navLink}>← Blog</Link>
      </nav>

      <article style={s.article}>
        <div style={s.meta}>
          <span style={s.category}>Prospecção</span>
          <span style={s.dateLine}>10 de dezembro de 2024 · 8 min de leitura</span>
        </div>

        <h1 style={s.h1}>
          Como prospectar empresas B2B pelo CNPJ: o guia completo para SDRs brasileiros
        </h1>

        <p style={s.lead}>
          Cada empresa brasileira tem um CNPJ. Esse número de 14 dígitos é, na prática, o perfil
          público mais completo que existe sobre um negócio — e a maioria dos SDRs nem sabe o que
          pode extrair dele. Este guia mostra como transformar qualquer CNPJ em uma abordagem
          comercial precisa em menos de dois minutos.
        </p>

        <h2 style={s.h2}>Por que o CNPJ é o melhor ponto de partida para prospecção B2B</h2>
        <p style={s.p}>
          Enquanto ferramentas americanas dependem de dados do LinkedIn ou de bases proprietárias
          caras, o Brasil tem algo único: a Receita Federal mantém um cadastro público de todas as
          empresas ativas no país — atualizado, gratuito e acessível via API.
        </p>
        <p style={s.p}>
          Quando você consulta um CNPJ, você acessa instantaneamente:
        </p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Razão social e nome fantasia</strong> — para saber com quem está falando</li>
          <li style={s.li}><strong>CNAE principal e secundários</strong> — o que a empresa realmente faz</li>
          <li style={s.li}><strong>Porte da empresa</strong> — ME, EPP, Médio ou Grande</li>
          <li style={s.li}><strong>Capital social</strong> — proxy de tamanho e capacidade de investimento</li>
          <li style={s.li}><strong>Data de abertura</strong> — empresa nova (oportunidade) ou estabelecida (processo longo)?</li>
          <li style={s.li}><strong>Endereço completo</strong> — município, bairro, UF</li>
          <li style={s.li}><strong>Quadro societário</strong> — quem são os sócios e suas participações</li>
          <li style={s.li}><strong>Situação cadastral</strong> — ativa, suspensa, baixada</li>
        </ul>

        <div style={s.callout}>
          <p style={s.calloutTitle}>💡 Insight de prospecção</p>
          <p style={s.calloutText}>
            O CNAE é o campo mais subestimado. Um código CNAE revela o modelo de negócio, o
            perfil de cliente e os principais desafios do setor — tudo que você precisa para
            personalizar sua abordagem sem pesquisar por 20 minutos no Google.
          </p>
        </div>

        <h2 style={s.h2}>O que o CNAE revela (e como usar na abordagem)</h2>
        <p style={s.p}>
          O CNAE (Classificação Nacional de Atividades Econômicas) é um sistema hierárquico com
          seções, divisões e classes. Para o SDR, o que importa é a classe — os 7 dígitos que
          descrevem a atividade principal.
        </p>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Grupo de CNAE</th>
              <th style={s.th}>O que sinaliza</th>
              <th style={s.th}>Ângulo de abordagem</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["47xx – Comércio varejista", "PDV físico, gestão de estoque, alto giro", "Como você controla ruptura de estoque hoje?"],
              ["62xx – TI e software", "Equipe técnica, cultura data-driven, ciclo de compra mais longo", "Quem lidera a decisão de novas ferramentas?"],
              ["74xx – Atividades profissionais", "Escritórios de advocacia, contabilidade, consultoria", "Sua equipe comercial tem como medir MRR de clientes?"],
              ["55xx – Hospedagem", "Hotéis, pousadas — sazonalidade alta", "Como você gerencia ocupação nos períodos de baixa?"],
              ["86xx – Saúde", "Clínicas, labs — regulação rígida, ciclo longo", "Você já mapeou os gargalos de captação de pacientes?"],
            ].map(([cnae, signal, angle]) => (
              <tr key={cnae}>
                <td style={s.td}><code style={s.code}>{cnae}</code></td>
                <td style={s.td}>{signal}</td>
                <td style={s.td}><em>{angle}</em></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={s.h2}>Passo a passo: de CNPJ a primeiro contato em 5 etapas</h2>

        <h3 style={s.h3}>1. Obtenha o CNPJ</h3>
        <p style={s.p}>
          Fontes comuns: site da empresa (rodapé, notas fiscais), LinkedIn (campo &ldquo;Número fiscal&rdquo;),
          listas de licitações públicas (Portal da Transparência), ou a própria lista de clientes.
          Se você tem o nome da empresa, o site da Receita Federal permite busca por nome fantasia.
        </p>

        <h3 style={s.h3}>2. Consulte os dados da Receita Federal</h3>
        <p style={s.p}>
          Você pode usar diretamente o site da Receita Federal, mas isso leva tempo e não escala.
          A solução profissional é usar uma API como OpenCNPJ, BrasilAPI ou ReceitaWS — todas
          gratuitas para volumes baixos. Com a SDR Extension, isso acontece automaticamente em
          segundo plano.
        </p>

        <h3 style={s.h3}>3. Interprete porte + capital social</h3>
        <p style={s.p}>
          O porte (ME/EPP/Grande) define o ciclo de venda esperado e o perfil do decisor:
        </p>
        <ul style={s.ul}>
          <li style={s.li}><strong>MEI e ME:</strong> Decisão rápida, mas ticket baixo. O decisor é o próprio dono.</li>
          <li style={s.li}><strong>EPP (até R$4,8M/ano):</strong> Começa a ter gerentes. Processo pode ter 2–3 aprovações.</li>
          <li style={s.li}><strong>Médio/Grande:</strong> Múltiplos stakeholders, procurement, ciclo de 30–90 dias.</li>
        </ul>

        <h3 style={s.h3}>4. Pesquise os sócios</h3>
        <p style={s.p}>
          O quadro societário revela os tomadores de decisão. Para empresas pequenas, os sócios
          são os compradores. Pesquise o nome no LinkedIn para entender cargo atual, histórico
          e pontos de interesse comuns. Para empresas médias e grandes, use os sócios como
          informação de contexto — procure o gerente de área no LinkedIn.
        </p>

        <h3 style={s.h3}>5. Monte a mensagem personalizada</h3>
        <p style={s.p}>
          Com CNAE, porte e informação dos sócios, você tem tudo para criar uma abertura que
          soa como pesquisa, não como cold call genérico:
        </p>
        <div style={s.callout}>
          <p style={s.calloutTitle}>Exemplo de abertura personalizada</p>
          <p style={s.calloutText}>
            &ldquo;Oi [Nome], vi que a [Razão Social] atua em [CNAE descrição] desde [ano de abertura].
            Empresas do setor [setor] que a gente atende costumam ter desafio com [problema específico do CNAE].
            Você consegue 15 minutos esta semana para eu mostrar como estamos resolvendo isso?&rdquo;
          </p>
        </div>

        <h2 style={s.h2}>Erros mais comuns ao prospectar pelo CNPJ</h2>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong>Ignorar a situação cadastral:</strong> Prospectar empresa com situação &ldquo;BAIXADA&rdquo;
            ou &ldquo;SUSPENSA&rdquo; é tempo perdido. Sempre verifique.
          </li>
          <li style={s.li}>
            <strong>Usar só o CNAE principal:</strong> Empresas com CNAEs secundários relevantes
            podem ser oportunidades que concorrentes ignoram.
          </li>
          <li style={s.li}>
            <strong>Não considerar o município:</strong> Uma empresa em São Paulo e outra com o
            mesmo CNAE em cidade do interior têm perfis de compra muito diferentes.
          </li>
          <li style={s.li}>
            <strong>Mensagem genérica apesar dos dados:</strong> Ter os dados sem usá-los na
            abordagem destrói a vantagem. Mencione algo específico do CNPJ consultado.
          </li>
        </ul>

        <h2 style={s.h2}>Como automatizar esse processo em escala</h2>
        <p style={s.p}>
          Manualmente, esse fluxo leva de 10 a 15 minutos por empresa — e ainda assim a qualidade
          depende da atenção do SDR em cada etapa. As melhores equipes automatizam o lookup e a
          análise inicial, liberando o SDR para focar no que é insubstituível: a conversa.
        </p>
        <p style={s.p}>
          Com a SDR Extension, você cola o CNPJ e em 15 segundos recebe:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Briefing completo da empresa formatado para prospecção</li>
          <li style={s.li}>Análise de porte, setor e maturidade</li>
          <li style={s.li}>Sugestão do cargo ideal para abordar</li>
          <li style={s.li}>Rascunho de mensagem personalizada em português, pronto para enviar pelo WhatsApp ou e-mail</li>
        </ul>

        <div style={s.cta}>
          <p style={s.ctaTitle}>Experimente gratuitamente</p>
          <p style={s.ctaText}>
            10 consultas por mês sem custo. Sem cartão de crédito. Instale em 30 segundos.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
            style={s.ctaBtn}
          >
            Instalar SDR Extension — Chrome
          </a>
        </div>

        <h2 style={s.h2}>Conclusão</h2>
        <p style={s.p}>
          O CNPJ é o ativo de inteligência comercial mais subestimado do mercado B2B brasileiro.
          Enquanto seus concorrentes compram listas genéricas ou ficam horas no LinkedIn, você
          pode ter uma pesquisa completa de qualquer prospect em segundos — e chegar à conversa
          já sabendo o contexto do negócio.
        </p>
        <p style={s.p}>
          O SDR que domina a leitura de dados públicos de CNPJ tem uma vantagem estrutural:
          abordagens mais personalizadas, menos rejeições e ciclos de venda mais curtos. E no
          mercado brasileiro, onde a confiança é o principal catalisador de vendas, essa
          personalização faz toda a diferença.
        </p>
      </article>
    </div>
  );
}
