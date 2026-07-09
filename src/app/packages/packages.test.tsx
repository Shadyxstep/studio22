import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PackagesPage from "./page";
import { loadGlobals } from "@/lib/content/load";
import { formatPrice } from "@/lib/format";
import { getPackageCta } from "@/lib/packages";

vi.mock("next/navigation", () => ({ usePathname: () => "/packages" }));

const globals = loadGlobals();

test("packages page renders all categories, packages and billing formats", () => {
  render(<PackagesPage />);

  for (const label of Object.values(globals.site.packageCategories)) {
    expect(screen.getByText(label)).toBeDefined();
  }
  for (const pkg of globals.packages) {
    expect(screen.getAllByText(pkg.name).length).toBeGreaterThan(0);
    expect(screen.getAllByText(formatPrice(pkg)).length).toBeGreaterThan(0);
  }
  // both billing models display correctly
  expect(screen.getAllByText("€75/week").length).toBeGreaterThan(0);
  expect(screen.getByText("One Time Payment: €225")).toBeDefined();
});

test("sauna perk banner renders from site.json", () => {
  render(<PackagesPage />);
  expect(screen.getByText(globals.site.sauna.heading)).toBeDefined();
  expect(screen.getByText(globals.site.sauna.body)).toBeDefined();
});

test("every package CTA goes through getPackageCta (one buy-now link per card)", () => {
  render(<PackagesPage />);
  const links = screen.getAllByRole("link", {
    name: new RegExp(globals.site.purchaseCtaLabel),
  });
  expect(links.length).toBe(globals.packages.length);
  const hrefs = links.map((l) => l.getAttribute("href"));
  for (const pkg of globals.packages) {
    expect(hrefs).toContain(getPackageCta(pkg, globals.site).href);
  }
});
