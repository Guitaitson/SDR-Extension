import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — SDR Extension",
  description: "Política de privacidade da SDR Extension. Saiba como coletamos, usamos e protegemos seus dados.",
  robots: "noindex",
};

const s = {
  page: { background: "#0f172a", minHeight: "100vh", color: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  nav:  { padding: "20px 24px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navLogo: { color: "#3b82f6", fontWeight: 800, fontSize: 18, textDecoration: "none" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: 14 },
  doc:  { maxWidth: 720, margin: "0 auto", padding: "56px 24px 100px" },
  h1:   { fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: "#f1f5f9", marginBottom: 8 },
  date: { fontSize: 13, color: "#64748b", marginBottom: 40 },
  h2:   { fontSize: 20, fontWeight: 700, color: "#e2e8f0", marginTop: 40, marginBottom: 12 },
  p:    { fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16 },
  ul:   { paddingLeft: 22, marginBottom: 16 },
  li:   { fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 6 },
  divider: { border: "none", borderTop: "1px solid #1e293b", margin: "36px 0" },
  a:    { color: "#60a5fa" },
};

export default function PrivacidadePage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/" style={s.navLink}>← Início</Link>
      </nav>

      <div style={s.doc}>
        <h1 style={s.h1}>Política de Privacidade</h1>
        <p style={s.date}>Última atualização: fevereiro de 2025</p>

        <p style={s.p}>
          Esta Política de Privacidade descreve como a <strong>SDR Extension</strong> (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo;)
          coleta, usa e protege as informações dos usuários (&ldquo;você&rdquo;) ao utilizar nossa extensão Chrome
          e site. Ao usar a SDR Extension, você concorda com as práticas descritas aqui.
        </p>

        <hr style={s.divider} />

        <h2 style={s.h2}>1. Dados que coletamos</h2>

        <p style={s.p}><strong>1.1 Dados fornecidos por você</strong></p>
        <ul style={s.ul}>
          <li style={s.li}>Endereço de e-mail (para autenticação via magic link)</li>
          <li style={s.li}>Chaves de API de terceiros (Apollo.io, Lusha, OpenRouter) quando você opta pelo modelo BYOK — armazenadas de forma criptografada</li>
        </ul>

        <p style={s.p}><strong>1.2 Dados coletados automaticamente</strong></p>
        <ul style={s.ul}>
          <li style={s.li}>CNPJs consultados e metadados das consultas (data, horário, resultado resumido) — para histórico e controle de uso</li>
          <li style={s.li}>Eventos de uso anônimos: cópias de mensagem, cliques em upgrade, visualizações de tela — para análise de produto</li>
          <li style={s.li}>Endereço IP e identificador de sessão — para segurança e prevenção de abuso</li>
        </ul>

        <p style={s.p}><strong>1.3 Dados que não coletamos</strong></p>
        <ul style={s.ul}>
          <li style={s.li}>Conteúdo das abas abertas no navegador</li>
          <li style={s.li}>Histórico de navegação</li>
          <li style={s.li}>Dados de cookies de terceiros</li>
          <li style={s.li}>Informações de cartão de crédito (processado diretamente pelo Lemon Squeezy)</li>
        </ul>

        <h2 style={s.h2}>2. Como usamos os dados</h2>
        <ul style={s.ul}>
          <li style={s.li}>Prestar o serviço: autenticação, consultas de CNPJ, geração de mensagens com IA</li>
          <li style={s.li}>Controlar cotas de uso conforme o plano contratado</li>
          <li style={s.li}>Melhorar o produto com base em padrões de uso agregados e anonimizados</li>
          <li style={s.li}>Comunicar atualizações relevantes do serviço por e-mail (sem marketing sem opt-in)</li>
          <li style={s.li}>Cumprir obrigações legais</li>
        </ul>

        <h2 style={s.h2}>3. Base legal (LGPD)</h2>
        <p style={s.p}>
          Processamos seus dados com base nas seguintes bases legais previstas na
          Lei Geral de Proteção de Dados (Lei 13.709/2018):
        </p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Execução de contrato</strong> (Art. 7º, V): dados necessários para prestar o serviço contratado</li>
          <li style={s.li}><strong>Legítimo interesse</strong> (Art. 7º, IX): análise de uso para melhoria do produto</li>
          <li style={s.li}><strong>Consentimento</strong> (Art. 7º, I): comunicações de marketing (quando explicitamente autorizado)</li>
        </ul>
        <p style={s.p}>
          Os dados de CNPJ consultados são informações públicas disponibilizadas pela Receita Federal
          sob a Lei de Acesso à Informação (Lei 12.527/2011) e não constituem dados pessoais no
          contexto de prospecção B2B — exceto dados de MEI/EI, que são tratados com restrições adicionais.
          Para mais detalhes, veja nossa{" "}
          <Link href="/lgpd" style={s.a}>Documentação LGPD completa</Link>.
        </p>

        <h2 style={s.h2}>4. Compartilhamento de dados</h2>
        <p style={s.p}>Não vendemos seus dados. Compartilhamos apenas com:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong>Supabase</strong>: banco de dados e autenticação (servidores na AWS us-east-1)</li>
          <li style={s.li}><strong>OpenRouter / OpenAI</strong>: geração de mensagens com IA (somente o briefing da empresa, sem dados pessoais do usuário)</li>
          <li style={s.li}><strong>Lemon Squeezy</strong>: processamento de pagamentos</li>
          <li style={s.li}><strong>Apollo.io / Lusha</strong>: enriquecimento de contatos — somente quando você fornece sua própria chave (BYOK); a requisição passa pelo nosso backend e a chave fica criptografada</li>
          <li style={s.li}><strong>PostHog</strong>: analytics de produto (dados anonimizados)</li>
        </ul>
        <p style={s.p}>Todos os fornecedores estão sujeitos a acordos de processamento de dados compatíveis com a LGPD.</p>

        <h2 style={s.h2}>5. Retenção de dados</h2>
        <ul style={s.ul}>
          <li style={s.li}>Dados de conta: mantidos enquanto a conta estiver ativa + 12 meses após cancelamento</li>
          <li style={s.li}>Histórico de consultas: 12 meses retroativos (plano Pro/Team); 30 dias (plano Free)</li>
          <li style={s.li}>Cache de CNPJ: 30 dias (dados públicos; renovados automaticamente)</li>
          <li style={s.li}>Logs de segurança: 90 dias</li>
        </ul>

        <h2 style={s.h2}>6. Seus direitos</h2>
        <p style={s.p}>Como titular de dados, você tem direito a:</p>
        <ul style={s.ul}>
          <li style={s.li}>Confirmar se tratamos seus dados e acessar uma cópia</li>
          <li style={s.li}>Corrigir dados incompletos ou incorretos</li>
          <li style={s.li}>Solicitar a exclusão de dados (direito ao esquecimento)</li>
          <li style={s.li}>Revogar consentimento para comunicações de marketing</li>
          <li style={s.li}>Portar seus dados para outro serviço</li>
          <li style={s.li}>Se opor a tratamentos baseados em legítimo interesse</li>
        </ul>
        <p style={s.p}>
          Para exercer qualquer direito, envie um e-mail para{" "}
          <a href="mailto:privacidade@sdrextension.com.br" style={s.a}>
            privacidade@sdrextension.com.br
          </a>{" "}
          com o assunto &ldquo;Exercício de Direitos LGPD&rdquo;. Respondemos em até 15 dias.
        </p>

        <h2 style={s.h2}>7. Segurança</h2>
        <ul style={s.ul}>
          <li style={s.li}>Comunicações criptografadas via TLS/HTTPS</li>
          <li style={s.li}>Chaves BYOK criptografadas com pgcrypto (AES-256) antes de armazenar</li>
          <li style={s.li}>Row Level Security (RLS) no banco: cada usuário acessa apenas seus próprios dados</li>
          <li style={s.li}>Autenticação via magic link (sem senhas armazenadas)</li>
          <li style={s.li}>Auditorias de segurança periódicas</li>
        </ul>

        <h2 style={s.h2}>8. Cookies e armazenamento local</h2>
        <p style={s.p}>
          A extensão usa <code>chrome.storage.local</code> para armazenar a sessão de autenticação
          localmente no seu dispositivo. O site usa cookies de sessão estritamente necessários
          para autenticação. Não usamos cookies de rastreamento ou publicidade.
        </p>

        <h2 style={s.h2}>9. Alterações nesta política</h2>
        <p style={s.p}>
          Podemos atualizar esta política periodicamente. Notificaremos por e-mail sobre mudanças
          materiais com pelo menos 15 dias de antecedência. O uso continuado do serviço após a
          notificação constitui aceitação das alterações.
        </p>

        <h2 style={s.h2}>10. Contato</h2>
        <p style={s.p}>
          <strong>Encarregado de Proteção de Dados (DPO):</strong><br />
          SDR Extension<br />
          <a href="mailto:privacidade@sdrextension.com.br" style={s.a}>privacidade@sdrextension.com.br</a>
        </p>
      </div>
    </div>
  );
}
