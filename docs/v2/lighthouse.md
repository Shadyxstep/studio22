# V2 homepage — Lighthouse comparison

Lighthouse 12.6.1, mobile preset (simulated throttling), Chrome headless, against
a local production build (`pnpm build && pnpm start`) on 2026-11-10. Two runs
each; numbers were identical or within 0.1s.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (V1, current) | 90 | 100 | 96 | 100 | 3.6 s | 0 | 0 ms |
| `/v2` | 93–94 | 100 | 96 | 66\* | 3.1–3.3 s | 0 | 0 ms |

\* SEO 66 is expected: `/v2` is deliberately `noindex, nofollow`.

## LCP is above the 2.5 s target — why

- The LCP element is the hero image (`next/image`, `priority`,
  `fetchPriority="high"`). **Observed** LCP in the unthrottled trace is 44 ms;
  the 3.1–3.3 s is Lighthouse's simulated slow-4G model, where everything
  requested before the LCP shares bandwidth.
- The biggest item in that budget is fonts: the root layout preloads V1's
  Cormorant (2 files) and Hanken Grotesk on every route, ~115 kB that V2
  never uses, ahead of the hero image.
- Experiment (not committed): with `preload: false` on the two V1 fonts in
  `src/app/layout.tsx`, `/v2` scored **Performance 96, LCP 2.7 s**.
- The remainder is local-server TTFB (~450 ms simulated) and React/Next
  runtime JS (~125 kB), shared with V1.

**Resolution options** (needs a decision — it touches V1's root layout):
1. At cutover, V2's fonts replace V1's in the root layout — fixes it for free.
2. Before cutover, set `preload: false` on the V1 fonts (small V1 change; V1
   would show a brief font swap).
3. Re-measure on the Vercel preview URL (CDN TTFB) before deciding.

## Screenshots

- [375px](./v2-375.jpg)
- [1440px](./v2-1440.jpg)
