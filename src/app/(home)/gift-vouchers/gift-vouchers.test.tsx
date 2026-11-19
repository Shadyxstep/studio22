import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { loadGiftVouchers, loadSite, loadV2Home } from "@/lib/content/load";
import { V2Nav } from "../_components/V2Nav";
import { groupPrice, lowestPrice, voucherCtaId } from "../_lib/vouchers";
import GiftVouchersPage, { generateMetadata } from "./page";

vi.mock("next/navigation", () => ({ usePathname: () => "/gift-vouchers" }));

const gv = loadGiftVouchers();
const vouchers = gv.groups.flatMap((g) => g.vouchers);

/* Prices and purchase links as supplied by the owner (Nov 2026). */
const OWNER: Array<[string, number, string]> = [
  ["10 Reformer Pilates classes", 225, "https://fitness.studio-22.ie/products/23349/purchase"],
  ["20 Reformer Pilates classes", 425, "https://fitness.studio-22.ie/products/23350/purchase"],
  ["5 hours on the TrackMan simulator", 225, "https://fitness.studio-22.ie/products/23910/purchase"],
  ["10 hours on the TrackMan simulator", 450, "https://fitness.studio-22.ie/products/23351/purchase"],
  ["2 months Full Studio membership", 600, "https://fitness.studio-22.ie/products/23352/purchase"],
];

test("content carries the owner's five vouchers, in order", () => {
  expect(vouchers.map((v) => [v.name, v.price, v.purchaseUrl])).toEqual(OWNER);
  expect(new Set(vouchers.map((v) => v.id)).size).toBe(vouchers.length);
});

test("every voucher image exists in public/", () => {
  for (const v of vouchers)
    expect(fs.existsSync(path.join(process.cwd(), "public", v.image.src)), `missing image: ${v.image.src}`).toBe(true);
});

test("page: one h1, three steps, a group section per kind of voucher", () => {
  const { container } = render(<GiftVouchersPage />);
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(container.querySelectorAll(".v2-gvp__steps > li")).toHaveLength(3);
  const ids = [...container.querySelectorAll("main > section[id]")].map((s) => s.id);
  expect(ids).toEqual(["top", ...gv.groups.map((g) => g.id)]);
  for (const text of [gv.hero.lead, gv.notes.expiry.body, ...gv.notes.find.lines]) {
    expect(screen.getByText(text)).toBeDefined();
  }
});

test("page: every voucher has its price and a Buy link to its own purchase page", () => {
  const { container } = render(<GiftVouchersPage />);
  const cards = [...container.querySelectorAll(".v2-gcard")];
  expect(cards).toHaveLength(OWNER.length);
  cards.forEach((card, i) => {
    const [name, price, url] = OWNER[i];
    expect(card.querySelector("h3")?.textContent).toBe(name);
    expect(card.querySelector("strong")?.textContent).toBe(`€${price}`);
    const link = card.querySelector("a");
    expect(link?.getAttribute("href")).toBe(url);
    expect(link?.getAttribute("data-cta-id")).toBe(voucherCtaId(vouchers[i]));
    expect(link?.getAttribute("aria-label")).toBe(`${gv.buyLabel}: ${name}`);
  });
});

test("page: questions link emails the studio", () => {
  const { container } = render(<GiftVouchersPage />);
  const email = loadSite().contact.email;
  expect(container.querySelector(".v2-gvp__notes a")?.getAttribute("href")).toContain(`mailto:${email}`);
});

test("metadata comes from content, with its own canonical URL", () => {
  const meta = generateMetadata();
  expect(meta.title).toBe(gv.title);
  expect(meta.description).toBe(gv.description);
  expect(meta.alternates?.canonical).toBe("/gift-vouchers");
});

test("price helpers", () => {
  expect(lowestPrice(gv.groups)).toBe(225);
  expect(gv.groups.map((g) => groupPrice("From {price}", g))).toEqual(["From €225", "From €225", "€600"]);
});

test("nav: gift vouchers link, and homepage anchors point home from this page", () => {
  const nav = loadV2Home().nav;
  expect(nav.links.some((l) => l.href === "/gift-vouchers")).toBe(true);
  const { container } = render(<V2Nav name="Studio 22" nav={nav} />);
  const hrefs = [...container.querySelectorAll(".v2-nav__links a")].map((a) => a.getAttribute("href"));
  expect(hrefs).toContain("/gift-vouchers");
  expect(hrefs).toContain("/#timetable");
  expect(hrefs).not.toContain("#timetable");
});
