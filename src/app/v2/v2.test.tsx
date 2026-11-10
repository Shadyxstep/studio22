import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadPackages, loadSite } from "@/lib/content/load";
import V2HomePage from "./page";
import { Reveal } from "./_components/Reveal";
import { V2_CONFIG } from "./_lib/config";
import { formatPhone } from "./_lib/contact";
import { ctaIdFor, pickPackages, priceParts, shortName } from "./_lib/packages";
import { pushCta } from "./_lib/track";

vi.mock("next/navigation", () => ({ usePathname: () => "/v2" }));

test("page renders one h1 and every content section", () => {
  const { container } = render(<V2HomePage />);
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  for (const id of ["top", "offering", "packages", "reviews", "visit"]) {
    expect(container.querySelector(`#${id}`)).not.toBeNull();
  }
  expect(screen.getByText("Start today, feel better tomorrow.")).toBeDefined();
});

test("packages come from content/packages.json with one configurable highlight", () => {
  const { container } = render(<V2HomePage />);
  const site = loadSite();
  for (const pkg of pickPackages(loadPackages(), V2_CONFIG.packageIds)) {
    const link = container.querySelector(`[data-cta-id="${ctaIdFor(pkg)}"]`);
    expect(link?.getAttribute("href")).toBe(pkg.purchaseUrl);
    expect(screen.getByText(shortName(pkg.name))).toBeDefined();
    expect(link?.textContent).toBe(site.purchaseCtaLabel);
  }
  expect(container.querySelectorAll(".v2-card--highlight")).toHaveLength(1);
  expect(ctaIdFor({ id: "complete-studio" })).toBe("buy_now_complete_studio");
  expect(priceParts({ price: 120, billing: "one-time" })).toEqual({ amount: "€120", per: " one time" });
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
