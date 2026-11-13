# V2 homepage — Lighthouse

Lighthouse 12.6.1, mobile preset (simulated throttling), Chrome headless, against
local production builds (`pnpm build && pnpm start`).

## 2026-11-13 — design rework vs previous V2

Both builds measured on the same machine, same session, runs interleaved
(previous V2 = commit `a4cd12c`, built in a temporary worktree).

| Build | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Speed Index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Previous V2 (`a4cd12c`) | 89 / 93 / 93 | 100 | 96 | 66\* | 3.3–3.7 s | 0 | 0–10 ms | 0.9 s |
| Reworked V2 | 90 / 91 / 91 | 100 | 96 | 66\* | 3.5–3.6 s | 0 | 0 ms | 1.1–1.8 s |
| Reworked V2, V1 fonts not preloaded (experiment, not committed) | 95 / 96 / 96 | 100 | 96 | 66\* | 2.8–2.9 s | 0 | 0 ms | 1.1 s |

\* SEO 66 is expected: `/v2` is deliberately `noindex, nofollow`.

### Why the rework is ~2 points lower

The reworked page carries more content (five photo tiles, the timeline, five
reviews, the compact package list, the offering-card widgets), so on
Lighthouse's simulated slow-4G:

- the HTML document grew from 10.6 kB to 18.5 kB (transfer), which pushes the
  hero image's simulated load delay from ~0 to ~0.5–0.7 s;
- the render-blocking V2 stylesheet grew from 4.2 kB to 8.9 kB.

The ambient loops (border light, hero glow and dust, background drift) start
only after the page has loaded and gone idle (`data-v2-ready`), so they don't
compete with first paint; TBT stays 0 ms and CLS 0.

### The fix (needs a decision — it touches V1's root layout)

As noted in the previous run, the root layout preloads V1's Cormorant and
Hanken Grotesk fonts (~115 kB) on every route, including `/v2`, which never
uses them. Setting `preload: false` on those two fonts in `src/app/layout.tsx`
takes `/v2` to **Performance 95–96, LCP 2.8–2.9 s** (measured above, reverted).
V1 pages would show a brief font swap. At V2 cutover, V2's font replaces V1's
in the root layout and this goes away on its own.

## 2026-11-10 — previous V2 vs V1

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (V1, current) | 90 | 100 | 96 | 100 | 3.6 s | 0 | 0 ms |
| `/v2` | 93–94 | 100 | 96 | 66\* | 3.1–3.3 s | 0 | 0 ms |

## Screenshots

Reworked V2 (2026-11-13, reduced motion so every section is captured at rest):

- [375px](./v2-rework-375.jpg)
- [768px](./v2-rework-768.jpg)
- [1440px](./v2-rework-1440.jpg)

Previous V2 (2026-11-10):

- [375px](./v2-375.jpg)
- [1440px](./v2-1440.jpg)
