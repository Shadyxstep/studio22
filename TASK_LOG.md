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
