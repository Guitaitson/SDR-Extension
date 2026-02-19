# Community Posts — SDR Extension Launch

## 1. Product Hunt Launch Post

### Tagline
De CNPJ a mensagem de prospecção em 15 segundos — para SDRs brasileiros

### Description
Hey Product Hunt! 👋

We built SDR Extension for Brazilian B2B sales reps who are tired of spending 15 minutes researching each prospect manually.

**The problem:** 72% of Brazilian sales teams miss quota, and one major reason is that SDRs waste hours doing company research before each call — Googling, checking LinkedIn, reading news. And existing tools (Speedio, Neoway) cost R$500–10,000/month with no self-serve option.

**Our insight:** Every Brazilian company has a CNPJ (tax ID), and the Receita Federal (Brazil's IRS) makes all company data publicly available. That's 55M+ companies with full profiles — sector, size, founding date, partners, address — completely free and universally covered.

**What SDR Extension does:**
1. You paste a CNPJ
2. We fetch real-time data from Receita Federal APIs
3. AI generates a personalized prospecting message in Portuguese
4. You copy and send via WhatsApp or email — in 15 seconds total

**Pricing:** Free tier (10 lookups/month), Pro at R$97/month (200 lookups), Team at R$247/month (3 seats + CRM webhooks).

We'd love your feedback! Especially from anyone in B2B sales in emerging markets — does this model work for your country too?

### First Comment (Maker comment)
Happy to answer any questions! A few things I'd love your thoughts on:

1. **BYOK model for contact enrichment** — instead of building our own contact database, users connect their own Apollo.io or Lusha keys. Is this a feature or a friction point for you?

2. **Brazilian market specifics** — WhatsApp is a primary business channel in Brazil, so we generate WhatsApp-ready messages. Does this translate to other markets?

3. **Future roadmap** — we're considering LinkedIn integration, automated cadence sequences, and a CRM-native version. What would you build first?

Thanks for hunting us! 🙏

---

## 2. Reddit Post — r/sales

**Title:** Built a Chrome extension that turns Brazilian company tax IDs (CNPJ) into prospecting intelligence in 15 seconds — feedback welcome

**Body:**

Hey r/sales,

Long-time lurker, first-time poster. I built something for the Brazilian B2B market and would love feedback from people who've tried similar approaches elsewhere.

**Context:** In Brazil, every company has a public tax registration (CNPJ) with the IRS. This includes company sector (CNAE code), size, founding date, partners/owners, and address. It's all public, free, and covers 100% of the market — including small businesses that don't have LinkedIn profiles.

**What I built:** A Chrome extension that:
- Takes a CNPJ as input
- Fetches real-time data from public APIs
- Uses GPT-4o-mini to generate a personalized cold outreach message in Portuguese
- Returns the full briefing + message in ~15 seconds

**Why it matters for the Brazilian market:**
- 99% of Brazilian SMBs have no LinkedIn presence, making US tools (Apollo, Sales Navigator) nearly useless for them
- Enterprise Brazilian tools (Speedio, Neoway) cost $500–2000/month with no self-serve
- WhatsApp is the primary business communication channel (not email), so messages need to be WhatsApp-optimized

**What's working:**
- The "turn tax ID into briefing" concept resonates immediately with Brazilian SDRs
- The AI message generation saves 10–15 min per company

**What I'm unsure about:**
- BYOK (Bring Your Own Key) for contact enrichment — is this friction or feature?
- Pricing: R$97/month (~$20 USD) for 200 lookups. Too cheap? Too expensive?

Would love to hear if anyone has tried similar approaches with public company data in their markets (UK Companies House, French SIRENE, German Handelsregister, etc.).

Link in comments (don't want to break subreddit rules on self-promotion in the post itself).

---

## 3. Reddit Post — r/empreendedorismo

**Título:** Construí uma extensão Chrome que transforma CNPJ em inteligência de prospecção — feedback de quem trabalha com vendas B2B

**Corpo:**

Fala, r/empreendedorismo!

Compartilho aqui algo que construí depois de ouvir muita reclamação de SDRs sobre o tempo perdido em pesquisa antes de prospectar.

**O problema que tentei resolver:**

Um SDR gasta 10–15 minutos por empresa pesquisando manualmente: site, LinkedIn, Google News, Receita Federal, etc. Multiplica isso por 30 prospecções/dia e você tem um dia inteiro perdido só em pesquisa — sem contar que a qualidade é inconsistente.

**A solução:**

Uma extensão Chrome que recebe um CNPJ e retorna em ~15 segundos:
- Dados completos da Receita Federal (razão social, CNAE, porte, sócios, capital social)
- Análise do perfil da empresa (segmento, maturidade, porte)
- Sugestão do cargo ideal para abordar
- Mensagem de prospecção personalizada em português, pronta para WhatsApp ou e-mail

**Tecnologia:**
- React + Manifest V3 (Chrome Extension)
- Supabase Edge Functions (auth, cache, orquestração)
- Waterfall de APIs: OpenCNPJ → BrasilAPI → ReceitaWS
- GPT-4o-mini para geração de mensagem
- Lemon Squeezy para pagamentos

**Modelo de negócio:**
- Grátis: 10 consultas/mês (sem cartão)
- Pro: R$97/mês — 200 consultas
- Team: R$247/mês — 3 usuários + CRM webhooks

**O que está funcionando:**
A proposta de valor ressoa imediatamente com SDRs brasileiros. O CNPJ como input é natural para qualquer pessoa de vendas no Brasil.

**O que estou validando:**
- BYOK para Apollo/Lusha vs. base própria de contatos
- Preço — R$97 está certo ou está deixando dinheiro na mesa?
- Canais de aquisição (SEO? Comunidades? Indicação?)

Qualquer feedback é bem-vindo — especialmente de quem já passou pelo ciclo de lançamento de SaaS B2B no Brasil.

---

## 4. LinkedIn Post (Founder / Personal Brand)

**Texto:**

Depois de 6 semanas construindo nos finais de semana, lancei a SDR Extension.

O problema que me motivou: assisti um SDR da minha rede gastar 20 minutos pesquisando uma empresa antes de ligar — e ainda ligar sem saber quem era o decisor.

Enquanto isso, a Receita Federal tem dados públicos de 55 milhões de empresas brasileiras. Completamente subutilizados.

Então construí uma Chrome Extension que faz esse trabalho automaticamente:

1. Você cola um CNPJ
2. A extensão busca dados em tempo real (Receita Federal, waterfall de 3 APIs)
3. IA gera mensagem personalizada em português
4. Em 15 segundos, você tem briefing completo + mensagem pronta para WhatsApp

O que aprendi construindo isso:

▸ Dados públicos são o ativo mais subestimado do mercado B2B brasileiro
▸ O CNPJ é melhor ponto de partida para prospecção do que o LinkedIn para PMEs
▸ WhatsApp como canal de negócios muda completamente o formato ideal de mensagem
▸ O modelo BYOK (trazer sua própria chave Apollo/Lusha) reduz fricção de preço

Plano grátis para testar: 10 consultas/mês, sem cartão.

Se você conhece alguém em inside sales no Brasil — compartilha ou marca aqui. Feedback brutalmente honesto é bem-vindo.

🔗 Link na bio / primeiro comentário.

#InsideSales #B2B #ProspecçãoB2B #SDR #Startup #SaaS #Brasil

---

## 5. Hacker News — Show HN Post

**Title:** Show HN: Chrome extension that turns Brazilian company tax IDs into prospecting briefs

**Text:**

I built a Chrome extension for Brazilian B2B sales reps. It takes a CNPJ (Brazilian company tax ID), fetches real-time data from the Receita Federal (Brazil's IRS) public APIs, and generates a personalized prospecting message using GPT-4o-mini.

**Why this is interesting from a technical perspective:**

1. Brazil has a unique data infrastructure: every company must register with the Receita Federal, and all data (sector code, size, partners, capital, address) is public by law (Lei de Acesso à Informação). This creates a 55M-company database with universal coverage.

2. The waterfall pattern: OpenCNPJ → BrasilAPI → ReceitaWS, each with different rate limits, data freshness and reliability characteristics. We cache at the Supabase Edge Function layer.

3. BYOK model for contact enrichment: instead of building a contact database (expensive, data quality issues, legal complexity), we accept Apollo.io or Lusha API keys and proxy requests through our backend. This turns a data problem into a routing problem.

4. Manifest V3 constraints: MV3 restricts background scripts, which changes how we handle the waterfall retries and streaming.

**Tech stack:** React + Vite (CRXJS), Supabase Edge Functions (Deno), Lemon Squeezy for payments, PostHog for analytics.

**What I'm uncertain about:** The BYOK model reduces our data risk but adds onboarding friction. Is there a better approach for contact enrichment in markets with fragmented data coverage?

Open source: github.com/[username]/SDR-Extension
