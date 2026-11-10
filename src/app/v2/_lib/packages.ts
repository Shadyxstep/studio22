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

/** "Unlimited Gym Class Package" → "Unlimited Gym Class" for the compact card. */
export function shortName(name: string): string {
  return name.replace(/\s+Package$/, "");
}

export function priceParts(pkg: Pick<Package, "price" | "billing">) {
  return { amount: `€${pkg.price}`, per: pkg.billing === "weekly" ? " / week" : " one time" };
}

export function ctaIdFor(pkg: Pick<Package, "id">): string {
  return `buy_now_${pkg.id.replace(/-/g, "_")}`;
}
