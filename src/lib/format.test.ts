import { expect, test } from "vitest";
import { formatPrice } from "./format";
import { getPackageCta } from "./packages";
import { loadPackages, loadSite } from "./content/load";

test("weekly prices render as €N/week", () => {
  expect(formatPrice({ price: 55, billing: "weekly" })).toBe("€55/week");
});

test("one-time prices render as One Time Payment: €N", () => {
  expect(formatPrice({ price: 225, billing: "one-time" })).toBe(
    "One Time Payment: €225",
  );
});

test("packages with a purchaseUrl get the buy-now CTA; without one they fall back to enquiry", () => {
  const site = loadSite();
  for (const pkg of loadPackages()) {
    expect(getPackageCta(pkg, site)).toEqual({
      label: site.purchaseCtaLabel,
      href: pkg.purchaseUrl,
    });
    expect(getPackageCta({ ...pkg, purchaseUrl: undefined }, site)).toEqual(
      site.packageCta,
    );
  }
});
