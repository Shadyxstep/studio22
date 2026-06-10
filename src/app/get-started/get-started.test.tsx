import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import GetStartedPage from "./page";
import { loadPage, loadSite } from "@/lib/content/load";

vi.mock("next/navigation", () => ({ usePathname: () => "/get-started" }));

test("get-started renders the three steps with their CTAs", () => {
  render(<GetStartedPage />);
  const site = loadSite();

  expect(screen.getByText("Not sure where to start?")).toBeDefined();
  expect(screen.getByText("Ready to go ?")).toBeDefined();
  expect(screen.getByText("Need more information?")).toBeDefined();

  const booking = screen.getByRole("link", { name: "Book A Discovery Call" });
  expect(booking.getAttribute("href")).toBe(site.links.booking);

  const whatsapp = screen.getByRole("link", { name: "Join Us" });
  expect(whatsapp.getAttribute("href")).toBe(site.links.whatsapp);
});

test("the five-week timeline renders verbatim phase headlines", () => {
  render(<GetStartedPage />);
  for (const phase of [
    "Week 1 – Foundational Phase",
    "Week 2 – Accumulation Phase",
    "Week 3 – Intensification Phase 1",
    "Week 4 – Intensification Phase 2",
    "Week 5 - Realisation Phase",
  ]) {
    expect(screen.getByText(phase)).toBeDefined();
  }
});

test("the sign-up flow slot (packageGrid) is present for T3.1", () => {
  const page = loadPage("get-started");
  expect(page.sections.some((s) => s.type === "packageGrid")).toBe(true);
});
