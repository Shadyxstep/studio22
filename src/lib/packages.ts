import type { Package, Site } from "./content/schema";

type Cta = { label: string; href: string };

/*
 * SPEC §9 — the single switch behind every package CTA, in precedence order:
 * an exercise.com purchase page (owner-supplied purchaseUrl) wins, then the
 * dormant Stripe branch (SPEC §10), then the enquiry flow (site.packageCta).
 */
export function getPackageCta(pkg: Package, site: Site): Cta {
  if (pkg.purchaseUrl) {
    return { label: site.purchaseCtaLabel, href: pkg.purchaseUrl };
  }
  if (pkg.purchasable && pkg.stripePriceId) {
    return { label: site.packageCta.label, href: `/api/checkout?package=${pkg.id}` };
  }
  return site.packageCta;
}
