import type { Package } from "@/lib/content/schema";

/** Pick packages by id, in the given order; throws if one was removed from
 *  content/packages.json so a stale config fails the build, not silently. */
export function pickPackages(all: Package[], ids: readonly string[]): Package[] {
  return ids.map((id) => {
    const pkg = all.find((p) => p.id === id);
    if (!pkg) throw new Error(`V2: package "${id}" not found in content/packages.json`);
    return pkg;
  });
}

export function priceParts(pkg: Pick<Package, "price" | "billing">) {
  return { amount: `€${pkg.price}`, per: pkg.billing === "weekly" ? " / week" : " one time" };
}

export function ctaIdFor(pkg: Pick<Package, "id">): string {
  return `buy_now_${pkg.id.replace(/-/g, "_")}`;
}

/** Pick testimonials by reviewer name, in order; missing names are skipped. */
export function pickReviews<T extends { name: string }>(all: T[], names: readonly string[]): T[] {
  return names.flatMap((n) => all.filter((t) => t.name === n));
}

/** Packages in the given categories that aren't already shown as cards,
 *  grouped by category in the given order; empty groups are dropped. */
export function morePackages(
  all: Package[],
  categories: readonly Package["category"][],
  shownIds: readonly string[],
): Array<{ category: Package["category"]; packages: Package[] }> {
  return categories
    .map((category) => ({
      category,
      packages: all.filter((p) => p.category === category && !shownIds.includes(p.id)),
    }))
    .filter((g) => g.packages.length > 0);
}

/** "Two-week trial, {price}" → "Two-week trial, €120". */
export function fillPrice(template: string, pkg: Pick<Package, "price">): string {
  return template.replace("{price}", `€${pkg.price}`);
}
