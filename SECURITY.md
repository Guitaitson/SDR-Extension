# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues by creating a [GitHub Security Advisory](../../security/advisories/new) or contacting the maintainer directly.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You will receive a response within 48 hours.

## Security Considerations

### Data Handling
- No user personal data is stored beyond email (for auth) and usage counters
- CNPJ lookup results are cached server-side for 30 days with no PII retained
- API keys (BYOK) are stored encrypted in Supabase and never logged

### LGPD Compliance
- MEI and EI company data is treated as personal data
- Legitimate interest (Art. 7, IX) is documented in `docs/legal/lgpd-lia.md`
- Users can request data deletion via support

### Chrome Extension Security
- Manifest V3 — no remote code execution
- `content_security_policy` blocks inline scripts and eval
- Permissions are minimal (storage, activeTab, host permissions scoped to Supabase URL only)
- All external communication goes through Supabase Edge Functions (no direct LLM or enrichment API calls from the extension)
