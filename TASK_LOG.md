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

## 2026-07-03 · T5.8 — admin posts + AI drafting — APPROVED
- Plan: admin CRUD for articles (list/create/edit/publish-toggle/delete, Blob cover upload behind a clear no-token notice), and the AI draft endpoint: owner notes → zod-validated {title, excerpt, bodyMd} in his voice, one structured completion (not the planner machinery), fake when keyless.
- Changes: src/lib/blog/draft.ts (+ draft.test.ts), src/app/api/admin/posts/{route.ts,[id]/route.ts,draft/route.ts,cover/route.ts}, src/app/admin/posts/{page,PostsManager,PostEditor}.tsx, admin hub nav.
- Gates: typecheck ✓ · lint ✓ · test ✓ (131 passing, +4) · build ✓ (26 routes)
- Critic issues found → resolved: none new; drafter retry contract tested for both recovery and double-failure.
- Follow-ups (not built): markdown live preview in the editor (textarea-only v1); training plans next (T5.9).
- Decisions made where SPEC was silent: covers limited to JPEG/PNG/WebP ≤8MB; draft endpoint never saves — the owner always reviews in the form; AGENT_MODEL env overrides the drafting model like the planner.

## 2026-07-03 · T5.7 — blog public surface — APPROVED
- Plan: posts table + pure slug lib; marked renderer with raw HTML escaped; /blog listing + /blog/[slug] article (drafts 404) outside the section registry; Article JSON-LD; async sitemap appends published slugs; "Journal" nav entry; prose styles from the token palette.
- Changes: src/lib/db/schema.ts (posts) + drizzle/0001_blog_posts.sql, src/lib/blog/{schema,queries,render,serve}.ts (+ blog.test.ts), src/lib/seo.ts (buildArticleJsonLd), src/app/blog/{page.tsx,[slug]/page.tsx}, src/app/sitemap.ts (async), src/app/globals.css (.prose-s22), content/site.json (nav + "Journal" → /blog); seo.test + content.test route-set updated.
- Gates: typecheck ✓ · lint ✓ · test ✓ (127 passing, +4 files worth) · build ✓ (/blog static, /blog/[slug] dynamic)
- Critic issues found → resolved: slugify diacritic-strip test expectation corrected (Émile → emiles, the strip is correct); sitemap test updated for the async signature; nav integrity test taught /blog.
- Follow-ups (not built): admin CRUD + AI draft (T5.8, next).
- Decisions made where SPEC was silent: public label is "Journal" (site voice) while the route stays /blog for SEO clarity; blog serves empty (not erroring) in file mode.

## 2026-07-03 · T5.6 — the agent (planner + executor + chat) — APPROVED
- Plan: port the template's agent to multi-page tools (set_prop/set_global/insert/move/remove, page-scoped), studio22 edit scopes enforced server-side in the executor, deterministic fake planner + Anthropic tool-use-loop real planner (Sonnet default), /api/admin/chat + /api/admin/undo, chat UI on /admin.
- Changes: src/lib/agent/{tools,scopes,executor,planner,planner.fake,planner.anthropic}.ts (+ agent.test.ts), src/app/api/admin/{chat,undo}/route.ts, src/app/admin/{ChatEditor.tsx,page.tsx}.
- Gates: typecheck ✓ · lint ✓ · test ✓ (123 passing, +12) · build ✓
- Critic issues found → resolved: none new — the executor rejects each bad call individually (mixed batches apply the good ops as one version, matching the template's semantics).
- Follow-ups (not built): chat persistence (conversations/messages tables) — v1 chat is stateless by design; setPageMeta tool.
- Decisions made where SPEC was silent: scopes allow contact/sauna/signup/reviewCta/packageCta site fields + name/price/features on packages; nav/footer/checkout/Stripe fields locked (build-safety rail); chat requires DB mode and 409s with a plain-language message in file mode.

## 2026-07-03 · T5.5 — multi-page ops + registry + applyEdit/undo — APPROVED
- Plan: the one real template adaptation — page-scoped edit ops (setProp/insert/move/remove) + setGlobal over the multi-page Content, a closed type→schema registry derived from schema.ts, and the ported atomic write spine (commitVersion → applyEdit; undo/redo = revert-to-parent).
- Changes: src/lib/content/{registry,ops,commit,applyEdit,undo}.ts (+ ops.test.ts pure/adversarial, applyEdit.test.ts on PGlite).
- Gates: typecheck ✓ · lint ✓ · test ✓ (111 passing, +15) · build ✓
- Critic issues found → resolved: revalidateTag throws outside a Next request scope — writes call safeRevalidate() (catch + no-op) so scripts/tests don't fail after a successful commit; a stray conditional-type in sectionsOf simplified to PageName.
- Follow-ups (not built): setPageMeta op (title/description edits) — content is versioned for it, tool can be added when the agent needs it.
- Decisions made where SPEC was silent: setGlobal path [] replaces the whole target (the natural "rewrite the FAQ list" operation); whole-document re-validation after every batch (uniqueness of section ids enforced by ContentSchema).

## 2026-07-03 · T5.4 — owner auth (/admin) — APPROVED
- Plan: port the template's single-owner auth (scrypt password + jose HS256 httpOnly cookie + pure protection policy) with the admin surface at /admin; Edge middleware guards /admin/* + /api/admin/*; keyless dev logs in with "owner".
- Changes: src/lib/auth/{password,session,protect}.ts (+ auth.test.ts), src/middleware.ts (matcher-scoped), src/app/api/auth/{login,logout}/route.ts, src/app/admin/{page,LogoutButton}.tsx, src/app/admin/login/{page,LoginForm}.tsx, scripts/hash-password.ts.
- Gates: typecheck ✓ · lint ✓ · test ✓ (96 passing, +6) · build ✓ (19 routes, middleware 40.3 kB)
- Critic issues found → resolved: jose rejects cross-realm Uint8Arrays under jsdom — auth suite pinned to the node test environment (code targets Node/Edge, unaffected).
- Follow-ups (not built): admin hub links activate as T5.6/T5.8/T5.9 land.
- Decisions made where SPEC was silent: cookie named studio22_session; login errors are uniform (no user enumeration surface — single owner anyway).

## 2026-07-03 · T5.3 — cached content serving + revalidation — APPROVED
- Plan: one content getter for all pages — DB current version under a tagged unstable_cache, file-seed fallback when DATABASE_URL is absent or the DB read fails; page routes switch from file loaders to it; a shared revalidateContent() the commit path (T5.5) will call.
- Changes: src/lib/content/serve.ts (+ serve.test.ts); all six page routes + layout.tsx + both checkout pages moved from loadPage/loadGlobals/loadSite to getPageContent/getContent (module-level metadata → generateMetadata, components async); five page tests adapted to `render(await Page())` (assertions unchanged).
- Gates: typecheck ✓ · lint ✓ · test ✓ (90 passing, +4) · build ✓ (empty .env — all 15 routes still prerender statically)
- Critic issues found → resolved: vi.mock hoisting broke the revalidateTag spy — moved to vi.hoisted; pg kept out of the file-mode module graph via lazy dynamic imports inside readDbContent.
- Follow-ups (not built): wire revalidateContent() into commitVersion when it lands (T5.5).
- Decisions made where SPEC was silent: DB read failures log + fall back to files rather than erroring the page (SPEC §15.1 "site never goes down with the database" read as serving intent).

## 2026-07-03 · T5.2 — versioned content DB (schema + migration + seed) — APPROVED
- Plan: sites/versions Drizzle schema per SPEC §15.2, generated migration, typed PGlite harness, DB Content document composed from the file schemas (optional section ids in files, required in DB), idempotent seedSite with deterministic page.type.n ids.
- Changes: src/lib/db/{schema,types,client,test,versions}.ts, src/lib/content/{content-types,seed}.ts (+ seed.test.ts), src/lib/content/schema.ts (optional `id: SectionId` on all 11 sections), drizzle/0000_v2_sites_versions.sql (+ meta), drizzle.config.ts already present, scripts/db-seed.ts, package.json (db:generate/db:migrate/db:seed).
- Gates: typecheck ✓ · lint ✓ · test ✓ (86 passing, +3) · build ✓
- Critic issues found → resolved: (1) `.returning().then()` typed Site|undefined — restructured to a checked destructure; (2) import.meta.url is not a file: URL under jsdom — migrations folder resolved from cwd instead.
- Follow-ups (not built): commit/applyEdit transaction path (T5.5); getCurrentContent cache (T5.3).
- Decisions made where SPEC was silent: pages stored as full Page objects (title/description included) so page metadata is versioned and later editable, not bare section arrays.

## 2026-07-03 · T5.1 — v2 deps + scaffolding — APPROVED
- Plan: open the v2 platform (SPEC §15 appended, owner-approved 2026-07-02): add approved deps, drizzle config, env loader, .env.example; prove zero-service DB testing with a PGlite smoke.
- Changes: SPEC.md (§15 v2 appendix), ROADMAP.md (v2 milestones T5.1–T5.11 + out-of-scope note), package.json/pnpm-lock (drizzle-orm, pg, jose, @vercel/blob, marked, @anthropic-ai/sdk; dev: drizzle-kit, @types/pg, @electric-sql/pglite), drizzle.config.ts, src/lib/env.ts (+ env.test.ts), src/lib/db/pglite-smoke.test.ts, .env.example.
- Gates: typecheck ✓ · lint ✓ · test ✓ (83 passing, +4) · build ✓ (empty .env)
- Critic issues found → resolved: T5.1 originally claimed the typed DB harness, but it imports the T5.2 schema — moved harness to T5.2 in ROADMAP before building; smoke test proves the zero-service infra without it.
- Follow-ups (not built): scripts/hash-password.ts referenced by .env.example lands with auth (T5.4).
- Decisions made where SPEC was silent: none (SPEC §15 written this task from the approved plan).

## 2026-06-10 · NOTE (human-directed change) — display font now Oswald + font-chain repair
Owner switched display font to Oswald (edited layout.tsx directly). Root cause of "fonts not persisting": globals.css still mapped the tokens to the removed --font-bodoni variable — and at some point --font-body was also pointed at it — so every font-family resolved to an undefined var and the browser fell back. Repaired: --font-display→var(--font-oswald), --font-body→var(--font-hanken); killed stale dev/prod servers and wiped .next so no cached bundle can serve old fonts. Chain verified in compiled+served output (font-face Oswald, preloaded woff2, both vars resolving). SPEC §3/§8.2 updated. Gates green (79, build ✓).

## 2026-06-10 · NOTE (human-directed change) — display font now Bodoni Moda
Owner swapped the locked display font Tenor Sans → Bodoni Moda (Google Fonts, variable). SPEC §3 and §8.2 updated to record it. Changes: layout.tsx font import/variable, globals.css --font-display mapping. Body/labels remain Hanken Grotesk; no component changes (font flows through the --font-display token). Gates green (79, build ✓).

## 2026-06-10 · T4.1 — Deploy & cutover — agent-side COMPLETE, human steps pending
- Done: legacy 301/308 redirects (src/lib/redirects.ts via next.config.ts, 3 tests incl. destination/route integrity, verified live), docs/deployment.md runbook, Vercel project `studio22` created and deployed — Ready at https://studio22-qmlira8w6-shadyxsteps-projects.vercel.app (60s build).
- Gates: typecheck ✓ · lint ✓ · test ✓ (79 passing) · build ✓
- Blocked on human (per runbook): (1) deployment URL returns 401 — Vercel Dashboard → studio22 → Settings → Deployment Protection → disable (or use a Share link) so the owner can review; (2) NEXT_PUBLIC_SITE_URL env var in project settings; (3) domain add + DNS cutover §3; (4) pre-cutover checks §2 incl. manual Lighthouse; (5) keep fitness.studio-22.ie DNS untouched.
- Decisions: deployed without custom domain so studio-22.ie is unaffected; redirects use Next 308 (permanent, SEO-equivalent to 301).

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

## 2026-06-12 · V2 — Wicklowgranite-style UI restyle (owner-directed) — APPROVED
- Plan: adopt the UI design language of wicklowgranite.vercel.app (serif display type, pill buttons with arrows, 14px-radius cards/imagery, eyebrow labels, blur-on-scroll header, split hero + stat-strip card) while keeping the six Studio 22 color tokens unchanged.
- Changes: globals.css (font-display → Cormorant Garamond, --radius-card token, base heading weight), layout.tsx (font swap; font variables moved to <html>), Button, SectionLabel, Nav, Hero, StatBar, PillarGrid, EditorialSplit, Gallery, CtaBanner, Testimonials, PackageCard, PackageGrid, SignUpFlow, FaqAccordion, ContactPanel; page.test.tsx + sections.test.tsx (markup-tolerant text matchers).
- Gates: typecheck ✓ · lint ✓ · test ✓ (79 passing) · build ✓
- Critic issues found → resolved: BUG (pre-existing) — next/font variables were on <body>, so the :root-level --font-display/--font-body aliases referenced undefined vars and computed invalid; webfonts were not rendering. Fixed by attaching font variable classes to <html>. Verified via headless-browser computed-style probe + screenshots (dark & light themes).
- Follow-ups (not built): consider a wicklow-style drag carousel for Gallery; scrim utilities in globals.css now unused by Hero/PillarGrid (kept as sanctioned gradients).
- Decisions made where SPEC was silent: hero headline's final word renders in italic sage (style-only, copy verbatim); nav/buttons drop the uppercase transform per the new design language.
