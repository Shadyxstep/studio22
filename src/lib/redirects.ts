/*
 * 301s from old WordPress URLs (captured in docs/content-inventory.md) to
 * their new homes. Lives here (not vercel.json) so redirects work on any
 * host and are unit-testable. Consumed by next.config.ts.
 */
export const LEGACY_REDIRECTS: Array<{ source: string; destination: string }> =
  [
    { source: "/our-packages", destination: "/packages" },
    { source: "/gym-packages", destination: "/packages" },
    { source: "/pilates-packages", destination: "/packages" },
    { source: "/full-studio-package", destination: "/packages" },
    { source: "/online-coaching", destination: "/packages" },
    { source: "/contact-us", destination: "/contact" },
    { source: "/strength", destination: "/facility" },
    { source: "/reformer-pilates", destination: "/facility" },
    { source: "/golf", destination: "/facility" },
    // promo/funnel pages without a v1 equivalent route to the enquiry flow
    { source: "/golf-performance-program", destination: "/get-started" },
    { source: "/we-are-open", destination: "/get-started" },
  ];
