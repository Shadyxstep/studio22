import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FaqsPage from "./faqs/page";
import ContactPage from "./contact/page";
import { loadFaqs, loadSite } from "@/lib/content/load";
import { buildMailto } from "@/lib/mailto";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const site = loadSite();

test("faqs renders the accordion, or the contact-email empty state while faqs.json is empty", () => {
  render(<FaqsPage />);
  expect(screen.getByRole("heading", { name: "FAQs" })).toBeDefined();
  const faqs = loadFaqs();
  if (faqs.length === 0) {
    const link = screen.getByRole("link", { name: site.contact.email });
    expect(link.getAttribute("href")).toContain("mailto:");
  } else {
    for (const f of faqs) {
      expect(screen.getByText(f.question)).toBeDefined();
    }
  }
});

test("contact renders tel, mailto, map address and review CTA from site.json", () => {
  render(<ContactPage />);

  const tel = screen.getByRole("link", { name: site.contact.phone });
  expect(tel.getAttribute("href")).toBe(`tel:${site.contact.phone}`);

  const mail = screen.getByRole("link", { name: site.contact.email });
  expect(mail.getAttribute("href")).toBe(
    buildMailto(site.contact.email, site.contact.mailtoSubject),
  );

  const map = screen.getByRole("link", { name: site.contact.address });
  expect(map.getAttribute("href")).toBe(site.links.map);

  const review = screen.getByRole("link", { name: site.reviewCta.label });
  expect(review.getAttribute("href")).toBe(site.reviewCta.href);
});
