import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — SDR Extension",
  description: "Termos de uso da SDR Extension. Leia antes de usar o serviço.",
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

export default function TermosPage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>SDR Extension</Link>
        <Link href="/" style={s.navLink}>← Início</Link>
      </nav>

      <div style={s.doc}>
        <h1 style={s.h1}>Termos de Uso</h1>
        <p style={s.date}>Última atualização: fevereiro de 2025</p>

        <p style={s.p}>
          Estes Termos de Uso regulam o acesso e uso da extensão Chrome e dos serviços web
          da <strong>SDR Extension</strong>. Ao instalar a extensão ou criar uma conta, você
          concorda integralmente com estes termos. Se não concordar, não use o serviço.
        </p>

        <hr style={s.divider} />

        <h2 style={s.h2}>1. O serviço</h2>
        <p style={s.p}>
          A SDR Extension é uma ferramenta de inteligência de prospecção B2B que consulta dados
          públicos de CNPJ da Receita Federal, opcionalmente enriquece com dados de contato via
          APIs de terceiros, e utiliza inteligência artificial para gerar mensagens de prospecção
          personalizadas.
        </p>
        <p style={s.p}>
          Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer funcionalidade
          a qualquer momento, com aviso prévio razoável aos usuários pagantes.
        </p>

        <h2 style={s.h2}>2. Elegibilidade e conta</h2>
        <ul style={s.ul}>
          <li style={s.li}>Você deve ter ao menos 18 anos para usar o serviço</li>
          <li style={s.li}>É responsável por manter a confidencialidade de suas credenciais de acesso</li>
          <li style={s.li}>Uma conta por pessoa física ou CNPJ; contas compartilhadas são permitidas apenas no plano Team</li>
          <li style={s.li}>Você é responsável por todas as atividades realizadas em sua conta</li>
        </ul>

        <h2 style={s.h2}>3. Uso aceitável</h2>
        <p style={s.p}>Você concorda em usar o serviço apenas para fins legítimos de prospecção comercial B2B. É expressamente proibido:</p>
        <ul style={s.ul}>
          <li style={s.li}>Usar o serviço para assédio, spam em massa ou comunicações não solicitadas sem base legal</li>
          <li style={s.li}>Tentar contornar limites de uso ou sistemas de autenticação</li>
          <li style={s.li}>Revender, sublicenciar ou disponibilizar o serviço a terceiros sem autorização</li>
          <li style={s.li}>Usar automação para realizar mais consultas do que o plano permite</li>
          <li style={s.li}>Criar múltiplas contas gratuitas para burlar os limites do plano Free</li>
          <li style={s.li}>Usar os dados gerados para discriminação, perfilamento ilegal ou qualquer finalidade contrária à LGPD</li>
        </ul>

        <h2 style={s.h2}>4. Planos e pagamentos</h2>
        <p style={s.p}><strong>Plano Free:</strong> 10 consultas por mês, sem cobrança. Limites podem ser alterados com 30 dias de aviso.</p>
        <p style={s.p}><strong>Planos pagos (Pro e Team):</strong> Cobrados mensalmente via Lemon Squeezy. O valor é debitado no início de cada ciclo. Cancelamento pode ser feito a qualquer momento; o acesso ao plano pago permanece até o fim do período já pago.</p>
        <p style={s.p}><strong>Reembolsos:</strong> Oferecemos reembolso integral nos primeiros 7 dias após a primeira assinatura, mediante solicitação por e-mail. Após esse período, não há reembolso proporcional por período não utilizado.</p>
        <p style={s.p}><strong>Alterações de preço:</strong> Comunicaremos por e-mail com 30 dias de antecedência. O novo preço se aplica no próximo ciclo de renovação.</p>

        <h2 style={s.h2}>5. Dados de CNPJ e conformidade</h2>
        <p style={s.p}>
          Os dados de CNPJ são públicos e disponibilizados pela Receita Federal sob a
          Lei de Acesso à Informação (Lei 12.527/2011). Você é responsável por usar esses
          dados em conformidade com a LGPD, o Código de Defesa do Consumidor e demais
          legislações aplicáveis à sua atividade de prospecção.
        </p>
        <p style={s.p}>
          Dados de MEI (Microempreendedor Individual) e EI (Empresário Individual) podem
          conter dados pessoais do titular. Seu uso para prospecção deve observar a base
          legal de legítimo interesse e respeitar direitos de opt-out dos titulares.
        </p>

        <h2 style={s.h2}>6. BYOK — Chaves de API de terceiros</h2>
        <p style={s.p}>
          Se você conectar chaves de API próprias (Apollo.io, Lusha, OpenRouter), você:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Confirma ter os direitos de uso para a finalidade de prospecção B2B</li>
          <li style={s.li}>É responsável pelo cumprimento dos termos de uso das respectivas plataformas</li>
          <li style={s.li}>Entende que os custos de uso dessas APIs são cobrados diretamente pelas plataformas na sua chave</li>
          <li style={s.li}>Autoriza a SDR Extension a armazenar sua chave de forma criptografada e a usá-la somente para suas próprias consultas</li>
        </ul>

        <h2 style={s.h2}>7. Propriedade intelectual</h2>
        <p style={s.p}>
          O código-fonte da extensão está disponível sob licença MIT (veja o repositório GitHub).
          As marcas, logotipo e identidade visual da SDR Extension são de propriedade exclusiva
          dos mantenedores. O conteúdo gerado pela IA (mensagens de prospecção) pertence a você
          e pode ser usado livremente para fins comerciais.
        </p>

        <h2 style={s.h2}>8. Limitação de responsabilidade</h2>
        <p style={s.p}>
          O serviço é fornecido &ldquo;como está&rdquo;, sem garantias expressas ou implícitas de
          resultados comerciais. Não nos responsabilizamos por:
        </p>
        <ul style={s.ul}>
          <li style={s.li}>Decisões comerciais tomadas com base nas informações geradas</li>
          <li style={s.li}>Imprecisões nos dados públicos da Receita Federal</li>
          <li style={s.li}>Indisponibilidade temporária das APIs de CNPJ de terceiros</li>
          <li style={s.li}>Violações de terceiros que acessem sua conta por falha de segurança sua</li>
          <li style={s.li}>Qualquer dano indireto, incidental ou consequente</li>
        </ul>
        <p style={s.p}>
          Nossa responsabilidade total não excederá o valor pago nos últimos 3 meses de serviço.
        </p>

        <h2 style={s.h2}>9. Rescisão</h2>
        <p style={s.p}>
          Podemos suspender ou encerrar sua conta imediatamente se você violar estes Termos,
          realizar atividades fraudulentas, ou usar o serviço de forma prejudicial a terceiros.
          Você pode encerrar sua conta a qualquer momento enviando e-mail para
          <a href="mailto:suporte@sdrextension.com.br" style={s.a}> suporte@sdrextension.com.br</a>.
        </p>

        <h2 style={s.h2}>10. Lei aplicável e foro</h2>
        <p style={s.p}>
          Estes Termos são regidos pela legislação brasileira. Eventuais disputas serão resolvidas
          no foro da comarca de São Paulo — SP, com renúncia a qualquer outro, por mais
          privilegiado que seja.
        </p>

        <h2 style={s.h2}>11. Contato</h2>
        <p style={s.p}>
          <a href="mailto:suporte@sdrextension.com.br" style={s.a}>suporte@sdrextension.com.br</a>
        </p>
      </div>
    </div>
  );
}
