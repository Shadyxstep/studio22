import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FacilityPage from "./page";
import { loadPage } from "@/lib/content/load";

vi.mock("next/navigation", () => ({ usePathname: () => "/facility" }));

test("facility renders an editorial per pillar plus gallery from pages/facility.json", async () => {
  render(await FacilityPage());
  const page = loadPage("facility");

  const splits = page.sections.filter((s) => s.type === "editorialSplit");
  expect(splits.length).toBeGreaterThanOrEqual(4);
  for (const s of splits) {
    expect(
      screen.getAllByText(s.headline, { exact: false }).length,
    ).toBeGreaterThan(0);
  }

  const gallery = page.sections.find((s) => s.type === "gallery");
  expect(gallery).toBeDefined();
  if (gallery?.type === "gallery") {
    for (const img of gallery.images) {
      expect(screen.getAllByAltText(img.alt).length).toBeGreaterThan(0);
    }
  }
});
