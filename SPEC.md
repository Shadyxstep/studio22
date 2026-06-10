# Studio 22 — Website Technical Specification

> **Audience:** an autonomous coding agent. Every decision in this document is final unless marked `DECISION NEEDED`. Do not substitute technologies, rename entities, invent copy, or expand scope. Where this spec is silent, choose the simplest option consistent with it and log the choice in TASK_LOG.md.

---

## 1. Product summary

A ground-up rebuild of https://studio-22.ie — a premium gym, golf simulator, and reformer pilates studio in Dun Laoghaire, Dublin, serving an affluent clientele. v1 is a static marketing site ("for show"): it mirrors the live site's content and features, deployed on Vercel. No live commerce, no accounts.

**Architectural mandate (this outranks convenience):** all copy, images, pricing, and *section composition* live in validated content files, never in components. v2 adds an AI agent that lets the non-technical owner edit the site in plain English by editing those files — both field-level changes (copy/images/prices) and structural changes (add/remove/reorder sections). v1 must make that possible without refactoring. Do not build the agent.

**Brand direction:** "Nike x Moncler" — technical athleticism, quiet luxury. The Moncler half leads typography and layout (light, editorial, generous space, per `DESIGNS/DESIGN_PRIORITY.jpg`); the Nike half comes from photography and copy.

## 2. Goals and non-goals

**Goals (v1):**
- Six pages rendered entirely from validated `content/` files via a closed section-component library.
- Sign-up flow: package selection → pre-filled `mailto:` enquiry. Discovery-call CTA → owner's external Google Calendar booking page.
- Stripe checkout scaffolding exists but is dormant (env-gated, no key required for any task).
- Pixel-quality premium design per §8; Lighthouse ≥95 (performance, accessibility, best practices, SEO) on every page.
- Deployable to Vercel from milestone 1 onward (`pnpm build` is the proxy gate).

**Non-goals (v1) — do NOT build:**
- The AI editing agent, any CMS, or admin dashboard.
- Real payments, auth, accounts, member areas, databases of any kind.
- Form backends or email-sending services — all enquiry CTAs are client-composed `mailto:` links.
- Class scheduling/booking logic — exercise.com handles members' day-to-day; the site only links out.
- Blog, i18n, light theme (dark only), native apps.

## 3. Locked technology stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript `strict: true`, static output (no runtime DB) |
| Package manager | pnpm |
| Styling | Tailwind CSS, design tokens per §8 only |
| Motion | Framer Motion, presets-only per §8.4 |
| Content validation | zod — every `content/*.json` file parses against a schema at build time |
| Fonts | next/font/google: **Tenor Sans** (display, 400), **Hanken Grotesk** (body + labels) |
| Images | next/image; assets from `/Users/leomorgan/Desktop/Studio22/IMAGES` copied into `public/images/` |
| Payments (dormant) | `stripe` SDK, env-gated stubs only |
| Tests | Vitest + @testing-library/react |

**Approved dependency list:** next, react, react-dom, typescript, tailwindcss, zod, framer-motion, stripe, vitest, @vitejs/plugin-react, @testing-library/react, jsdom, eslint + next config, tsx. Adding anything else requires a `DECISION NEEDED` stop.

**Network access rule:** code and tests make zero network calls. The *agent itself* may fetch pages of `studio-22.ie` (read-only) during the content-inventory task (§7) — that is the only permitted network access in the whole build.

## 4. Repository layout

```
studio22-website/
├── .env.example                  # every env var, documented
├── content/
│   ├── site.json                 # nav, footer, contact, social, booking URL, external links
│   ├── packages.json             # the catalog (§6.3)
│   ├── testimonials.json
│   ├── faqs.json
│   └── pages/
│       ├── home.json             # ordered array of section objects (§6.2)
│       ├── facility.json
│       ├── packages.json
│       ├── get-started.json
│       ├── faqs.json
│       └── contact.json
├── public/images/                # optimized brand photography
├── src/
│   ├── app/
│   │   ├── layout.tsx            # fonts, nav, footer, metadata defaults
│   │   ├── page.tsx              # home
│   │   ├── facility/page.tsx
│   │   ├── packages/page.tsx
│   │   ├── get-started/page.tsx
│   │   ├── faqs/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── checkout/success/page.tsx    # dormant (§10)
│   │   ├── checkout/cancelled/page.tsx
│   │   ├── api/checkout/route.ts        # dormant, env-gated
│   │   ├── api/webhooks/stripe/route.ts # dormant stub
│   │   ├── sitemap.ts  robots.ts
│   ├── components/
│   │   ├── sections/             # exactly one component per SECTION_TYPE (§6.2)
│   │   ├── layout/               # Nav, Footer
│   │   └── ui/                   # Button, SectionLabel, PackageCard, etc.
│   ├── lib/
│   │   ├── content/schema.ts     # all zod schemas (single source of truth)
│   │   ├── content/load.ts       # typed loaders; throw on invalid content
│   │   ├── mailto.ts             # enquiry URL composer (pure, tested)
│   │   ├── motion.ts             # the ONLY Framer Motion presets (§8.4)
│   │   ├── stripe.ts             # dormant client factory
│   │   └── seo.ts                # metadata + LocalBusiness JSON-LD helpers
│   └── styles/
├── SPEC.md  ROADMAP.md  TASK_LOG.md  CLAUDE.md
└── package.json
```

**Required package.json scripts:** `dev`, `build`, `typecheck` (tsc --noEmit), `lint`, `test` (vitest run).

## 5. Environment

```bash
NEXT_PUBLIC_SITE_URL=https://studio-22.ie

# ---- Dormant payments. Checkout activates ONLY when this is "true"
# ---- AND all three Stripe vars are present. Default: false.
STUDIO22_PAYMENTS=false
STRIPE_SECRET_KEY=                      # HUMAN TODO at activation
STRIPE_WEBHOOK_SECRET=                  # HUMAN TODO at activation
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=     # HUMAN TODO at activation
```

No task may require any credential. Every feature must be demonstrable with an empty `.env`.

## 6. Content model (the v2-agent foundation)

### 6.1 Constants (`src/lib/content/schema.ts`)

```ts
export const SECTION_TYPES = [
  'hero', 'pillarGrid', 'editorialSplit', 'statBar', 'packageGrid',
  'packageTeaser', 'testimonials', 'gallery', 'faqAccordion',
  'ctaBanner', 'contactPanel',
] as const;

export const PACKAGE_CATEGORIES = ['gym', 'pilates', 'online-golf'] as const;
export const BILLING = ['weekly', 'one-time'] as const;
export const PILLARS = ['gym', 'golf', 'pilates', 'recovery'] as const; // the 4 facility pillars
```

### 6.2 Pages are ordered lists of typed sections

```jsonc
// content/pages/home.json (illustrative)
{ "sections": [
  { "type": "hero",         "headline": "The Future of Wellness", "image": "...", "cta": { "label": "...", "href": "..." } },
  { "type": "pillarGrid",   "pillars": ["gym", "golf", "pilates", "recovery"] },
  { "type": "editorialSplit", "label": "PHILOSOPHY", "headline": "...", "body": "...", "image": "..." },
  { "type": "packageTeaser" },
  { "type": "testimonials" },
  { "type": "ctaBanner",    "variant": "discovery-call" }
] }
```

Rules (these are what make v2 possible — do not bend them):
- Each section type has a zod schema; a page is `z.array(z.discriminatedUnion('type', ...))`.
- The renderer maps `type` → component from a closed registry. An unknown type or invalid field is a **build failure**, never a silent skip.
- Components receive validated content as props and contain **zero copy, zero image paths, zero prices**. If you find yourself writing a string a gym owner might want to change, it belongs in `content/`.
- `packageTeaser`, `testimonials`, `faqAccordion`, `contactPanel` pull from their global content files; the section object only carries display options (e.g. `limit`, `heading`).

### 6.3 Package schema and catalog

```ts
{
  id: string,                      // slug, e.g. "performance"
  category: PackageCategory,
  name: string,
  price: number,                   // EUR
  billing: 'weekly' | 'one-time',
  features: string[],
  purchasable: boolean,            // false for ALL packages in v1
  stripePriceId?: string           // empty in v1; HUMAN TODO at activation
}
```

Catalog to encode in `content/packages.json` (verified against live site 2026-06-10):

| id | category | name | price | billing |
|---|---|---|---|---|
| unlimited-gym | gym | Unlimited Gym Class Package | 55 | weekly |
| performance | gym | Performance Package | 75 | weekly |
| complete-studio | gym | Complete Studio Package | 75 | weekly |
| pilates-membership | pilates | Pilates Membership | 50 | weekly |
| reformer-10 | pilates | 10 Reformer Pilates Class Package | 225 | one-time |
| reformer-20 | pilates | 20 Reformer Pilates Class Package | 425 | one-time |
| online-coaching | online-golf | Online Coaching | 35 | weekly |
| simulator | online-golf | Simulator Package | 60 | weekly |

Global perk, rendered on the packages page and in the sign-up flow: *all memberships include on-site sauna access.* (Lives in `site.json`, not hardcoded.)

### 6.4 `site.json` carries (all `HUMAN TODO` values placeholdered and listed in README)

Nav structure, footer, contact email + phone + address (from live site), Google Maps link, Google review link, Instagram URL, **discovery-call booking URL** (owner's Google Calendar appointment page), exercise.com member links, sauna perk copy.

## 7. Copy and assets

- **Copy is taken verbatim from the live site** (taglines confirmed live: "The Future of Wellness", "Movement. Strength. Recovery. Community", "Performance is the greatest motivator", "Start Today, Feel Better Tomorrow"). The first build task is a **content inventory**: fetch each live page, transcribe copy/structure into `content/` files. Any copy you must invent (button labels, alt text) gets logged in TASK_LOG under "Decisions made".
- **Photography:** the 11 JPEGs in `/Users/leomorgan/Desktop/Studio22/IMAGES`. Copy into `public/images/` with kebab-case names; serve via next/image. Warm tones as-shot — no filters or duotones. More selects (golf sim, reformer studio) are expected later; gallery layouts must not break when images are added to content files.
- `DECISION NEEDED` (owner, non-blocking — build with defaults): (a) current "Get Started" buttons point to the external assessment funnel `fitness.studio-22.ie` — **default: keep linking out**, the URL lives in `site.json`; (b) live site has a "Free Resources" page — **default: omit from v1 nav**; revisit if owner objects.

## 8. Design system

### 8.1 Tokens (Tailwind config — the only colors allowed anywhere)

| Token | Value | Role |
|---|---|---|
| `ink` | `#1A1816` | page background (deepened from brand `#32373C` for premium tone) |
| `slate` | `#32373C` | cards, secondary surfaces (original brand color) |
| `bone` | `#ECEAE6` | display type, light text (original brand color) |
| `sage` | `#B2AC88` | the single accent: CTAs, labels, underlines, prices (original brand color) |
| `line` | `#2A2723` | hairline borders |
| `mid` | `#8E8A82` | secondary text |

Dark theme only. Sage is used sparingly — if a screen has more than ~3 sage elements visible, it's wrong.

### 8.2 Typography

- **Display:** Tenor Sans 400, large sizes (clamp 2.5rem → 6rem), tight leading, `bone`. Sentence case or uppercase per the reference — airy, never bold.
- **Body:** Hanken Grotesk 300/400, `bone`/`mid`, relaxed leading, measure ≤ 65ch.
- **Micro-labels:** Hanken Grotesk 500/600, uppercase, `tracking-[0.2em]`, 11–12px, `sage` or `mid` (the "PORTFOLIO" / "INSPIRE" pattern from the reference).
- No font weights above 600 anywhere. The Nike energy comes from photography and copy, not heavy type.

### 8.3 Layout aesthetic (from `DESIGNS/DESIGN_PRIORITY.jpg`)

Editorial grid: asymmetric two-column image arrangements, oversized display headlines occupying real estate, hairline `line` separators, generous vertical rhythm (sections ≥ 8rem apart on desktop), images shown large and few. Quality floor for every page: loading-safe (static), responsive to 375px, visible keyboard focus, honest empty states.

### 8.4 Motion (`src/lib/motion.ts` — presets only)

Exactly three exported presets; **components may only import these, never define inline animations**:
- `reveal` — fade + 24px rise on scroll into view, 0.6s, ease-out, once.
- `revealStagger` — parent/children variant of `reveal`, 80ms stagger.
- `heroFade` — opacity + slight scale on page load for hero media, 0.8s.

Rules: every animated element respects `prefers-reduced-motion` (render static), no layout-shifting animations, no infinite/looping animation, nothing animates on exit.

## 9. Pages and flows

Each page answers exactly one question:

1. **Home** (`/`) — *"Why is this the most premium training space in Dún Laoghaire?"* hero → pillarGrid (gym / golf / pilates / recovery) → editorialSplit (philosophy) → packageTeaser → testimonials → ctaBanner (discovery call).
2. **Facility** (`/facility`) — *"What does it feel like inside?"* Gallery-led editorial: one editorialSplit + gallery per pillar (gym, golf simulator, reformer studio, sauna/recovery).
3. **Packages** (`/packages`) — *"What does membership look like?"* packageGrid grouped by the three categories, sauna perk banner, ctaBanner.
4. **Get Started** (`/get-started`) — *"How do I begin?"* The sign-up flow (below) + discovery-call CTA + trial-pack highlight.
5. **FAQs** (`/faqs`) — faqAccordion from `content/faqs.json`.
6. **Contact** (`/contact`) — contactPanel: address, phone/email links, hours, Google Maps link, Google review CTA.

### Sign-up flow (the one interactive feature)

Client component on `/get-started`:
1. User picks a package (cards grouped by category, selected state in sage).
2. Form-styled fields (name, phone — matching the reference's "YOUR NAME / YOUR PHONE" aesthetic), **client-side only**.
3. Submit composes a `mailto:` URL via `lib/mailto.ts` — `to` = owner email from `site.json`, subject `Enquiry — <Package Name>`, body template containing package name, price, billing, and the entered fields — and opens it. No POST, no backend.
4. When `purchasable` flips true for a package (future), step 3 is replaced by Stripe Checkout for that package; the selection UI is untouched. Architect step 3 behind a single `getPackageCta(pkg)` switch so the swap is one function.

`mailto.ts` is a pure function: `(pkg, fields) → string`, fully unit-tested including URL encoding of spaces, newlines, and the euro sign.

## 10. Dormant Stripe scaffolding

- `lib/stripe.ts`: factory that throws `NotConfiguredError` unless `STUDIO22_PAYMENTS=true` AND all three keys exist. `// HUMAN TODO: real keys + price IDs at activation`.
- `POST /api/checkout`: zod-validates `{ packageId }`; when not configured returns `{ ok: false, error: 'payments_not_configured' }` (501); when configured, creates a Checkout Session — `billing: 'weekly'` → subscription mode, `'one-time'` → payment mode — and returns the session URL. Written compile-complete now, exercised only by unit tests of the not-configured path.
- `/checkout/success` and `/checkout/cancelled`: simple branded pages, built now.
- `POST /api/webhooks/stripe`: stub that verifies nothing yet and returns 501; documented TODO comment listing the events to handle at activation (`checkout.session.completed`).

## 11. SEO & performance

- Per-page `metadata` (title pattern `<Page> — Studio 22`, descriptions from content files), OG image, `sitemap.ts`, `robots.ts`.
- JSON-LD `LocalBusiness`/`HealthClub` on the home page from `site.json` (name, address, geo, phone, hours).
- Hero image `priority`; all other images lazy with correct `sizes`. Fonts `display: swap`.
- Budget: Lighthouse ≥95 all four categories, checked manually at each milestone boundary (not CI-gated).

## 12. Testing strategy

- **Content tests (the backbone):** every file in `content/` parses against its zod schema; package catalog matches §6.3 exactly (ids, prices, billing); every image path referenced in content exists in `public/images/`; every internal `href` resolves to a real route.
- **`mailto.ts` tests:** subject/body composition, URL encoding (spaces, `€`, newlines), each package shape.
- **Section component tests:** render each of the 11 section types with fixture content; assert headline/copy appears; assert unknown section type throws.
- **Checkout route tests:** not-configured path returns 501 envelope; zod rejection on bad body.
- **Reduced-motion:** motion presets module unit-tested for the reduced-motion fallback.
- No e2e/Playwright in v1. **No test may require network, credentials, or external services.**

## 13. Quality gates (must pass before any task is judged complete)

```bash
pnpm typecheck && pnpm lint && pnpm test
```
`pnpm build` must additionally pass at the end of every milestone. Zero `any`; zero eslint-disable without an inline justification comment; zero copy/prices/paths hardcoded in components (Critic lens: grep components for `€` and for any sentence-length string literal).

## 14. Conventions

- Conventional commits, one commit per approved task: `feat(T2.3): packages page grid`.
- Typed error classes (`NotConfiguredError`, `ContentValidationError`); API routes map them to `{ ok: false, error }` envelopes.
- Keep `.env.example` and the README quickstart updated in the same task that introduces a variable or command.
- All `HUMAN TODO` placeholders (booking URL, contact details, Stripe keys, exercise.com links) are tracked in a README "Before launch" checklist, updated whenever one is added.
