import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { loadPage } from "@/lib/content/load";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

/* Copy may span inline elements (e.g. the hero's italic accent), so match
 * on normalized textContent rather than a single text node. */
const containsText =
  (text: string) =>
  (_: string, el: Element | null): boolean =>
    el?.textContent?.replace(/\s+/g, " ").includes(text) ?? false;

test("home renders entirely from pages/home.json", async () => {
  render(await Home());
  const page = loadPage("home");

  expect(
    screen.getByRole("heading", { name: /the future of wellness/i }),
  ).toBeDefined();

  const types = page.sections.map((s) => s.type);
  expect(types).toEqual([
    "hero",
    "pillarGrid",
    "editorialSplit",
    "packageTeaser",
    "testimonials",
    "ctaBanner",
  ]);

  for (const s of page.sections) {
    if ("heading" in s && s.heading) {
      expect(
        screen.getAllByText(containsText(s.heading)).length,
      ).toBeGreaterThan(0);
    }
    if ("headline" in s && s.headline) {
      expect(
        screen.getAllByText(containsText(s.headline)).length,
      ).toBeGreaterThan(0);
    }
  }
});

test("the hero image is the priority image", async () => {
  render(await Home());
  const hero = screen.getByRole("img", {
    name: /founders beneath the backlit/i,
  });
  expect(hero.getAttribute("fetchpriority") ?? hero.getAttribute("loading")).not.toBe(
    "lazy",
  );
});
