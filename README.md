# A11ySverige Scanner

A Swedish-language accessibility scanner that tests websites against WCAG 2.1 AA. Built as a 3-weekend MVP to validate the A11ySverige business idea before building the full product.

## Status

**Weekend 1 (backend) — done**
- ✅ Next.js 15 + TypeScript strict
- ✅ Playwright + axe-core scanner in `lib/scanner.ts`
- ✅ `POST /api/scan` with Zod validation, rate limiting, KV persistence
- ✅ Transparent score formula in `lib/score.ts`

**Weekend 2 (frontend) — done**
- ✅ Scandinavian editorial design system (Fraunces + Manrope, cream/forest/terracotta)
- ✅ Landing page with hero, "how it works", EAA context, footer
- ✅ Scan form with loading state and error handling
- ✅ `/scan/[id]` RSC result page with score, severity breakdown, expandable issue list
- ✅ Privacy, kontakt, cookies legal stubs
- ✅ Canonical Swedish copy in `messages/sv.json`

**Weekend 3 (ship) — done**
- ✅ `/report/[id]` print-optimized HTML report
- ✅ `GET /api/pdf/[id]` — Playwright print-to-PDF
- ✅ `POST /api/email-capture` — Resend send with PDF attachment
- ✅ `EmailGate` component wired into scan result page
- ✅ Plausible analytics (env-gated, cookieless)
- ✅ `app/sitemap.ts`, `app/robots.ts`, full SEO metadata

## Setup

```bash
# 1. Install dependencies (also installs Playwright Chromium ~150MB)
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in KV credentials, Resend, Plausible

# 3. Run the dev server
pnpm dev
# → http://localhost:3000
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `KV_REST_API_URL` | yes | Vercel KV REST URL |
| `KV_REST_API_TOKEN` | yes | Vercel KV REST token |
| `KV_URL` | yes | Vercel KV connection string |
| `RESEND_API_KEY` | for email | Resend API key |
| `RESEND_FROM_EMAIL` | for email | Verified sender, e.g. `A11ySverige <noreply@a11ysverige.se>` |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | Used by PDF gen to fetch `/report/[id]` and as canonical base |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optional | Plausible site domain. Script only loads when set. |

Set KV via Vercel dashboard → Storage → KV. Vercel auto-injects these envs into deployments; locally copy them into `.env.local`.

## How it works

```
User → / (landing)
     → POST /api/scan { url }
        → rate-limit by IP (10/h)
        → Playwright launches Chromium
        → axe-core analyzes against wcag2a/aa + wcag21a/aa tags
        → calculateScore() in lib/score.ts
        → save to KV as scan:<nanoid>
     → 303 to /scan/<id> (RSC, reads from KV)
     → user submits email on EmailGate
        → POST /api/email-capture
        → save email:<id> + push to email-captures list
        → call lib/pdf.ts → Playwright print-to-PDF of /report/<id>
        → Resend send with attachment
```

## File map

```
app/
  api/
    scan/route.ts           # POST scanner
    email-capture/route.ts  # POST email gate + Resend send
    pdf/[id]/route.ts       # GET attachment download
  scan/[id]/page.tsx        # RSC, reads from KV
  report/[id]/page.tsx      # print-optimized HTML for PDF
  cookies/page.tsx
  integritetspolicy/page.tsx
  kontakt/page.tsx
  sitemap.ts                # /sitemap.xml
  robots.ts                 # /robots.txt
  layout.tsx                # fonts, metadata, Plausible
  page.tsx                  # landing
  globals.css               # design tokens + print styles
components/
  ScanForm.tsx
  ScoreDisplay.tsx
  IssueList.tsx
  EmailGate.tsx
lib/
  scanner.ts                # Playwright + axe-core
  score.ts                  # transparent score formula
  pdf.ts                    # Playwright print-to-PDF
  kv.ts                     # Vercel KV helpers
  validators.ts             # Zod schemas
  rate-limit.ts             # Upstash Ratelimit
messages/
  sv.json                   # canonical Swedish strings
```

## Tech decisions

- **Next.js App Router on Vercel** — easiest deploy path, RSC for the result page reduces client JS.
- **Playwright over Puppeteer** — actively maintained, better Vercel support.
- **axe-core** — open source, industry standard, ~30–40 % WCAG coverage; we may layer AI on top in v2.
- **Vercel KV instead of Postgres** — no migrations, no ORM, fast to ship for v1.
- **PDF via Playwright print-to-PDF** — reuses Chromium dependency; the report route is real HTML/CSS.
- **No accounts, no billing, no dashboard in v1** — strict scope to ship in 3 weekends.
- **Swedish only** — the market is Sweden.

## Constraints (do not break)

1. Three weekends total. ~30 hours. If a task balloons, descope.
2. No feature creep. No accounts, no multi-page crawl, no AI checks in v1.
3. After shipping, watch for 4 weeks before writing more code.

## Smoke test before launch

```bash
# 1. Local scan
curl -X POST http://localhost:3000/api/scan \
  -H 'content-type: application/json' \
  -d '{"url":"https://sj.se"}'

# 2. Verify result page renders
open http://localhost:3000/scan/<id>

# 3. Verify PDF generation
open http://localhost:3000/api/pdf/<id>

# 4. End-to-end email (needs Resend env)
curl -X POST http://localhost:3000/api/email-capture \
  -H 'content-type: application/json' \
  -d '{"scanId":"<id>","email":"you@example.se","consent":true}'
```

## Owner

Antonio · Stockholm · 2026
