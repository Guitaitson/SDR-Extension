import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bases Legais LGPD — SDR Extension",
  description: "Documentação das bases legais utilizadas pela SDR Extension sob a Lei Geral de Proteção de Dados (LGPD).",
  robots: "noindex",
};

const s = {
  page: { background: "#0f172a", minHeight: "100vh", color: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  nav:  { padding: "20px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navLogo: { color: "#3b82f6", fontWeight: 800, fontSize: 18, textDecoration: "none" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: 14 },
  doc:  { maxWidth: 720, margin: "0 auto", padding: "56px 24px 100px" },
  h1:   { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: "#f1f5f9", marginBottom: 8 },
  date: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  lead: { fontSize: 15, color: "#94a3b8", lineHeight: 1.7, marginBottom: 40, borderLeft: "3px solid #3b82f6", paddingLeft: 18 },
  h2:   { fontSize: 20, fontWeight: 700, color: "#e2e8f0", marginTop: 40, marginBottom: 12 },
  h3:   { fontSize: 16, fontWeight: 600, color: "#cbd5e1", marginTop: 24, marginBottom: 8 },
  p:    { fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 14 },
  ul:   { paddingLeft: 22, marginBottom: 14 },
  li:   { fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 6 },
  divider: { border: "none", borderTop: "1px solid #1e293b", margin: "36px 0" },
  a:    { color: "#60a5fa" },
  callout: { background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "18px 22px", margin: "20px 0" },
  calloutTitle: { fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 6 },
  calloutText:  { fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 14, marginBottom: 24 },
  th: { background: "#1e293b", color: "#e2e8f0", fontWeight: 600, padding: "10px 14px", textAlign: "left" as const, border: "1px solid #334155" },
  td: { color: "#94a3b8", padding: "10px 14px", border: "1px solid #1e293b", verticalAlign: "top" as const },
};

export default function LGPDPage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/" style={s.navLink}>← Início</Link>
      </nav>

      <div style={s.doc}>
        <h1 style={s.h1}>Bases Legais LGPD</h1>
        <p style={s.date}>Avaliação de Impacto e Bases Legais — fevereiro de 2025</p>

        <p style={s.lead}>
          Este documento descreve as bases legais que fundamentam o tratamento de dados pela
          SDR Extension, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).
          Consulte também nossa <Link href="/privacidade" style={s.a}>Política de Privacidade</Link>.
        </p>

        <h2 style={s.h2}>1. Natureza dos dados tratados</h2>

        <h3 style={s.h3}>1.1 Dados públicos de CNPJ (não-pessoais para PJ)</h3>
        <p style={s.p}>
          Os dados de pessoas jurídicas (SA, Ltda, SS, etc.) disponibilizados pela Receita Federal
          via CNPJ <strong>não são dados pessoais</strong> no sentido da LGPD, pois se referem a
          entidades jurídicas e não a pessoas físicas identificadas ou identificáveis.
          São tornados públicos voluntariamente pelo Estado sob a Lei de Acesso à Informação
          (LAI — Lei 12.527/2011), que assegura sua disponibilização irrestrita.
        </p>

        <div style={s.callout}>
          <p style={s.calloutTitle}>Fundamento: LGPD Art. 5º, I</p>
          <p style={s.calloutText}>
            &ldquo;Dado pessoal: informação relacionada a pessoa natural identificada ou identificável.&rdquo;
            Dados cadastrais de CNPJ referem-se à pessoa jurídica, não à pessoa natural —
            portanto, estão fora do escopo da LGPD, exceto nas situações do item 1.2 abaixo.
          </p>
        </div>

        <h3 style={s.h3}>1.2 Dados de MEI e EI (pessoais)</h3>
        <p style={s.p}>
          Microempreendedores Individuais (MEI) e Empresários Individuais (EI) registram o CPF
          do titular no CNPJ, tornando esses dados pessoais nos termos da LGPD. A SDR Extension:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Identifica automaticamente CNPJs de MEI/EI na consulta</li>
          <li style={s.li}>Sinaliza esses casos na interface ao usuário</li>
          <li style={s.li}>Não armazena no histórico campos que permitam identificação direta do titular (nome completo do sócio é armazenado apenas como parte do JSON da Receita Federal, não separadamente)</li>
          <li style={s.li}>Aplica base legal de legítimo interesse para prospecção B2B (ver item 3)</li>
        </ul>

        <h2 style={s.h2}>2. Mapeamento de tratamentos e bases legais</h2>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Tratamento</th>
              <th style={s.th}>Dado tratado</th>
              <th style={s.th}>Base legal (LGPD)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Autenticação via magic link", "E-mail do usuário", "Art. 7º, V — Execução de contrato"],
              ["Consulta de CNPJ na Receita Federal", "CNPJ (dado público PJ)", "Art. 7º, VI — Exercício regular de direitos; LAI"],
              ["Consulta de MEI/EI na Receita Federal", "CNPJ + dados do titular (PF)", "Art. 7º, IX — Legítimo interesse (prospecção B2B)"],
              ["Geração de mensagem por IA", "Briefing da empresa (sem PII do usuário)", "Art. 7º, V — Execução de contrato"],
              ["Armazenamento de histórico de consultas", "CNPJ + resumo + data", "Art. 7º, V — Execução de contrato"],
              ["Armazenamento de chaves BYOK", "Chave API (criptografada)", "Art. 7º, V — Execução de contrato"],
              ["Analytics de uso", "Eventos anonimizados", "Art. 7º, IX — Legítimo interesse (melhoria do produto)"],
              ["Comunicação de produto (e-mail)", "E-mail do usuário", "Art. 7º, V — Execução de contrato / Art. 7º, I — Consentimento (marketing)"],
              ["Processamento de pagamento", "Dados de faturamento", "Art. 7º, V — Execução de contrato (via Lemon Squeezy)"],
            ].map(([tratamento, dado, base]) => (
              <tr key={tratamento}>
                <td style={s.td}>{tratamento}</td>
                <td style={s.td}>{dado}</td>
                <td style={s.td}>{base}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={s.h2}>3. Avaliação de Legítimo Interesse (LIA) — prospecção B2B</h2>
        <p style={s.p}>
          Para o tratamento de dados de MEI/EI com finalidade de prospecção comercial B2B,
          realizamos o Teste de Três Etapas conforme orientação da ANPD:
        </p>

        <h3 style={s.h3}>3.1 Finalidade legítima</h3>
        <p style={s.p}>
          A prospecção B2B é uma atividade comercial legítima, amplamente aceita e regulamentada.
          Microempreendedores que registram CNPJs estão, em sua maioria, buscando clientes e
          parceiros comerciais — o contato de prospecção está alinhado com a expectativa razoável
          do titular ao abrir um negócio. Analogia: dados disponíveis em listas telefônicas
          comerciais e catálogos empresariais sempre foram utilizados para esse fim.
        </p>

        <h3 style={s.h3}>3.2 Necessidade</h3>
        <p style={s.p}>
          Usamos apenas os dados estritamente necessários: denominação, CNAE, porte, município e
          quadro societário (quando disponível). Não cruzamos com dados de redes sociais,
          comportamento de navegação ou dados sensíveis. A geração de mensagem pela IA usa
          somente o briefing empresarial, sem identificação pessoal do SDR usuário.
        </p>

        <h3 style={s.h3}>3.3 Balanceamento</h3>
        <p style={s.p}>Os interesses do titular (MEI/EI) são considerados através das seguintes salvaguardas:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Opt-out fácil:</strong> Qualquer destinatário pode solicitar a retirada de suas informações enviando e-mail para <a href="mailto:privacidade@sdrextension.com.br" style={s.a}>privacidade@sdrextension.com.br</a></li>
          <li style={s.li}><strong>Sem perfilamento invasivo:</strong> Não cruzamos dados de CNPJ com dados comportamentais ou sensíveis</li>
          <li style={s.li}><strong>Contexto B2B:</strong> O contato é direcionado à atividade empresarial do MEI, não à vida pessoal do titular</li>
          <li style={s.li}><strong>Dados públicos:</strong> Todos os dados utilizados já estão disponíveis publicamente pela Receita Federal</li>
          <li style={s.li}><strong>Transparência:</strong> Esta documentação é pública e acessível a qualquer titular</li>
        </ul>

        <div style={s.callout}>
          <p style={s.calloutTitle}>Conclusão da LIA</p>
          <p style={s.calloutText}>
            O tratamento de dados de MEI/EI para prospecção B2B via SDR Extension é sustentado
            pelo legítimo interesse (LGPD Art. 7º, IX), com salvaguardas adequadas para balancear
            os direitos dos titulares. O interesse na prospecção comercial não sobrepõe direitos
            fundamentais ou liberdades dos titulares, dado o contexto empresarial dos dados e
            as salvaguardas implementadas.
          </p>
        </div>

        <h2 style={s.h2}>4. Transferência internacional de dados</h2>
        <p style={s.p}>
          Alguns de nossos fornecedores (Supabase — AWS us-east-1, OpenRouter, PostHog) processam
          dados em servidores fora do Brasil. Essas transferências são realizadas com base no
          Art. 33 da LGPD, especificamente:
        </p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Supabase / AWS:</strong> Padrões adequados de proteção reconhecidos internacionalmente (SOC 2, ISO 27001)</li>
          <li style={s.li}><strong>OpenRouter / OpenAI:</strong> Cláusulas contratuais padrão equivalentes às SCCs europeias</li>
          <li style={s.li}><strong>PostHog:</strong> Opção de hospedagem EU disponível; dados anonimizados antes do envio</li>
        </ul>

        <h2 style={s.h2}>5. Direitos dos titulares — procedimento</h2>
        <p style={s.p}>
          Titulares que desejam exercer seus direitos (incluindo MEIs/EIs que foram prospectados
          por usuários da SDR Extension) podem contatar:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>E-mail: <a href="mailto:privacidade@sdrextension.com.br" style={s.a}>privacidade@sdrextension.com.br</a></li>
          <li style={s.li}>Assunto: &ldquo;Exercício de Direitos LGPD&rdquo;</li>
          <li style={s.li}>Prazo de resposta: até 15 dias corridos</li>
          <li style={s.li}>Identificação necessária: nome, CNPJ/CPF e descrição do pedido</li>
        </ul>

        <h2 style={s.h2}>6. Revisão e atualização</h2>
        <p style={s.p}>
          Esta avaliação é revisada anualmente ou sempre que houver mudança significativa
          nos tratamentos de dados, na legislação aplicável ou em orientações da ANPD.
          Última revisão: fevereiro de 2025.
        </p>

        <hr style={s.divider} />
        <p style={{ ...s.p, fontSize: 13 }}>
          Este documento foi elaborado com base nas diretrizes da ANPD e nas orientações do
          GT-RH da LGPD. Não constitui aconselhamento jurídico. Para situações específicas,
          consulte um advogado especializado em proteção de dados.
        </p>
      </div>
    </div>
  );
}
