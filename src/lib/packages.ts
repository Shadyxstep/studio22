import type { Package, Site } from "./content/schema";

type Cta = { label: string; href: string };

/*
 * SPEC §9 — the single switch behind every package CTA. While a package is
 * not purchasable the CTA routes to the enquiry flow (site.packageCta).
 * When payments activate (SPEC §10), the purchasable branch becomes the
 * Stripe Checkout entry point; nothing else in the UI changes.
 */
export function getPackageCta(pkg: Package, site: Site): Cta {
  if (pkg.purchasable && pkg.stripePriceId) {
    return { label: site.packageCta.label, href: `/api/checkout?package=${pkg.id}` };
  }
  return site.packageCta;
}
