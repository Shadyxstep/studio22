# Studio 22 — Build Roadmap

> Executable task list for the autonomous build protocol (CLAUDE.md). SPEC.md is the source of truth for every technical decision — tasks below cite the SPEC sections they implement and add nothing beyond them. Task states: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked.

**Site:** https://studio-22.ie · Premium gym, golf simulator & reformer pilates studio, Dún Laoghaire, Dublin.
**v1 = static "for show" rebuild** mirroring the live site, architected per SPEC §1 so payments and the v2 AI editing agent activate later without refactoring. Design: "Nike x Moncler" per SPEC §8 and `DESIGNS/DESIGN_PRIORITY.jpg`.

---

## Milestone 0 — Protocol & content inventory

- [x] **T0.1 Protocol documents**
  Restructure ROADMAP.md into this milestone/task format; adapt CLAUDE.md from the AEGIS template to Studio 22.
  *Accept:* every task has acceptance criteria; total scope identical to SPEC (nothing added/removed); CLAUDE.md Critic lenses and stop conditions reference this SPEC's semantics, no AEGIS concepts remain.

- [x] **T0.2 Content inventory** (SPEC §7 — the only task permitted network access, read-only fetches of studio-22.ie)
  Fetch each live page (Home, Get Started, Our Packages, FAQs, Contact, Our Facility; note Free Resources content but default-omit per SPEC §7). Transcribe copy verbatim into `docs/content-inventory.md`, organised by target page → section. Capture contact details, booking URL, Google review link, exercise.com / fitness.studio-22.ie URLs.
  *Accept:* all 6 target pages covered; package data cross-checked against SPEC §6.3; every value that couldn't be captured is listed as `HUMAN TODO`; any copy gaps flagged rather than invented.

## Milestone 1 — Foundation

- [x] **T1.1 Scaffold** (SPEC §3, §4, §5, §8.1, §8.2)
  Next.js 15 App Router + TypeScript strict + pnpm + Tailwind with the six design tokens + next/font (Tenor Sans, Hanken Grotesk) + ESLint + Vitest wiring. Scripts: `dev`, `build`, `typecheck`, `lint`, `test`. `.env.example` per SPEC §5.
  *Accept:* `pnpm typecheck && pnpm lint && pnpm test && pnpm build` all pass; a placeholder home page renders ink background, bone Tenor Sans display text, sage accent; only approved dependencies installed.

- [x] **T1.2 Content schemas & loaders** (SPEC §6.1, §6.2)
  `lib/content/schema.ts`: zod schemas for all 11 section types as a discriminated union, page schema, package/site/testimonial/faq schemas, constants. `lib/content/load.ts`: typed loaders that throw `ContentValidationError`.
  *Accept:* tests prove a valid page parses, an unknown section type throws, an invalid field throws with a useful message; constants match SPEC §6.1 exactly.

- [x] **T1.3 Content files & images** (SPEC §6.3, §6.4, §7)
  Seed `content/` from the T0.2 inventory: `site.json`, `packages.json`, `testimonials.json`, `faqs.json`, `pages/*.json` (all six). Copy the 11 photos from `/Users/leomorgan/Desktop/Studio22/IMAGES` into `public/images/` with kebab-case names.
  *Accept:* content tests pass: every content file parses; package catalog matches SPEC §6.3 exactly (ids, prices, billing); every image path referenced exists; every internal href resolves to a real route; `HUMAN TODO` placeholders match the inventory list.

- [x] **T1.4 Motion, layout & UI primitives** (SPEC §8.3, §8.4)
  `lib/motion.ts` with exactly `reveal`, `revealStagger`, `heroFade` + `prefers-reduced-motion` handling. Nav + Footer rendered from `site.json`. UI primitives (Button, SectionLabel, hairline dividers).
  *Accept:* reduced-motion fallback unit-tested; nav/footer contain zero hardcoded copy; primitives use tokens only.

- [x] **T1.5 Section component library** (SPEC §6.2, §8)
  One component per section type (all 11), registry renderer mapping `type` → component; unknown type = build failure.
  *Accept:* smoke test per section type renders fixture content and asserts its text appears; registry covers exactly `SECTION_TYPES`; grep of `src/components` finds no `€`, no sentence-length string literals, no image paths.

## Milestone 2 — Pages & SEO

- [x] **T2.1 Home** (SPEC §9.1) — *Accept:* renders entirely from `pages/home.json` (hero, pillarGrid, editorialSplit, packageTeaser, testimonials, ctaBanner); hero image `priority`; responsive at 375px; visible keyboard focus.
- [x] **T2.2 Facility** (SPEC §9.2) — *Accept:* gallery-led editorial covering all four pillars from `pages/facility.json`; layout tolerates images being added/removed in content.
- [x] **T2.3 Packages** (SPEC §9.3) — *Accept:* grid grouped by the three categories; sauna perk banner from `site.json`; per-package CTA via a single `getPackageCta(pkg)`; weekly vs one-time billing displayed correctly.
- [x] **T2.4 Get Started (static shell)** (SPEC §9.4) — *Accept:* page renders from `pages/get-started.json` with discovery-call CTA (booking URL from `site.json`) and trial-pack highlight; sign-up flow slot present but wired in T3.1.
- [x] **T2.5 FAQs & Contact** (SPEC §9.5, §9.6) — *Accept:* accordion from `faqs.json` (accessible: keyboard + aria); contactPanel from `site.json` with mailto/tel links, Google Maps link, review CTA.
- [x] **T2.6 SEO** (SPEC §11) — *Accept:* per-page metadata (`<Page> — Studio 22`), OG image, `sitemap.ts`, `robots.ts`, LocalBusiness/HealthClub JSON-LD on home sourced from `site.json`; fonts `display: swap`.

## Milestone 3 — Flows, dormant commerce & launch readiness

- [x] **T3.1 Sign-up flow** (SPEC §9 flow) — `lib/mailto.ts` pure composer + client component on /get-started: package selection (grouped, sage selected state) → name/phone fields → submit opens composed `mailto:`.
  *Accept:* mailto tests cover subject/body composition and URL encoding (spaces, `€`, newlines) for both billing types; CTA routed through `getPackageCta`; no POST endpoint exists.
- [x] **T3.2 Dormant Stripe scaffolding** (SPEC §10) — `lib/stripe.ts` factory (`NotConfiguredError` unless `STUDIO22_PAYMENTS=true` + all keys), `POST /api/checkout` (zod, 501 envelope when unconfigured, subscription vs payment mode by billing), webhook stub (501), `/checkout/success` + `/checkout/cancelled` pages.
  *Accept:* tests: unconfigured path returns 501 envelope; bad body rejected by zod; no test needs a key.
- [x] **T3.3 Launch readiness** (SPEC §11, §13, §14) — README quickstart + "Before launch" checklist consolidating every `HUMAN TODO` (booking URL, contact details, Stripe keys + price IDs, exercise.com links, domain/DNS); final full-gate run.
  *Accept:* `pnpm typecheck && pnpm lint && pnpm test && pnpm build` green from clean state; checklist complete; note Lighthouse ≥95 is a manual milestone check.

## Milestone 4 — Launch (human-led; agent assists on request only)

- [ ] **T4.1 Vercel deploy + domain cutover + old-URL redirects** — requires Vercel/DNS access: human task. Agent may prepare `vercel.json` redirects from old WordPress paths if asked.

---

## Out of scope for v1 (SPEC §2 — do NOT build)

AI editing agent, CMS/admin UI, real payments, auth/accounts/databases, form backends or email services, class scheduling (exercise.com handles it), blog, i18n, light theme.

## Needed from owner (tracked in README "Before launch" from T3.3)

- [ ] More photography selects — especially golf simulator & reformer studio (15–20 more)
- [ ] Logo files (vector/SVG)
- [ ] Google Calendar appointment-page URL for discovery calls
- [ ] exercise.com member/booking URLs
- [ ] Decision: keep `fitness.studio-22.ie` assessment funnel (default: keep linking out)
- [ ] Decision: "Free Resources" page (default: omit)
- [ ] Domain/DNS access for cutover
- [ ] At activation only: Stripe keys + price IDs
