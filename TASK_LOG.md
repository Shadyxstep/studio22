# TASK_LOG — Studio 22 Website

> Append-only. Newest entries at the top. One entry per approved/blocked task, written by the agent per the format in CLAUDE.md. Humans may add `NOTE:` entries; the agent must read them at session start.

---

## Entry template

```
## <YYYY-MM-DD> · T<id> — <name> — APPROVED | BLOCKED
- Plan: <one line>
- Changes: <files>
- Gates: typecheck ✓/✗ · lint ✓/✗ · test ✓/✗ (<n> passing) [· build ✓/✗]
- Critic issues found → resolved: <list or "none">
- Follow-ups (not built): <list or "none">
- Decisions made where SPEC was silent: <list or "none">
```

---

## 2026-06-10 · NOTE (human) — themed photo-opacity change reverted
Owner asked to undo the photo-opacity UI changes; `git revert 35a6187` (f17d6ed). State: hero opacity-90 (owner's value), gallery 0.8, pillar tiles back to 0.6, light scrims at the accepted 82%/26% stops, no photo-opacity classes. Gates green (76).

## 2026-06-10 · MILESTONE 3 COMPLETE — Flows, dormant commerce & launch readiness
All three tasks approved. v1 build scope is DONE: sign-up flow (select → mailto), dormant Stripe behind the SPEC §5 gate, README quickstart + consolidated "Before launch" checklist. Gates green from clean state (rm -rf .next): typecheck ✓ lint ✓ test ✓ (76) build ✓ — 6 static pages + checkout pages + sitemap/robots static, 2 API routes dynamic. Remaining: Milestone 4 (deploy/cutover) is human-led; Lighthouse ≥95 is a manual check at deploy time.

## 2026-06-10 · T3.3 — Launch readiness — APPROVED
- Plan: README quickstart + architecture notes + Before-launch checklist consolidating every HUMAN TODO; full gates from clean state.
- Changes: README.md
- Gates: typecheck ✓ · lint ✓ · test ✓ (76 passing) · build ✓ (clean state)
- Critic issues found → resolved: none
- Follow-ups (not built): none
- Decisions made where SPEC was silent: checklist also records owner *decisions* (promo, golf program page, Free Resources) alongside inputs, since both block launch sign-off

## 2026-06-10 · T3.2 — Dormant Stripe scaffolding — APPROVED
- Plan: env-gated stripe factory + NotConfiguredError; POST /api/checkout (zod, dormancy gate → 501, mode by billing); webhook stub 501 with activation TODO; success/cancelled pages from site.json checkout block.
- Changes: src/lib/stripe.ts, src/app/api/checkout/{route.ts,checkout.test.ts}, src/app/api/webhooks/stripe/route.ts, src/app/checkout/{success,cancelled}/page.tsx, schema + site.json (checkout block), package.json (+stripe)
- Gates: typecheck ✓ · lint ✓ · test ✓ (76 passing) · build ✓ (api routes dynamic, all pages static)
- Critic issues found → resolved: route initially gated on purchasable before configuration, making the SPEC'd 501 path unreachable — dormancy gate now comes first
- Follow-ups (not built): webhook signature verification + checkout.session.completed handling at activation (documented in the stub)
- Decisions made where SPEC was silent: checkout success/cancelled copy invented (no live equivalent), stored in site.json where owner/agent can edit; checkout pages noindex; error envelope vocabulary (invalid_json/invalid_body/unknown_package/package_not_purchasable/payments_not_configured)

## 2026-06-10 · T3.1 — Sign-up flow — APPROVED
- Plan: pure mailto composers (buildMailto + buildEnquiryMailto) with encoding tests; SignUpFlow client component (select package → name/phone → live mailto anchor) rendered via packageGrid.selectable; reuse composer in footer/contact/faq.
- Changes: src/lib/{mailto.ts,mailto.test.ts}, src/components/sections/{SignUpFlow.tsx,PackageGrid.tsx,signup-flow.test.tsx,FaqAccordion.tsx,ContactPanel.tsx}, src/components/layout/Footer.tsx, schema + site.json (signup block), content/pages/get-started.json (selectable), 2 test updates
- Gates: typecheck ✓ · lint ✓ · test ✓ (70 passing)
- Critic issues found → resolved: URLSearchParams encodes apostrophes ('→%27) unlike the old inline encodeURIComponent — two stale assertions updated to assert against buildMailto itself
- Follow-ups (not built): none (T1.4 mailto-reuse follow-up cleared here)
- Decisions made where SPEC was silent: sign-up flow mounts via optional packageGrid.selectable flag (keeps the 11-type registry closed); submit is a live-recomputed mailto anchor (no JS navigation, testable, no POST); enquiry body field labels (Package/Price/Name/Phone) and a11y-required form labels are logged inventions, stored in site.json where editable; spaces encoded %20 not + (mail clients render + literally)

## 2026-06-10 · NOTE (human feedback) + fix — photo overlays too bright in light mode
Hero and pillar-tile gradients were hard-coded from the ink token, becoming a near-opaque white wash in light mode. Replaced with themed scrim variables (.scrim-hero/.scrim-tile beside the tokens in globals.css): dark mode keeps the original stops exactly; light mode uses weaker color-mix stops (82%/26%/0) so photos read through. Gates green. Commit: fix(theme).

## 2026-06-10 · NOTE (human-directed scope change) — light/dark mode toggle
Owner requested a light mode toggle, overriding the SPEC §2 "dark only" non-goal. SPEC §2 and §8.1 updated to record the change. Implementation: light theme is pure CSS-variable overrides of the six tokens under html[data-theme="light"] (components never branch on theme — token semantics ink=background/bone=foreground made this a value swap); ThemeToggle client component in the nav (aria-pressed, sun/moon SVG); choice persisted to localStorage with a pre-paint inline script to avoid FOUC; dark remains default; light sage/mid darkened for ≥4.5:1 contrast. Tests: toggle + persistence + pre-set theme (62 passing). Gates green incl. build. Invented a11y label "Toggle theme" (logged per protocol).

## 2026-06-10 · NOTE (human feedback) + fix — card grids not uniform
Human reported janky, non-uniform package cards. Root causes: (1) cards lacked w-full/h-full inside their flex wrappers so they shrank to content size; (2) the gap-px-over-bg-line "hairline mosaic" renders empty cells as solid blocks whenever a row isn't full (2-package category, 5 testimonials in 3 cols, gallery span pattern). Fix: per-card borders + real gaps across PackageCard, PackageGrid, PackageTeaser, Testimonials, PillarGrid, Gallery; grids now tolerate any item count (matters for v2 agent edits). Gates green (60 passing, build ✓). Commit: fix(ui).

## 2026-06-10 · MILESTONE 2 COMPLETE — Pages & SEO
All six tasks approved. The full six-page site renders statically (11 routes incl. sitemap/robots), every page composed from its content file, gates green from clean state, 60 tests. Production server smoke-checked: all routes 200, title pattern verified, JSON-LD present on home. Lighthouse ≥95 remains a manual check at launch (T3.3 notes it). Next session starts Milestone 3 (T3.1 sign-up flow).

## 2026-06-10 · T2.6 — SEO — APPROVED
- Plan: metadataBase + title template + OG defaults in layout; sitemap.ts/robots.ts; pure LocalBusiness JSON-LD builder rendered on home; structured addressParts in site.json.
- Changes: src/app/layout.tsx, src/app/{sitemap.ts,robots.ts,page.tsx}, src/lib/{seo.ts,seo.test.ts}, schema + site.json (addressParts)
- Gates: typecheck ✓ · lint ✓ · test ✓ (60 passing) · build ✓ (11 static routes)
- Critic issues found → resolved: Next's title.template does not apply to the root segment's own page → home sets an absolute title from content; stale prod server initially masked the fix during verification
- Follow-ups (not built): hours absent from JSON-LD until owner supplies opening hours
- Decisions made where SPEC was silent: structured addressParts added to site.json for valid PostalAddress markup (display string unchanged); OG image is signage-founders.jpg

## 2026-06-10 · T2.5 — FAQs & Contact — APPROVED
- Plan: faqs + contact routes; tests for empty-state accordion and contact link wiring (tel/mailto/map/review).
- Changes: src/app/faqs/page.tsx, src/app/contact/page.tsx, src/app/faqs-contact.test.tsx
- Gates: typecheck ✓ · lint ✓ · test ✓ (57 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): accordion keyboard/aria behaviour comes from native details/summary; revisit only if owner-supplied FAQ copy needs richer interaction
- Decisions made where SPEC was silent: none

## 2026-06-10 · T2.4 — Get Started (static shell) — APPROVED
- Plan: get-started route; tests for the 3 steps + CTAs, verbatim 5-week timeline, packageGrid slot for T3.1.
- Changes: src/app/get-started/{page.tsx,get-started.test.tsx}
- Gates: typecheck ✓ · lint ✓ · test ✓ (55 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): T3.1 replaces the packageGrid slot interaction with the selection→mailto flow
- Decisions made where SPEC was silent: none

## 2026-06-10 · T2.3 — Packages — APPROVED
- Plan: packages route; tests for category grouping, billing formats, sauna banner, getPackageCta routing.
- Changes: src/app/packages/{page.tsx,packages.test.tsx}
- Gates: typecheck ✓ · lint ✓ · test ✓ (52 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): none
- Decisions made where SPEC was silent: none

## 2026-06-10 · T2.2 — Facility — APPROVED
- Plan: facility route from pages/facility.json; test asserts per-pillar editorials + gallery alts.
- Changes: src/app/facility/{page.tsx,facility.test.tsx}
- Gates: typecheck ✓ · lint ✓ · test ✓ (49 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): none
- Decisions made where SPEC was silent: none

## 2026-06-10 · T2.1 — Home — APPROVED
- Plan: replace placeholder with loadPage("home") + SectionRenderer; metadata from page file; test asserts full section composition + hero priority image.
- Changes: src/app/page.tsx, src/app/page.test.tsx, vitest.setup.ts (RTL cleanup)
- Gates: typecheck ✓ · lint ✓ · test ✓ (48 passing)
- Critic issues found → resolved: RTL auto-cleanup inactive without vitest globals → explicit afterEach(cleanup) in setup; duplicate-element test failure resolved by it
- Follow-ups (not built): none
- Decisions made where SPEC was silent: none

## 2026-06-10 · MILESTONE 1 COMPLETE — Foundation
All five tasks approved. Gates green from clean state including `pnpm build` (static prerender). The repo now has: pinned Next 15 scaffold with the six tokens + Tenor Sans/Hanken Grotesk; zod-validated content model (11-section closed union); all content seeded verbatim from the live site; 11 photos in public/images; motion presets with reduced-motion fallback; nav/footer/UI primitives; full section component library with registry renderer. 47 tests. Next session starts Milestone 2 (T2.1 Home).

## 2026-06-10 · T1.5 — Section component library — APPROVED
- Plan: 11 section components + registry renderer keyed to SECTION_TYPES; copy-bearing strings pushed into site.json; price formatting + getPackageCta helpers; smoke test per type.
- Changes: src/components/sections/* (13 files incl. registry + PackageCard), src/lib/{format.ts,format.test.ts,packages.ts}, schema/site.json additions (reviewCta, packageCta, packageCategories, sauna block replacing saunaPerk), content/pages/home.json teaser cta, vitest.setup.ts (IntersectionObserver stub)
- Gates: typecheck ✓ · lint ✓ · test ✓ (47 passing) · build ✓
- Critic issues found → resolved: jsdom lacks IntersectionObserver for whileInView → vitest.setup.ts stub; copy-purity grep over src/components clean (only a test fixture matches)
- Follow-ups (not built): none
- Decisions made where SPEC was silent: price format strings ("€N/week", "One Time Payment: €N" — verbatim from live site) live in lib/format.ts as presentation logic; category labels/review CTA/package CTA/sauna banner moved into site.json as agent-editable data; getPackageCta routes unpurchasable packages to site.packageCta (/get-started); empty-FAQ state renders the contact email rather than invented copy

## 2026-06-10 · T1.4 — Motion, layout & UI primitives — APPROVED
- Plan: three presets in lib/motion.ts + pure reduced-motion resolver; client wrappers in components/motion.tsx; Nav/Footer from site.json; Button + SectionLabel primitives.
- Changes: src/lib/motion.ts, src/lib/motion.test.ts, src/components/motion.tsx, src/components/ui/{Button,SectionLabel}.tsx, src/components/layout/{Nav,Footer}.tsx, src/components/layout/layout.test.tsx, src/app/layout.tsx, schema/site.json (social links became labeled data), package.json (+framer-motion)
- Gates: typecheck ✓ · lint ✓ · test ✓ (31 passing)
- Critic issues found → resolved: Footer hardcoded "Instagram"/"TikTok" labels → moved to site.json `social` array (zero copy in components holds)
- Follow-ups (not built): Footer's inline mailto-encode should reuse lib/mailto.ts once T3.1 creates it
- Decisions made where SPEC was silent: presets live in lib/motion.ts as pure variant objects, client wiring in components/motion.tsx (keeps the single-module rule testable); mobile nav button uses site.name as aria-label to avoid invented copy

## 2026-06-10 · T1.3 — Content files & images — APPROVED
- Plan: seed all content files verbatim from the T0.2 inventory/source-text; copy 11 photos to public/images with semantic names; content integrity test suite.
- Changes: content/{site,packages,testimonials,faqs}.json, content/pages/*.json (6), public/images/*.jpg (11), src/lib/content/content.test.ts
- Gates: typecheck ✓ · lint ✓ · test ✓ (24 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): owner to supply FAQ copy (faqs.json ships empty), opening hours, per-package feature confirmation
- Decisions made where SPEC was silent: image filenames + alt text authored (logged invention); meta descriptions composed from on-page verbatim fragments; Google Maps link constructed from the address + place query; "Purchase Now" CTA retargeted from live /gym-packages/ to internal /packages; live "Fill out the form to get in touch with us." dropped (no form in v1 contact); June trial-pack promo and golf-performance-program landing page excluded per SPEC §9 composition (flagged to owner in inventory); package features seeded from pillar bullets per T0.2 decision

## 2026-06-10 · T1.2 — Content schemas & loaders — APPROVED
- Plan: zod schemas for the 11-section discriminated union + page/package/site/testimonial/faq files; pure parseContent + fs loaders throwing ContentValidationError.
- Changes: src/lib/content/{schema.ts,load.ts,schema.test.ts}, package.json (+zod 4.4.3)
- Gates: typecheck ✓ · lint ✓ · test ✓ (9 passing)
- Critic issues found → resolved: none
- Follow-ups (not built): none
- Decisions made where SPEC was silent: pages carry title+description for SPEC §11 per-page metadata (content-as-data extends to SEO strings); pillar display data (label/description/image) lives in site.json so pillarGrid sections stay references; packages.json is a bare array; testimonials carry their attribution string ("Posted on Google") as content

## 2026-06-10 · T1.1 — Scaffold — APPROVED
- Plan: manual Next.js 15 scaffold (create-next-app refuses non-empty dirs): configs, tokens, fonts, placeholder page, vitest wiring, .env.example.
- Changes: package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs, vitest.config.ts, pnpm-workspace.yaml, .env.example, .gitignore, src/app/{globals.css,layout.tsx,page.tsx,page.test.tsx}
- Gates: typecheck ✓ · lint ✓ · test ✓ (1 passing) · build ✓
- Critic issues found → resolved: pnpm pulled next@16 canary → pinned next@15.5.19 + eslint-config-next@15 + eslint@9 + ts@5; eslint plugins not resolvable under pnpm strict layout → publicHoistPattern "*eslint*"; pnpm build-script approval → allowBuilds in pnpm-workspace.yaml
- Follow-ups (not built): `next lint` is deprecated in favour of the ESLint CLI — migrate the lint script when convenient
- Decisions made where SPEC was silent: companion packages required by approved choices installed and treated as part of them (@tailwindcss/postcss for tailwind v4, @eslint/eslintrc for the flat-config bridge, @types/node|react|react-dom for typescript); standard `start` script kept alongside the five required scripts; next/font downloads Google fonts at build time (build-time network inherent to the locked font choice, not a code-path call)

## 2026-06-10 · MILESTONE 0 COMPLETE — Protocol & content inventory
Both tasks approved. Build gates (typecheck/lint/test/build) do not exist yet — first code lands in T1.1. Key findings for the human: live site's FAQs, Free Resources, and /our-facility pages are all 404 (broken nav links on the live site); opening hours are published nowhere; no per-package feature bullets exist. exercise.com purchase URLs captured per package. Next session starts T1.1 (scaffold).

## 2026-06-10 · T0.2 — Content inventory — APPROVED
- Plan: fetch all live pages via sitemap, extract visible text, organise verbatim copy + URLs into docs/content-inventory.md.
- Changes: docs/content-inventory.md, docs/source-text/*.txt (13 raw page extractions, committed so later tasks need no network)
- Gates: N/A (no code exists yet)
- Critic issues found → resolved: timeline paragraphs were abbreviated in inventory with no offline source → committed full extractions to docs/source-text/
- Follow-ups (not built): owner decisions — June trial-pack promo carry/drop; golf-performance-program landing page (not in v1 sitemap); FAQ copy; opening hours; per-package features; Google Maps share link
- Decisions made where SPEC was silent: v1 Facility page will be assembled from pillar detail-page copy (live /our-facility is 404); faqs.json ships empty pending owner copy; package `features` to be seeded from pillar bullets at T1.3 pending owner confirmation

## 2026-06-10 · T0.1 — Protocol documents — APPROVED
- Plan: restructure ROADMAP.md into milestone/task checklist; adapt CLAUDE.md from AEGIS template to Studio 22 SPEC semantics.
- Changes: ROADMAP.md, CLAUDE.md, TASK_LOG.md (title fix)
- Gates: N/A (no code exists yet; scaffold lands in T1.1)
- Critic issues found → resolved: TASK_LOG header still said "AEGIS Analytics" → fixed
- Follow-ups (not built): none
- Decisions made where SPEC was silent: Milestone 4 (deploy/cutover) marked human-led since it requires Vercel/DNS credentials (CLAUDE.md stop condition)

## 2026-06-09 · NOTE (human)
Repo initialised with SPEC.md, ROADMAP.md, CLAUDE.md, TASK_LOG.md. No code exists yet. First task: T0.1.
