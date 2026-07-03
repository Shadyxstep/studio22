import { expect, test } from "vitest";
import { buildLocalBusinessJsonLd, SITE_URL } from "./seo";
import { loadSite } from "./content/load";
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

test("sitemap covers the six page routes (no blog entries without a DB)", async () => {
  const urls = (await sitemap()).map((e) => e.url.replace(SITE_URL, ""));
  expect(urls.sort()).toEqual(
    ["/", "/facility", "/packages", "/get-started", "/faqs", "/contact"].sort(),
  );
});

test("robots allows everything and points at the sitemap", () => {
  const r = robots();
  expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
});
