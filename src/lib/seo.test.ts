import { expect, test } from "vitest";
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd, pageMetadata, SITE_URL } from "./seo";
import { buildLlmsTxt } from "./llms";
import { loadFaqs, loadPackages, loadPage, loadSite, loadV2Home } from "./content/load";
import { PAGE_NAMES } from "./content/schema";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

test("LocalBusiness JSON-LD carries the business facts from site.json", () => {
  const site = loadSite();
  const ld = buildLocalBusinessJsonLd(site);
  expect(ld["@type"]).toBe("HealthClub");
  expect(ld.name).toBe(site.name);
  expect(ld.telephone).toBe(site.contact.phone);
  expect(ld.address.streetAddress).toBe("77 Georges Street Upper");
  expect(ld.address.postalCode).toBe("A96 RX61");
  expect(ld.address.addressCountry).toBe("IE");
  expect(ld.sameAs).toEqual(site.social.map((s) => s.href));
  // must serialize cleanly for the inline script tag
  expect(() => JSON.stringify(ld)).not.toThrow();
});

test("sitemap covers the indexable routes; /faqs only once it has entries", () => {
  const urls = sitemap().map((e) => e.url.replace(SITE_URL, ""));
  const expected = ["/", "/facility", "/packages", "/get-started", "/contact"];
  if (loadFaqs().length > 0) expected.push("/faqs");
  expect(urls.sort()).toEqual(expected.sort());
});

test("robots allows everything and points at the sitemap", () => {
  const r = robots();
  expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
  expect(rules.every((x) => x.allow === "/")).toBe(true);
  const agents = rules.flatMap((x) => x.userAgent);
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) expect(agents).toContain(bot);
});

test("every page has a unique title and description, a canonical URL, and a description under 160 chars", () => {
  const titles = new Set<string>();
  for (const name of PAGE_NAMES) {
    const m = pageMetadata(name);
    const page = loadPage(name);
    expect(m.alternates?.canonical).toBe(name === "home" ? "/" : `/${name}`);
    expect(page.description.length).toBeLessThanOrEqual(160);
    titles.add(page.title);
  }
  expect(titles.size).toBe(PAGE_NAMES.length);
  expect(pageMetadata("home").title).toEqual({ absolute: `${loadPage("home").title} — ${loadSite().name}` });
});

test("/faqs is noindex while it has no entries", () => {
  if (loadFaqs().length > 0) return;
  expect(pageMetadata("faqs").robots).toEqual({ index: false, follow: true });
  expect(pageMetadata("packages").robots).toBeUndefined();
});

test("JSON-LD lists every package as an offer and links the website to the business", () => {
  const site = loadSite();
  const ld = buildLocalBusinessJsonLd(site);
  expect(ld.makesOffer.map((o) => o.name)).toEqual(loadPackages().map((p) => p.name));
  expect(ld.makesOffer.every((o) => o.priceCurrency === "EUR")).toBe(true);
  expect(buildWebSiteJsonLd(site).publisher["@id"]).toBe(ld["@id"]);
});

test("llms.txt carries prices, the timetable and contact details from content", () => {
  const txt = buildLlmsTxt();
  const site = loadSite();
  expect(txt.startsWith(`# ${site.name}`)).toBe(true);
  for (const p of loadPackages()) expect(txt).toContain(`${p.name}: €${p.price}`);
  for (const s of loadV2Home().timetable.schedules) expect(txt).toContain(`### ${s.tab}`);
  expect(txt).toContain("- Monday: 6:10 AM Reformer Pilates, 7:10 AM Reformer Pilates");
  expect(txt).toContain(site.contact.phone);
  if (loadFaqs().length === 0) expect(txt).not.toContain("/faqs");
});
