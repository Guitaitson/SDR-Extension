import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ferramentas de SDR para o mercado brasileiro: comparativo 2025 | SDR Extension",
  description:
    "Speedio, Neoway, Apollo, LinkedIn Sales Navigator, SDR Extension — qual ferramenta faz sentido para o mercado B2B brasileiro? Comparamos preço, cobertura de dados e produtividade.",
  keywords: [
    "ferramentas SDR Brasil",
    "ferramentas prospecção B2B Brasil",
    "Speedio alternativa",
    "Apollo Brasil",
    "LinkedIn Sales Navigator Brasil",
    "software prospecção B2B",
    "Neoway alternativa",
  ],
  openGraph: {
    title: "Ferramentas de SDR para o mercado brasileiro: comparativo 2025",
    description:
      "Speedio, Neoway, Apollo, LinkedIn Sales Navigator — qual faz sentido para o B2B brasileiro?",
    type: "article",
    locale: "pt_BR",
  },
};

const s = {
  page: {
    background: "#0f172a", minHeight: "100vh", color: "#f1f5f9",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    padding: "20px 24px", borderBottom: "1px solid #1e293b",
    display: "flex", justifyContent: "space-between", alignItems: "center",
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
    fontSize: 19, color: "#94a3b8", lineHeight: 1.7, marginBottom: 40,
    borderLeft: "3px solid #3b82f6", paddingLeft: 20,
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
  tableWrap: { overflowX: "auto" as const, marginBottom: 32 },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 14, minWidth: 600 },
  th: {
    background: "#1e293b", color: "#e2e8f0", fontWeight: 600,
    padding: "12px 16px", textAlign: "left" as const, border: "1px solid #334155",
  },
  td: {
    color: "#94a3b8", padding: "12px 16px",
    border: "1px solid #1e293b", verticalAlign: "top" as const,
  },
  tdHighlight: {
    color: "#60a5fa", padding: "12px 16px",
    border: "1px solid #1e293b", verticalAlign: "top" as const, fontWeight: 600,
  },
  badge: {
    display: "inline-block", borderRadius: 8, padding: "2px 8px",
    fontSize: 12, fontWeight: 600,
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
};

const tools = [
  {
    name: "SDR Extension",
    price: "Grátis / R$97 / R$247/mês",
    coverage: "Todas as empresas com CNPJ ativo",
    contact: "Via Apollo/Lusha (BYOK opcional)",
    ai: "Sim — mensagem personalizada",
    install: "30 segundos",
    highlight: true,
    pros: "Cobertura universal BR, CNPJ nativo, IA integrada, preço acessível",
    cons: "Contatos dependem de chave Apollo/Lusha",
  },
  {
    name: "Speedio",
    price: "R$300–2.000/mês",
    coverage: "Base proprietária (~15M empresas)",
    contact: "Sim — banco proprietário",
    ai: "Não",
    install: "Processo de onboarding",
    highlight: false,
    pros: "Boa cobertura de empresas médias e grandes, filtros avançados",
    cons: "Preço alto, sem acesso a API pública, dados podem estar desatualizados",
  },
  {
    name: "Neoway",
    price: "Sob consulta (R$5k+/mês)",
    coverage: "Completa — todos os CNPJs + PF",
    contact: "Sim — banco proprietário",
    ai: "Analytics, não geração",
    install: "Contrato enterprise",
    highlight: false,
    pros: "Dados mais completos do mercado, analytics avançado",
    cons: "Fora do alcance de PMEs e startups, onboarding longo",
  },
  {
    name: "Apollo.io",
    price: "US$49–99/mês (por usuário)",
    coverage: "EUA e global — Brasil limitado",
    contact: "Sim — 275M+ contatos global",
    ai: "Geração de e-mail",
    install: "Imediato",
    highlight: false,
    pros: "Melhor ferramenta para mercado americano, automação de e-mail",
    cons: "Dados de PMEs brasileiras escassos, planos em dólar",
  },
  {
    name: "LinkedIn Sales Navigator",
    price: "US$99+/mês (por usuário)",
    coverage: "Empresas com perfil no LinkedIn",
    contact: "Limitado a perfis públicos",
    ai: "Não",
    install: "Imediato",
    highlight: false,
    pros: "Ótimo para mid-market e enterprise, InMail eficaz",
    cons: "PMEs brasileiras têm baixa presença, sem dados de CNPJ, caro",
  },
];

export default function BlogPost3() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/blog" style={s.navLink}>← Blog</Link>
      </nav>

      <article style={s.article}>
        <div style={s.meta}>
          <span style={s.category}>Ferramentas</span>
          <span style={s.dateLine}>26 de novembro de 2024 · 12 min de leitura</span>
        </div>

        <h1 style={s.h1}>
          Ferramentas de SDR para o mercado brasileiro: comparativo completo 2025
        </h1>

        <p style={s.lead}>
          O mercado de ferramentas para prospecção B2B brasileira está fragmentado entre
          plataformas enterprise caras, ferramentas americanas com dados rasos sobre o Brasil
          e soluções caseiras em planilha. Este comparativo ajuda você a escolher a stack
          certa para o seu time — do MEI à scale-up.
        </p>

        <h2 style={s.h2}>O problema central: dados brasileiros vs. ferramentas americanas</h2>
        <p style={s.p}>
          A maioria das ferramentas de sales intelligence nasceu nos EUA para o mercado americano.
          Isso cria um problema estrutural para SDRs brasileiros: as bases de contatos cobertas
          são fracas para PMEs brasileiras, especialmente fora dos grandes centros.
        </p>
        <p style={s.p}>
          Ao mesmo tempo, as soluções brasileiras enterprise (Speedio, Neoway, Econodata) têm
          cobertura excelente mas preços incompatíveis com startups e times menores.
        </p>
        <p style={s.p}>
          O resultado é que a maioria dos SDRs brasileiros trabalha com:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Planilhas de leads compradas (dados velhos, sem personalização)</li>
          <li style={s.li}>LinkedIn manual (lento, caro em InMails)</li>
          <li style={s.li}>Google + site da empresa (15 minutos por prospect)</li>
        </ul>

        <h2 style={s.h2}>Comparativo das principais ferramentas</h2>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Ferramenta</th>
                <th style={s.th}>Preço</th>
                <th style={s.th}>Cobertura BR</th>
                <th style={s.th}>Contatos</th>
                <th style={s.th}>IA</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.name}>
                  <td style={tool.highlight ? s.tdHighlight : s.td}>
                    {tool.name}
                    {tool.highlight && (
                      <span
                        style={{
                          ...s.badge,
                          background: "#1e3a5f",
                          color: "#60a5fa",
                          marginLeft: 8,
                        }}
                      >
                        ESTE ARTIGO
                      </span>
                    )}
                  </td>
                  <td style={s.td}>{tool.price}</td>
                  <td style={s.td}>{tool.coverage}</td>
                  <td style={s.td}>{tool.contact}</td>
                  <td style={s.td}>{tool.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={s.h2}>Análise detalhada por ferramenta</h2>

        <h3 style={s.h3}>1. Speedio — melhor para times com budget</h3>
        <p style={s.p}>
          A Speedio é a opção brasileira mais completa para prospecção outbound. Com filtros
          por segmento, porte, região e maturidade digital da empresa, ela é ideal para times
          que precisam de volume qualificado.
        </p>
        <p style={s.p}>
          O problema é o preço: o plano inicial começa em R$300/mês e os planos com maior volume
          chegam a R$2.000/mês. Para startups ou SDRs individuais, isso é impeditivo. Além disso,
          a ferramenta não tem geração de mensagem por IA — você ainda precisa criar o template.
        </p>

        <h3 style={s.h3}>2. Neoway — enterprise, fora do alcance da maioria</h3>
        <p style={s.p}>
          A Neoway é a Rolls-Royce da inteligência comercial brasileira. Dados da Receita Federal,
          Serasa, IBGE e dezenas de outras fontes consolidadas em uma plataforma de analytics.
          É usada por grandes seguradoras, bancos e empresas que tomam decisões baseadas em
          risco de crédito e mercado.
        </p>
        <p style={s.p}>
          Para a maioria dos times de SDR, é inacessível — tanto em preço quanto em complexidade.
          Se você não tem uma equipe de dados interpretando os relatórios, o valor não se realiza.
        </p>

        <h3 style={s.h3}>3. Apollo.io — referência global, fraco no Brasil profundo</h3>
        <p style={s.p}>
          Apollo é provavelmente a melhor ferramenta de prospecção global do mundo. Base de
          275M+ contatos, sequências de e-mail automatizadas, integrações com CRM, scoring
          de leads — tudo funciona muito bem para o mercado americano e europeu.
        </p>
        <p style={s.p}>
          O problema para o mercado brasileiro: a cobertura de PMEs é fraca. Pesquise uma
          distribuidora de autopeças em Bauru ou uma clínica odontológica em Manaus — você
          provavelmente não vai encontrar nada. O Apollo é ótimo para empresas tech brasileiras
          com presença global, mas falha no mercado doméstico de PMEs.
        </p>

        <h3 style={s.h3}>4. LinkedIn Sales Navigator — indispensável para enterprise</h3>
        <p style={s.p}>
          Para ciclos de venda enterprise com decisores em C-suite, o Sales Navigator é
          insubstituível. InMails têm taxas de resposta muito maiores que e-mails frios, e
          os filtros de seniority e cargo são precisos.
        </p>
        <p style={s.p}>
          Para PMEs brasileiras — que representam 99% das empresas do país — a penetração
          do LinkedIn ainda é baixa. Um dono de padaria em Ribeirão Preto provavelmente não
          tem LinkedIn. O Sales Navigator não resolve esse problema.
        </p>

        <h3 style={s.h3}>5. SDR Extension — desenhada para o mercado brasileiro</h3>
        <p style={s.p}>
          A SDR Extension parte de um insight diferente: em vez de tentar cobrir dados de
          contato (onde as ferramentas americanas são fracas para o Brasil), ela usa a fonte
          de dados que tem cobertura universal: o CNPJ.
        </p>
        <p style={s.p}>
          Qualquer empresa brasileira ativa tem um CNPJ. Isso significa cobertura de 100%
          do mercado — MEI em cidades de interior incluído. A partir do CNPJ, a extensão:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Busca os dados da Receita Federal em tempo real (OpenCNPJ → BrasilAPI → ReceitaWS)</li>
          <li style={s.li}>Analisa CNAE, porte, capital e sócios</li>
          <li style={s.li}>Opcional: enriquece com contatos via Apollo ou Lusha (sua própria chave)</li>
          <li style={s.li}>Gera mensagem personalizada em português para WhatsApp ou e-mail</li>
        </ul>

        <div style={s.callout}>
          <p style={s.calloutTitle}>O modelo BYOK (Bring Your Own Key)</p>
          <p style={s.calloutText}>
            Um diferencial da SDR Extension é o modelo BYOK para enriquecimento de contatos.
            Em vez de cobrar pelo acesso a uma base própria (que inevitavelmente tem lacunas),
            você conecta sua própria chave Apollo ou Lusha. Isso significa que você paga pelo
            que já usa — sem duplicar custo — e mantém total controle dos dados.
          </p>
        </div>

        <h2 style={s.h2}>Qual ferramenta escolher? A decisão por perfil de time</h2>

        <div style={s.callout}>
          <p style={s.calloutTitle}>SDR individual ou time pequeno (&lt;5 pessoas)</p>
          <p style={s.calloutText}>
            <strong>Stack recomendada:</strong> SDR Extension (plano grátis ou Pro) + CRM gratuito
            (HubSpot free) + WhatsApp Business.<br /><br />
            Custo: R$0 a R$97/mês. Cobertura: todo o mercado brasileiro. Você não precisa mais
            do que isso para prospectar com qualidade.
          </p>
        </div>

        <div style={s.callout}>
          <p style={s.calloutTitle}>Time de vendas em crescimento (5–20 SDRs)</p>
          <p style={s.calloutText}>
            <strong>Stack recomendada:</strong> SDR Extension (plano Team) + Apollo Basic (para
            contatos de empresas maiores) + Pipedrive ou HubSpot Starter.<br /><br />
            Custo: R$247/mês (Extension) + US$49/usuário (Apollo) + CRM. Cobertura total
            com enriquecimento de contato para empresas mid-market.
          </p>
        </div>

        <div style={s.callout}>
          <p style={s.calloutTitle}>Enterprise com foco em grandes contas</p>
          <p style={s.calloutText}>
            <strong>Stack recomendada:</strong> Speedio ou Neoway (dados deep) + LinkedIn
            Sales Navigator (acesso a decisores C-suite) + Salesforce ou HubSpot Enterprise.<br /><br />
            Custo: R$2.000+/mês. Faz sentido quando o ticket médio justifica o investimento
            em ferramentas premium.
          </p>
        </div>

        <h2 style={s.h2}>O que nenhuma ferramenta resolve (ainda)</h2>
        <p style={s.p}>
          Dados e automação aumentam volume e qualidade da abordagem inicial. Mas nenhuma
          ferramenta resolve o gap de conversão que acontece na conversa — o rapport, a
          escuta ativa, o manejo de objeções. O melhor uso das ferramentas é liberar tempo
          do SDR para focar exatamente nisso: a interação humana que fecha negócio.
        </p>

        <div style={s.cta}>
          <p style={s.ctaTitle}>Comece com a SDR Extension gratuitamente</p>
          <p style={s.ctaText}>
            10 consultas de CNPJ por mês, sem cartão, sem burocracia.
            Veja por si mesmo a diferença de chegar a uma conversa com contexto real.
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
          Não existe uma ferramenta perfeita para prospecção B2B no Brasil — existe a
          ferramenta certa para cada perfil de time e mercado-alvo. Para a maioria dos
          SDRs brasileiros que trabalham com PMEs, a combinação de dados de CNPJ com
          geração de mensagem por IA entrega o melhor custo-benefício disponível hoje.
        </p>
        <p style={s.p}>
          Para times enterprise com foco em grandes contas, a combinação de Speedio
          (ou Neoway) com Sales Navigator continua sendo o padrão. O que muda é que
          agora existe uma alternativa acessível para quem está fora desse perfil.
        </p>
      </article>
    </div>
  );
}
