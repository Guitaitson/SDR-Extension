# Contributing to SDR Extension

Thank you for your interest in contributing! This is a solo micro-SaaS project, but contributions are welcome.

## Development Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd SDR-Extension
   cd extension && pnpm install
   cd ../landing && pnpm install
   ```

2. Set up your `.env.local` files (see `.env.example` in each sub-project).

3. Run Supabase locally:
   ```bash
   supabase start
   supabase functions serve
   ```

## Branch Strategy

- `main` — production-ready code only
- Feature branches: `feat/<description>`
- Bug fixes: `fix/<description>`
- Docs: `docs/<description>`

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(extension): add CNPJ auto-detection in content script
fix(edge-fn): handle ReceitaWS rate limit 429 gracefully
docs(lgpd): update LIA test balancing documentation
```

## Code Style

- TypeScript strict mode everywhere
- ESLint + Prettier — run `pnpm lint` before committing
- No `any` types without explicit justification comment
- Zod for all external data validation

## Security Requirements

- **No API keys in code** — use env variables
- **Validate all CNPJ inputs** before sending to external APIs
- **Never store raw personal data** (e-mails, phone numbers) in Supabase
- **LGPD**: MEI/EI data must be flagged and handled as personal data

## Pull Request Process

1. Open an issue first to discuss significant changes
2. Fill in the PR template completely
3. Ensure CI passes (lint, typecheck, build)
4. One approval required (from maintainer)

## Reporting Vulnerabilities

Do **not** open a public issue for security vulnerabilities. Email directly instead (see SECURITY.md).
