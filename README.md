# Studio 22 — Website

Premium gym, golf simulator & reformer pilates studio in Dún Laoghaire, Dublin.
Static-first rebuild of https://studio-22.ie on Next.js 15 — see `SPEC.md` for
every technical decision, `ROADMAP.md` for the build plan, `TASK_LOG.md` for
history.

## Quickstart

```bash
pnpm install
cp .env.example .env   # works as-is; all keys may stay empty
pnpm dev               # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | dev server |
| `pnpm build` | production build (all pages prerender statically) |
| `pnpm start` | serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (no network, no credentials, no services) |

## How the site is built

- **All copy, images, prices, and page composition live in `content/`** —
  components render data and contain zero copy. Pages are ordered lists of
  typed sections validated by zod (`src/lib/content/schema.ts`); an invalid
  content file fails the build, never silently breaks the site.
- **Design tokens** (6 colors) live in `src/app/globals.css`. Light mode is a
  token-value override under `html[data-theme="light"]` — components never
  branch on theme.
- **Motion** is limited to three presets in `src/lib/motion.ts`; everything
  honours `prefers-reduced-motion`.
- **Enquiries are `mailto:` only** — the sign-up flow composes a pre-filled
  email client-side (`src/lib/mailto.ts`). No form backend exists.
- **Payments are dormant** (SPEC §10): `/api/checkout` and the Stripe webhook
  return 501 until activation. Every package CTA routes through
  `getPackageCta()` — the single switch that changes at activation.

## Before launch (owner inputs & decisions)

Content/config — each lands in `content/site.json` or `content/` unless noted:

- [ ] **Opening hours** — published nowhere today; needed for the contact page
      and LocalBusiness JSON-LD (`contact.hours` in site.json)
- [ ] **FAQ copy** — the live FAQs link is a dead page; `content/faqs.json`
      ships empty and the page shows a contact-email empty state
- [ ] **Per-package feature bullets** — none exist on the live site; v1 seeds
      them from pillar copy (`content/packages.json`)
- [ ] **More photography** — golf simulator & reformer studio especially
      (15–20 selects); drop into `public/images/` + reference in content
- [ ] **Logo files** (vector/SVG) — wordmark is currently set in Tenor Sans
- [ ] Confirm/keep: discovery-call booking URL, WhatsApp link, assessment
      funnel URL (`fitness.studio-22.ie`), exercise.com member links
- [ ] Decisions: June trial-pack promo (currently omitted) · golf performance
      program landing page (not in v1 sitemap) · "Free Resources" (omitted —
      dead link on the live site)

Deployment (human-led, ROADMAP T4.1):

- [ ] Vercel project + deploy, domain/DNS cutover from WordPress
- [ ] Redirects from old WordPress paths (`/our-packages/` → `/packages` etc.)
- [ ] Manual Lighthouse check, target ≥95 across all four categories

At payments activation only (SPEC §10):

- [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the deployment env +
      `STUDIO22_PAYMENTS=true`
- [ ] `stripePriceId` + `purchasable: true` per package in
      `content/packages.json`
- [ ] Implement webhook signature verification + `checkout.session.completed`
      (TODO documented in `src/app/api/webhooks/stripe/route.ts`)
