# Launch Playbook — SDR Extension

## Overview

This playbook covers the go-to-market execution for the SDR Extension public launch.
Target: 100 free-tier users and 10 paying customers (Pro or Team) within 30 days.

---

## Pre-Launch Checklist (T-14 to T-0)

### T-14 days
- [ ] Extension submitted to Chrome Web Store (review takes 1–7 business days)
- [ ] Landing page live at production URL
- [ ] Privacy Policy and Terms of Use published
- [ ] Supabase project on production tier (not free)
- [ ] Lemon Squeezy products and checkout links configured
- [ ] Custom domain configured for Supabase edge functions
- [ ] Error monitoring (Sentry) connected and tested
- [ ] Analytics (PostHog) installed and events firing
- [ ] `.env.example` files updated with all required variables

### T-7 days
- [ ] Chrome Web Store listing approved
- [ ] Beta testers recruited (aim for 10–15 people from your network)
- [ ] Beta feedback collected and critical bugs fixed
- [ ] Email sequence drafted in marketing tool
- [ ] Social media posts written and scheduled
- [ ] Product Hunt launch date chosen (Tuesday–Thursday perform best)
- [ ] "Coming soon" page or waitlist live (optional)

### T-3 days
- [ ] Final smoke test on production (full user journey: install → CNPJ lookup → message copy)
- [ ] Free tier limits verified (10 lookups/month resets correctly)
- [ ] Stripe/Lemon Squeezy webhook verified (subscription creation, payment failure)
- [ ] Support email/chat configured
- [ ] FAQ page live on landing site
- [ ] README updated with accurate setup instructions

### T-0 (Launch Day)
- [ ] Product Hunt post goes live at 00:01 PST
- [ ] LinkedIn post published (personal + company page)
- [ ] Reddit posts published (r/sales, r/empreendedorismo, r/brasil)
- [ ] Hacker News Show HN posted (8–10am EST for best timing)
- [ ] WhatsApp/Telegram groups messaged (SDR communities)
- [ ] Twitter/X post published
- [ ] Email to waitlist sent (if applicable)

---

## Week 1 — Launch Sprint

### Day 1 (Launch)
**Morning (6–9am BRT):**
- Publish all social content simultaneously
- Monitor Product Hunt upvotes and respond to every comment within 2 hours
- Check for critical bugs in Sentry

**Afternoon (12–3pm BRT):**
- Post in WhatsApp communities (SDR groups, Inside Sales Brasil)
- DM personal contacts who are in sales roles
- Respond to Reddit comments

**Evening (6–9pm BRT):**
- Review day 1 metrics: installs, signups, lookups performed
- Address any support tickets
- Update community posts with early user feedback/testimonials

### Days 2–7
- Respond to all Product Hunt comments
- Post daily engagement content on LinkedIn (tip of the day, user stories)
- Monitor r/sales and r/empreendedorismo for questions where you can genuinely help and mention the tool
- Cold outreach to 10 SDR managers/VP of Sales per day (personalized, using your own tool as proof)
- Collect testimonials from beta users

---

## Acquisition Channels (Priority Order)

### 1. SEO (Long-term, start immediately)
**Target keywords:**
- "prospectar empresas B2B CNPJ" — low competition, high intent
- "ferramenta SDR Brasil" — medium competition
- "inside sales Brasil" — higher competition, worth targeting

**Action items:**
- Publish blog articles (already created — see `/landing/src/app/blog/`)
- Submit sitemap to Google Search Console
- Build 5–10 backlinks from BR startup/sales blogs in first 30 days
- Add structured data (Article schema) to blog posts

### 2. Communities (Short-term, high conversion)
**Target communities:**
- Inside Sales Brasil (WhatsApp/LinkedIn group — 5k+ members)
- SDR Nation Brasil (Slack)
- r/empreendedorismo (Reddit — 180k members)
- RD Station Community
- LinkedIn groups: Vendas B2B Brasil, SDR Brasil

**Approach:** Be helpful first. Answer questions genuinely. Mention the tool only when directly relevant or in your profile bio.

### 3. Product Hunt (One-time launch spike)
- Target: Top 5 of the day
- Strategy: Pre-recruit 30+ hunters to upvote on launch day
- Follow-up: Use the PH exposure to get covered in SaaS newsletters

### 4. Cold Outreach (Scalable with own tool)
**Target ICP:**
- SDR Managers at SaaS/services companies (20–200 employees)
- Inside Sales leads at agencies
- Sales Ops professionals in companies with outbound teams

**Message:** Use your own extension to prospect them — it's the best product demo you can give.

### 5. Partnerships
- **CRM integrations:** Reach out to Pipedrive, HubSpot BR, RD CRM teams for integration partnerships
- **Sales training companies:** Offer white-label or affiliate deal
- **Accelerators/incubators:** Offer free Pro accounts to all portfolio companies

---

## Pricing & Conversion Strategy

### Free → Pro Conversion
**Trigger:** User hits 8/10 free lookups (80% usage)
**In-app message:** "Você usou 8 das 10 consultas gratuitas deste mês. Faça upgrade para Pro e tenha 200 consultas + histórico completo por R$97/mês."
**Email sequence:**
- Day 1 after reaching 80%: Upgrade nudge with benefit focus
- Day 3: Case study email ("Como [nome] fechou 3 negócios usando o histórico do Pro")
- Day 7 (if still on free): Discount offer (first month for R$67)

### Pro → Team Conversion
**Target:** Pro users with high usage (>150 lookups/month)
**Trigger:** Usage approaching Pro limit
**Message:** "Você está prosperando! Com o plano Team, você adiciona 2 colegas e tem webhooks para o seu CRM — por R$247/mês para 3 pessoas."

---

## Metrics Dashboard

### North Star Metric
**Weekly Active Users (WAU)** — users who perform ≥1 lookup in the week

### Leading Indicators
| Metric | Week 1 Goal | Month 1 Goal |
|--------|-------------|--------------|
| Chrome Web Store installs | 50 | 300 |
| Signups (email verified) | 30 | 200 |
| WAU | 20 | 100 |
| Lookups performed | 100 | 1,000 |
| Free → Pro conversions | 1 | 10 |
| MRR | R$97 | R$970 |

### Lagging Indicators (Month 1+)
- DAU/MAU ratio (target: >30%)
- Churn rate (target: <10%/month)
- NPS score (target: >40)
- Organic search traffic

---

## Content Calendar (First 30 Days)

### Week 1 — Launch content
| Day | Channel | Content |
|-----|---------|---------|
| 1 | Product Hunt | Launch post |
| 1 | LinkedIn | Founder story post |
| 1 | Reddit | r/sales + r/empreendedorismo posts |
| 1 | HN | Show HN post |
| 2 | LinkedIn | "5 things I learned building SDR Extension" |
| 3 | LinkedIn | First user testimonial |
| 4 | Twitter/X | Thread: "How Brazilian tax IDs make better prospecting" |
| 5 | LinkedIn | Blog article share: CNPJ guide |
| 7 | All | Week 1 metrics transparent post |

### Week 2 — Social proof & education
| Day | Channel | Content |
|-----|---------|---------|
| 8 | LinkedIn | Blog article share: Inside Sales Brasil guide |
| 10 | LinkedIn | User story / case study |
| 11 | Reddit | r/startups: "What I learned launching a SaaS in Brazil" |
| 12 | LinkedIn | Blog article share: Tools comparison |
| 14 | All | 2-week update post |

### Week 3–4 — Authority building
- LinkedIn: 3 posts/week (tips, data, user stories)
- Blog: 1 new article/week
- Community: Daily engagement in target communities
- Email: Bi-weekly newsletter to subscribers

---

## Crisis Management

### If Chrome Web Store rejects the submission
1. Read rejection reason carefully
2. Fix the specific issue (usually permissions or privacy policy)
3. Resubmit immediately
4. Adjust launch date if needed (1–3 day delay typical)

### If Supabase goes down on launch day
1. Status page: status.supabase.com
2. Display friendly error in extension: "Serviço temporariamente indisponível. Tentando novamente..."
3. Implement retry with exponential backoff (already in codebase)
4. Post update on social media with ETA

### If you go viral unexpectedly
1. Monitor Supabase Edge Function concurrency limits
2. Upgrade Supabase plan immediately if usage spikes
3. Enable Cloudflare or similar CDN for landing page
4. Prepare a "temporarily at capacity" message for the waitlist

---

## 90-Day Post-Launch Roadmap

### Month 2 Focus: Retention & PMF
- Talk to 30 users (15 active, 15 churned)
- Ship the most-requested feature from user interviews
- Implement in-app NPS survey (trigger at Day 14)
- Reduce time-to-value: onboarding flow improvement

### Month 3 Focus: Scale
- Launch affiliate/referral program (30% recurring for partners)
- First partnership integration (Pipedrive or RD CRM)
- Expand to Team plan marketing (target sales managers)
- Consider AppSumo or similar for LTD deal to build MRR baseline
