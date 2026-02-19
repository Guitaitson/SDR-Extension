import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inside Sales no Brasil: por que 72% dos times perdem meta e como reverter | SDR Extension",
  description:
    "O mercado de inside sales brasileiro tem peculiaridades que as metodologias importadas ignoram. Descubra o que os melhores SDRs brasileiros fazem diferente — e como replicar.",
  keywords: [
    "inside sales Brasil",
    "SDR Brasil",
    "vendas internas Brasil",
    "como bater meta vendas",
    "prospecção B2B Brasil",
    "metodologia vendas Brasil",
  ],
  openGraph: {
    title: "Inside Sales no Brasil: por que 72% dos times perdem meta e como reverter",
    description:
      "O mercado de inside sales brasileiro tem peculiaridades que as metodologias importadas ignoram.",
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
  ol: { paddingLeft: 24, marginBottom: 20 },
  li: { fontSize: 16, color: "#94a3b8", lineHeight: 1.8, marginBottom: 8 },
  callout: {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 12,
    padding: "24px 28px", margin: "32px 0",
  },
  calloutTitle: { fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 },
  calloutText: { fontSize: 15, color: "#94a3b8", lineHeight: 1.7, margin: 0 },
  stat: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16, margin: "32px 0",
  },
  statCard: {
    background: "#1e293b", border: "1px solid #334155", borderRadius: 12,
    padding: "20px 24px", textAlign: "center" as const,
  },
  statNum: { fontSize: 36, fontWeight: 800, color: "#3b82f6", display: "block", marginBottom: 6 },
  statLabel: { fontSize: 13, color: "#64748b", lineHeight: 1.4 },
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

export default function BlogPost2() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/blog" style={s.navLink}>← Blog</Link>
      </nav>

      <article style={s.article}>
        <div style={s.meta}>
          <span style={s.category}>Inside Sales</span>
          <span style={s.dateLine}>3 de dezembro de 2024 · 10 min de leitura</span>
        </div>

        <h1 style={s.h1}>
          Inside Sales no Brasil: por que 72% dos times perdem meta e como reverter
        </h1>

        <p style={s.lead}>
          O modelo de inside sales chegou ao Brasil carregado de frameworks americanos — SPIN,
          MEDDIC, Challenger Sale. Todos funcionam. Mas nenhum foi desenhado para o mercado
          brasileiro, onde relacionamento vale mais que processo e onde o WhatsApp derruba o
          e-mail com folga. Este artigo desmonta os mitos e mostra o que os melhores SDRs
          brasileiros realmente fazem.
        </p>

        <div style={s.stat}>
          {[
            { num: "72%", label: "dos times de vendas B2B brasileiros não batem meta (RD Station 2024)" },
            { num: "47%", label: "dos SDRs relatam falta de dados qualificados como principal obstáculo" },
            { num: "10–15min", label: "é o tempo médio gasto pesquisando um prospect manualmente" },
            { num: "3,2x", label: "mais chances de converter quando a abordagem é personalizada com dados da empresa" },
          ].map((item) => (
            <div key={item.num} style={s.statCard}>
              <span style={s.statNum}>{item.num}</span>
              <span style={s.statLabel}>{item.label}</span>
            </div>
          ))}
        </div>

        <h2 style={s.h2}>O problema real: não é falta de técnica, é falta de contexto</h2>
        <p style={s.p}>
          Quando perguntamos para times de SDR o que os impede de converter mais, a resposta
          mais comum não é &ldquo;não sei fazer rapport&rdquo; nem &ldquo;meu pitch está errado&rdquo;. É:
          <strong> &ldquo;Não sei o suficiente sobre a empresa antes de ligar.&rdquo;</strong>
        </p>
        <p style={s.p}>
          Sem contexto, a abordagem vira cold call genérico. E no mercado brasileiro — onde o
          decisor recebe dezenas de tentativas de contato por semana — o genérico vai direto
          para o lixo.
        </p>
        <p style={s.p}>
          O paradoxo é que o Brasil tem uma das melhores fontes públicas de dados empresariais
          do mundo: o cadastro da Receita Federal, acessível via CNPJ. Mas a maioria dos SDRs
          não sabe usar esses dados de forma sistemática.
        </p>

        <h2 style={s.h2}>5 peculiaridades do mercado B2B brasileiro que os frameworks americanos ignoram</h2>

        <h3 style={s.h3}>1. WhatsApp é canal de negócios, não de spam</h3>
        <p style={s.p}>
          No Brasil, o WhatsApp tem penetração de 99% entre smartphone users. Decisores de PMEs
          respondem mensagens de texto mais rápido do que e-mails — e esperam que fornecedores
          usem o canal. Ignorar o WhatsApp em inside sales brasileiro é perder a principal
          janela de acesso.
        </p>
        <p style={s.p}>
          Isso não significa mandar mensagem sem permissão. Significa que, após um primeiro
          contato por e-mail ou telefone, oferecer continuar a conversa pelo WhatsApp acelera
          drasticamente o ciclo.
        </p>

        <h3 style={s.h3}>2. O ciclo de vendas é mais longo em empresas familiares</h3>
        <p style={s.p}>
          A maioria das PMEs brasileiras é de controle familiar. Isso significa que decisões
          financeiras envolvem confiança pessoal — não só ROI. Um SDR que entende isso não
          tenta &ldquo;fechar&rdquo; na terceira ligação; investe em construir relação antes de pedir
          o compromisso.
        </p>

        <h3 style={s.h3}>3. O decisor raramente tem o título que você espera</h3>
        <p style={s.p}>
          Em uma empresa americana de 50 funcionários, o &ldquo;Head of Operations&rdquo; provavelmente
          tem poder de compra. No Brasil, o mesmo cargo pode ter zero autonomia orçamentária —
          ou a decisão pode estar com um sócio que tem título de &ldquo;Diretor Administrativo&rdquo;
          mas que na prática é o dono. Pesquisar o quadro societário via CNPJ dá uma vantagem
          enorme.
        </p>

        <h3 style={s.h3}>4. Nota fiscal e CNPJ são gatilhos de confiança</h3>
        <p style={s.p}>
          Mencionar que você pesquisou o CNPJ da empresa do prospect — naturalmente, sem ser
          invasivo — sinaliza profissionalismo. No Brasil, isso é um diferencial: mostra que
          você fez lição de casa e que está falando com a empresa certa.
        </p>

        <h3 style={s.h3}>5. Sazonalidade regional importa mais do que ciclo fiscal</h3>
        <p style={s.p}>
          Uma empresa de turismo em Fortaleza tem sazonalidade diferente de uma em Gramado.
          Uma empresa de açaí no Norte tem dinâmica de caixa diferente de uma no Sul. SDRs
          que adaptam o timing da abordagem à sazonalidade do setor e da região têm taxas de
          conversão significativamente maiores.
        </p>

        <h2 style={s.h2}>O que os top 10% dos SDRs brasileiros fazem diferente</h2>
        <p style={s.p}>
          Analisamos o comportamento de SDRs de alta performance em startups e scale-ups
          brasileiras. O padrão que emerge é consistente:
        </p>

        <div style={s.callout}>
          <p style={s.calloutTitle}>O protocolo dos top performers</p>
          <p style={s.calloutText}>
            <strong>Antes do contato:</strong> Pesquisa de 3 minutos — CNPJ, CNAE, porte, data de abertura, sócios.<br /><br />
            <strong>No primeiro contato:</strong> Referência específica à empresa (&ldquo;vi que vocês atuam em [CNAE]...&rdquo;).<br /><br />
            <strong>Canal:</strong> E-mail de apresentação + LinkedIn + WhatsApp no mesmo dia.<br /><br />
            <strong>Follow-up:</strong> 5–7 tentativas ao longo de 2 semanas antes de mover para &ldquo;nurturing&rdquo;.<br /><br />
            <strong>CRM:</strong> Registro imediato após cada interação, com contexto — não só &ldquo;ligação realizada&rdquo;.
          </p>
        </div>

        <h2 style={s.h2}>Como estruturar uma cadência de prospecção para o mercado brasileiro</h2>
        <ol style={s.ol}>
          <li style={s.li}>
            <strong>Dia 1 — E-mail de abertura personalizado:</strong> Referência ao CNPJ/setor,
            proposta de valor clara, uma pergunta aberta no final.
          </li>
          <li style={s.li}>
            <strong>Dia 2 — LinkedIn:</strong> Curtir ou comentar um post recente do prospect
            (se houver), depois enviar InMail ou conexão com nota breve.
          </li>
          <li style={s.li}>
            <strong>Dia 4 — Ligação + voicemail:</strong> Ligue cedo (8h–9h) ou tarde (17h–18h).
            Se cair em voicemail, deixe mensagem de 20 segundos mencionando o e-mail.
          </li>
          <li style={s.li}>
            <strong>Dia 6 — E-mail de follow-up:</strong> Diferente do primeiro — pode ser um
            case study do setor ou um insight sobre o mercado do prospect.
          </li>
          <li style={s.li}>
            <strong>Dia 9 — WhatsApp (se tiver o número):</strong> Mensagem curta, direta.
            &ldquo;Oi [Nome], mandei um e-mail semana passada sobre [proposta]. Você conseguiu ver?&rdquo;
          </li>
          <li style={s.li}>
            <strong>Dia 13 — E-mail de break-up:</strong> Tom final, deixa a porta aberta.
            &ldquo;Vou assumir que o momento não é ideal agora. Se mudar, é só falar.&rdquo;
          </li>
        </ol>

        <h2 style={s.h2}>Métricas que realmente importam para SDRs no Brasil</h2>
        <p style={s.p}>
          Muitos times medem volume (ligações feitas, e-mails enviados) em vez de resultado
          (reuniões realizadas, oportunidades geradas). As métricas que importam:
        </p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Taxa de abertura de e-mail:</strong> Benchmark saudável: &gt;40% (média Brasil em vendas)</li>
          <li style={s.li}><strong>Taxa de resposta:</strong> &gt;8% indica personalização adequada</li>
          <li style={s.li}><strong>Reuniões agendadas / prospects abordados:</strong> Top performers chegam a 15–20%</li>
          <li style={s.li}><strong>Show rate (reuniões realizadas / agendadas):</strong> Manter acima de 70% exige confirmações</li>
          <li style={s.li}><strong>Tempo médio de resposta para leads inbound:</strong> &lt;5 minutos é o padrão de ouro</li>
        </ul>

        <h2 style={s.h2}>A armadilha da ferramenta americana</h2>
        <p style={s.p}>
          Apollo.io, Outreach, Salesloft — são ferramentas excelentes. Mas foram desenhadas
          para o mercado americano, com dados americanos. Quando um SDR brasileiro tenta
          encontrar contatos de PMEs em Campinas, Belém ou Florianópolis nessas ferramentas,
          a cobertura é fraca ou inexistente.
        </p>
        <p style={s.p}>
          O caminho mais eficiente para o mercado brasileiro é combinar dados públicos do
          CNPJ (cobertura universal) com enriquecimento de contatos (Apollo/Lusha para
          empresas maiores) e IA para gerar a mensagem personalizada. É exatamente esse
          fluxo que a SDR Extension automatiza.
        </p>

        <div style={s.cta}>
          <p style={s.ctaTitle}>SDR Extension — feita para o mercado brasileiro</p>
          <p style={s.ctaText}>
            Cole o CNPJ e receba briefing + mensagem personalizada em 15 segundos.
            10 consultas gratuitas por mês, sem cartão.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
            style={s.ctaBtn}
          >
            Instalar grátis no Chrome
          </a>
        </div>

        <h2 style={s.h2}>Conclusão</h2>
        <p style={s.p}>
          Inside sales no Brasil não é inside sales americano com sotaque. É um modelo de
          vendas que precisa respeitar a cultura de relacionamento, os canais nativos
          (WhatsApp), a estrutura das empresas (familiares, com sócios ativos) e os dados
          disponíveis publicamente (CNPJ, Receita Federal).
        </p>
        <p style={s.p}>
          Os 28% de SDRs que batem meta consistentemente não têm um script melhor — têm
          contexto melhor antes de cada abordagem. E no mercado brasileiro, o melhor contexto
          começa com um CNPJ.
        </p>
      </article>
    </div>
  );
}
