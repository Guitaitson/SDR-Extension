# SDR Extension — B2B Prospecting for Brazilian Market

> Transform any CNPJ into actionable prospecting intelligence in 15 seconds.

A Chrome Extension that combines Brazilian public company data (Receita Federal), optional enrichment APIs, and AI-generated personalized messages — built specifically for Brazilian SDRs.

## Why This Exists

- **72%** of Brazilian sales teams miss quota (RD Station 2024)
- **No** independent Brazilian Chrome Extension combines CNPJ data + AI messaging
- Enterprise tools (Speedio, Neoway) cost R$500–10,000/month with no self-service
- SDRs spend **10–15 minutes** per company researching manually; this tool does it in 15 seconds

## Features (MVP)

- Paste a CNPJ → get company briefing in seconds
- Razão social, CNAE, porte, endereço, sócios, capital social
- AI-generated personalized prospecting message (PT-BR)
- WhatsApp and email templates
- Free tier: 10 lookups/month
- Pro tier (R$97/month): 200 lookups/month
- Team tier (R$247/month): 3 seats + CRM webhooks

## Architecture

```
Chrome Extension (MV3 + React)
        ↓
Supabase Edge Functions (auth, orchestration, cache)
        ↓
CNPJ APIs: OpenCNPJ → BrasilAPI → ReceitaWS (waterfall)
        ↓
OpenRouter / GPT-4o-mini (AI message generation)
        ↓
Optional BYOK: Apollo.io / Lusha (contact enrichment)
```

## Project Structure

```
/
├── extension/          # Chrome Extension (React + Vite + CRXJS)
├── supabase/           # Edge Functions + DB migrations
├── landing/            # Next.js marketing site
├── docs/               # Architecture, ADRs, legal docs
└── .github/            # CI/CD, issue templates, PR templates
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase CLI
- A Supabase project
- A Lemon Squeezy account (payments)

### Extension Development

```bash
cd extension
pnpm install
cp .env.example .env.local  # fill in your Supabase URL + anon key
pnpm dev
```

Load the `extension/dist` folder as an unpacked extension in Chrome (`chrome://extensions`).

### Supabase Functions

```bash
cd supabase
supabase start
supabase functions serve
```

### Landing Page

```bash
cd landing
pnpm install
cp .env.example .env.local
pnpm dev
```

## Environment Variables

See `.env.example` files in each sub-project for required variables. **Never commit real secrets.**

## Legal

- CNPJ data from Receita Federal is public under Lei de Acesso à Informação
- MEI/EI data is treated as personal data under LGPD
- Prospecting uses *legítimo interesse* (LGPD Art. 7, IX) as legal basis
- See [docs/legal/lgpd-lia.md](docs/legal/lgpd-lia.md) for the full LIA documentation

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
