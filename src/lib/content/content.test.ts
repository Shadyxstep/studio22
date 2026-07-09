import fs from "fs";
import path from "path";
import { describe, expect, test } from "vitest";
import {
  loadFaqs,
  loadPackages,
  loadPage,
  loadSite,
  loadTestimonials,
} from "./load";
import { PAGE_NAMES, type Page, type Site } from "./schema";

const ROUTES = new Set([
  "/",
  "/facility",
  "/packages",
  "/get-started",
  "/faqs",
  "/contact",
]);

function collectFromPage(page: Page) {
  const images: string[] = [];
  const hrefs: string[] = [];
  for (const s of page.sections) {
    if ("image" in s && s.image) images.push(s.image.src);
    if (s.type === "gallery") images.push(...s.images.map((i) => i.src));
    if ("cta" in s && s.cta) hrefs.push(s.cta.href);
    if ("ctas" in s && s.ctas) hrefs.push(...s.ctas.map((c) => c.href));
  }
  return { images, hrefs };
}

function collectFromSite(site: Site) {
  const images = Object.values(site.pillars).map((p) => p.image.src);
  const hrefs = [
    ...site.nav,
    ...site.footerLinks,
    ...site.social,
    site.reviewCta,
    site.packageCta,
  ].map((l) => l.href);
  return { images, hrefs };
}

describe("every content file parses against its schema", () => {
  test("site.json", () => expect(loadSite().name).toBe("Studio 22"));
  test("packages.json", () => expect(loadPackages()).toHaveLength(7));
  test("testimonials.json", () => expect(loadTestimonials()).toHaveLength(5));
  test("faqs.json (empty pending owner copy)", () =>
    expect(loadFaqs()).toEqual([]));
  for (const name of PAGE_NAMES) {
    test(`pages/${name}.json`, () =>
      expect(loadPage(name).sections.length).toBeGreaterThan(0));
  }
});

describe("package catalog matches SPEC §6.3 exactly (as amended 2026-07-08)", () => {
  const expected: Array<[string, string, number, string, string]> = [
    ["unlimited-gym", "gym", 55, "weekly", "61447"],
    ["complete-studio", "gym", 75, "weekly", "61488"],
    ["strength-trial", "gym", 120, "one-time", "75441"],
    ["pilates-membership", "pilates", 50, "weekly", "61486"],
    ["reformer-10", "pilates", 225, "one-time", "65549"],
    ["reformer-intro-5", "pilates", 120, "one-time", "73866"],
    ["online-coaching", "online-golf", 35, "weekly", "61445"],
  ];

  test("ids, categories, prices, billing, purchase URLs", () => {
    const got = loadPackages().map(
      (p) => [p.id, p.category, p.price, p.billing, p.purchaseUrl] as const,
    );
    expect(got).toEqual(
      expected.map(([id, cat, price, billing, exid]) => [
        id,
        cat,
        price,
        billing,
        `https://fitness.studio-22.ie/packages/${exid}/purchase/`,
      ]),
    );
  });

  test("Stripe stays dormant: nothing purchasable, no Stripe ids", () => {
    for (const p of loadPackages()) {
      expect(p.purchasable).toBe(false);
      expect(p.stripePriceId).toBeUndefined();
    }
  });
});

describe("referential integrity", () => {
  const site = loadSite();
  const pages = PAGE_NAMES.map((n) => [n, loadPage(n)] as const);

  test("every referenced image exists in public/", () => {
    const images = new Set([
      ...collectFromSite(site).images,
      ...pages.flatMap(([, p]) => collectFromPage(p).images),
    ]);
    for (const src of images) {
      const file = path.join(process.cwd(), "public", src);
      expect(fs.existsSync(file), `missing image: ${src}`).toBe(true);
    }
  });

  test("every internal href resolves to a real route", () => {
    const hrefs = [
      ...collectFromSite(site).hrefs,
      ...pages.flatMap(([, p]) => collectFromPage(p).hrefs),
    ].filter((h) => h.startsWith("/"));
    for (const href of hrefs) {
      const clean = href.split("#")[0];
      expect(ROUTES.has(clean), `unknown route: ${href}`).toBe(true);
    }
  });

  test("external links are https", () => {
    const hrefs = [
      ...collectFromSite(site).hrefs,
      ...Object.values(site.links),
      ...pages.flatMap(([, p]) => collectFromPage(p).hrefs),
    ].filter((h) => !h.startsWith("/"));
    for (const href of hrefs) {
      expect(href.startsWith("https://"), `non-https link: ${href}`).toBe(
        true,
      );
    }
  });
});
