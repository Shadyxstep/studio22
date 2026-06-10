import type { Package } from "./content/schema";

/*
 * Price presentation, verbatim from the live site:
 *   weekly   → "€55/week"
 *   one-time → "One Time Payment: €225"
 */
export function formatPrice(pkg: Pick<Package, "price" | "billing">): string {
  return pkg.billing === "weekly"
    ? `€${pkg.price}/week`
    : `One Time Payment: €${pkg.price}`;
}
