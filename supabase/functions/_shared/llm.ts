/**
 * LLM integration — generates prospecting content from CNPJ data.
 *
 * Default model: GPT-4o-mini via OpenRouter (~R$0.005 per call)
 * If user has BYOK OpenRouter key, it's used instead of the operator key.
 *
 * Prompt is designed for Brazilian SDRs prospecting B2B companies.
 */

const OPERATOR_OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ProspectingContent {
  company_summary: string;
  messages: {
    email: string;
    whatsapp: string;
    linkedin: string;
  };
  ideal_contact_role: string;
  objection_scripts: Array<{ objection: string; response: string }>;
}

export async function generateProspectingContent(
  cnpjData: Record<string, unknown>,
  byokKey: string | null
): Promise<ProspectingContent> {
  const apiKey = byokKey ?? OPERATOR_OPENROUTER_KEY;

  if (!apiKey) {
    throw new Error("Nenhuma chave de API LLM configurada.");
  }

  const prompt = buildPrompt(cnpjData);

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://sdrextension.com.br",
      "X-Title": "SDR Extension",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content;

  if (!content) throw new Error("LLM retornou resposta vazia.");

  try {
    return JSON.parse(content) as ProspectingContent;
  } catch {
    throw new Error("LLM retornou JSON inválido.");
  }
}

const SYSTEM_PROMPT = `Você é um especialista em prospecção B2B para o mercado brasileiro.
Dado os dados de uma empresa (CNPJ, CNAE, porte, sócios etc.), você gera:
1. Um resumo estratégico da empresa para o SDR
2. Uma mensagem de e-mail de prospecção personalizada (formal, direta, foco em dor/ROI)
3. Uma mensagem de WhatsApp curta e direta (max 3 parágrafos, tom mais informal)
4. Uma mensagem para LinkedIn InMail (profissional e concisa)
5. O cargo ideal para abordar nessa empresa
6. Scripts para as 3 objeções mais comuns para esse segmento

Responda SOMENTE com JSON válido seguindo exatamente o schema fornecido.
Use português brasileiro.
Seja específico e evite frases genéricas como "podemos ajudar sua empresa".
Mencione o segmento de atuação (CNAE), porte e cidade quando relevante.`;

function buildPrompt(data: Record<string, unknown>): string {
  const cnae = data.cnae_fiscal_descricao ?? data.cnae ?? "Não informado";
  const porte = data.porte ?? "Não informado";
  const municipio = data.municipio
    ? `${data.municipio}/${data.uf}`
    : "Não informado";
  const capitalSocial = data.capital_social
    ? `R$ ${Number(data.capital_social).toLocaleString("pt-BR")}`
    : "Não informado";
  const socios = Array.isArray(data.qsa ?? data.socios)
    ? ((data.qsa ?? data.socios) as Array<{ nome?: string }>)
        .slice(0, 3)
        .map((s) => s.nome ?? "")
        .filter(Boolean)
        .join(", ")
    : "Não informado";
  const dataInicio = data.data_inicio_atividade ?? "Não informada";

  return `Gere inteligência de prospecção para a seguinte empresa e retorne JSON com o schema abaixo.

DADOS DA EMPRESA:
- Razão Social: ${data.razao_social ?? "Não informada"}
- Nome Fantasia: ${data.nome_fantasia ?? "Não informado"}
- CNAE Principal: ${cnae}
- Porte: ${porte}
- Localização: ${municipio}
- Capital Social: ${capitalSocial}
- Data de Abertura: ${dataInicio}
- Sócios: ${socios}
- Situação: ${data.situacao_cadastral ?? "Não informada"}

SCHEMA DO JSON DE RESPOSTA:
{
  "company_summary": "string — 3-5 frases sobre a empresa, contexto de mercado e dores prováveis para o SDR entender antes de ligar",
  "messages": {
    "email": "string — e-mail de prospecção completo (assunto + corpo), 150-200 palavras",
    "whatsapp": "string — mensagem WhatsApp direta, max 120 palavras, com emoji contextual no início",
    "linkedin": "string — InMail LinkedIn, 80-100 palavras, profissional"
  },
  "ideal_contact_role": "string — ex: 'Diretor Comercial ou CEO' com justificativa em 1 frase",
  "objection_scripts": [
    { "objection": "string", "response": "string — resposta em 2-3 frases" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" }
  ]
}`;
}
