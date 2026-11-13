import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadFaqs, loadPackages, loadSite, loadTestimonials, loadV2Home } from "@/lib/content/load";
import V2HomePage from "./page";
import { Reveal } from "./_components/Reveal";
import { V2Footer, footerLinks } from "./_components/V2Footer";
import { V2_CONFIG } from "./_lib/config";
import { formatPhone } from "./_lib/contact";
import { ctaIdFor, fillPrice, morePackages, pickPackages, priceParts } from "./_lib/packages";
import { pushCta } from "./_lib/track";

vi.mock("next/navigation", () => ({ usePathname: () => "/v2" }));

const v2 = loadV2Home();
const site = loadSite();

test("page renders one h1 and the design's section order", () => {
  const { container } = render(<V2HomePage />);
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  const ids = [...container.querySelectorAll("main > section")].map((s) => s.id);
  expect(ids).toEqual(["top", "offering", "facility", "getting-started", "packages", "reviews", "visit"]);
  const labels = [...container.querySelectorAll(".v2-label b")].map((b) => b.textContent);
  expect(labels).toEqual(["01", "02", "03", "04", "05", "06"]);
});

test("every visible string comes from content (spot checks per section)", () => {
  render(<V2HomePage />);
  for (const text of [
    v2.hero.eyebrow,
    v2.hero.lead,
    v2.offering.heading,
    v2.facility.heading,
    v2.gettingStarted.heading,
    v2.gettingStarted.timeline.heading,
    v2.packages.heading,
    v2.reviews.heading,
    v2.visit.heading,
  ]) {
    expect(screen.getByText(text)).toBeDefined();
  }
});

test("offering: four cards — Golf and Trackman merged, Recovery restored with the sauna photo", () => {
  const { container } = render(<V2HomePage />);
  const cards = [...container.querySelectorAll("#offering .v2-ocard")];
  expect(cards.map((c) => c.querySelector("h3")?.textContent)).toEqual([
    "Strength",
    "Golf",
    "Reformer Pilates",
    "Recovery & Relaxation",
  ]);
  expect(container.querySelector("#offering")?.textContent).not.toContain("Trackman Simulator");
  expect(cards[3].querySelector("img")?.getAttribute("src")).toContain("sauna.jpg");
  // decorative widgets stay out of the accessibility tree
  for (const c of cards) expect(c.querySelector(".v2-mock")?.getAttribute("aria-hidden")).toBe("true");
});

test("facility: five photo tiles with captions from content", () => {
  const { container } = render(<V2HomePage />);
  const tiles = container.querySelectorAll("#facility figure");
  expect(tiles).toHaveLength(5);
  v2.facility.tiles.forEach((t, i) => expect(tiles[i].textContent).toContain(t.caption));
});

test("getting started: portrait plus a three-point timeline", () => {
  const { container } = render(<V2HomePage />);
  const steps = container.querySelectorAll("#getting-started ol > li");
  expect(steps).toHaveLength(3);
  v2.gettingStarted.timeline.steps.forEach((s, i) => {
    expect(steps[i].querySelector("h3")?.textContent).toBe(s.title);
  });
  expect(container.querySelector("#getting-started img")?.getAttribute("alt")).toBe(v2.gettingStarted.image.alt);
});

test("packages: three cards from content with one highlight, Buy Now via getPackageCta", () => {
  const { container } = render(<V2HomePage />);
  for (const pkg of pickPackages(loadPackages(), V2_CONFIG.packageIds)) {
    const link = container.querySelector(`[data-cta-location="packages"][data-cta-id="${ctaIdFor(pkg)}"]`);
    expect(link?.getAttribute("href")).toBe(pkg.purchaseUrl);
    expect(link?.textContent).toBe(site.purchaseCtaLabel);
  }
  expect(container.querySelectorAll(".v2-pcard--hi")).toHaveLength(1);
  expect(priceParts({ price: 120, billing: "one-time" })).toEqual({ amount: "€120", per: " one time" });
});

test("packages: compact list carries every other Pilates and online package, driven by packages.json", () => {
  const all = loadPackages();
  const groups = morePackages(all, v2.packages.moreCategories, V2_CONFIG.packageIds);
  expect(groups.map((g) => g.packages.map((p) => p.id))).toEqual([
    ["pilates-membership", "reformer-10", "reformer-intro-5"],
    ["online-coaching"],
  ]);
  const { container } = render(<V2HomePage />);
  const more = container.querySelector(".v2-more") as HTMLElement;
  expect(within(more).getByText(site.packageCategories.pilates)).toBeDefined();
  for (const g of groups)
    for (const p of g.packages) {
      const link = more.querySelector(`[data-cta-id="${ctaIdFor(p)}"]`);
      expect(link?.getAttribute("href")).toBe(p.purchaseUrl);
      expect(more.textContent).toContain(`€${p.price}`);
    }
});

test("reviews: all five Google reviews, word for word", () => {
  const { container } = render(<V2HomePage />);
  const quotes = [...container.querySelectorAll("#reviews blockquote")].map((b) => b.textContent);
  expect(quotes).toHaveLength(5);
  expect(new Set(quotes)).toEqual(new Set(loadTestimonials().map((t) => t.quote)));
});

test("visit: discovery call, phone, email and the existing WhatsApp link", () => {
  const { container } = render(<V2HomePage />);
  const visit = container.querySelector("#visit") as HTMLElement;
  expect(visit.querySelector('[data-cta-id="whatsapp"]')?.getAttribute("href")).toBe(site.links.whatsapp);
  expect(visit.querySelector('[data-cta-id="book_discovery_call"]')?.getAttribute("href")).toBe(site.links.booking);
  expect(visit.querySelector('[data-cta-id="call"]')?.textContent).toBe(formatPhone(site.contact.phone));
});

test("footer drops FAQs while faqs.json is empty", () => {
  expect(loadFaqs()).toHaveLength(0);
  const { container } = render(<V2Footer name={site.name} footer={v2.footer} faqCount={0} />);
  expect(container.querySelector('a[href="/faqs"]')).toBeNull();
  expect(footerLinks(v2.footer.links, 3).some((l) => l.href === "/faqs")).toBe(true);
  expect(container.textContent).not.toContain("AEGIS");
});

test("sticky pill promotes the configured package at its content price", () => {
  const { container } = render(<V2HomePage />);
  const pill = container.querySelector(".v2-pill");
  const [trial] = pickPackages(loadPackages(), [V2_CONFIG.stickyPill.packageId]);
  expect(pill?.getAttribute("href")).toBe(trial.purchaseUrl);
  expect(pill?.textContent).toContain(fillPrice(v2.stickyPill.label, trial));
  // starts hidden (hero on screen) and inert
  expect(pill?.getAttribute("data-hidden")).toBe("true");
});

test("hero image is the priority image; others are lazy", () => {
  const html = renderToStaticMarkup(<V2HomePage />);
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  const hero = imgs.find((i) => i.includes("signage-founders"));
  expect(hero).toMatch(/fetchPriority="high"|fetchpriority="high"/);
  expect(imgs.filter((i) => /loading="lazy"/.test(i)).length).toBe(imgs.length - 1);
});

test("pickPackages fails loudly when a configured id is gone", () => {
  expect(() => pickPackages(loadPackages(), ["no-such-package"])).toThrow(/no-such-package/);
});

test("Reveal content is visible without JS (no hidden state in server HTML)", () => {
  const html = renderToStaticMarkup(<Reveal>hello</Reveal>);
  expect(html).not.toContain("data-reveal");
  expect(html).toContain("hello");
});

test("phone number is grouped for display", () => {
  expect(formatPhone("+353 874094321")).toBe("+353 87 409 4321");
  expect(formatPhone("01 234 5678")).toBe("01 234 5678");
});

test("CTA clicks push cta_click with id and location to dataLayer", () => {
  pushCta("book_trial", "sticky_pill");
  const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
  expect(dl.at(-1)).toEqual({ event: "cta_click", cta_id: "book_trial", cta_location: "sticky_pill" });
});
