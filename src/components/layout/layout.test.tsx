import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { loadSite } from "@/lib/content/load";
import { buildMailto } from "@/lib/mailto";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const site = loadSite();

test("Nav renders every nav item from site.json and nothing hardcoded", () => {
  render(<Nav site={site} />);
  for (const item of site.nav) {
    expect(
      screen.getAllByRole("link", { name: item.label }).length,
    ).toBeGreaterThan(0);
  }
});

test("Footer renders contact details, social and footer links from site.json", () => {
  render(<Footer site={site} />);
  expect(screen.getByText(site.contact.address)).toBeDefined();
  expect(screen.getByText(site.contact.phone)).toBeDefined();
  expect(screen.getByText(site.contact.email)).toBeDefined();
  expect(screen.getByText(site.copyright)).toBeDefined();
  for (const s of site.social) {
    expect(screen.getByRole("link", { name: s.label })).toBeDefined();
  }
  const mail = screen.getByText(site.contact.email).closest("a");
  expect(mail?.getAttribute("href")).toBe(
    buildMailto(site.contact.email, site.contact.mailtoSubject),
  );
});
