import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { REGISTERED_SECTION_TYPES, SectionRenderer } from "./index";
import { loadGlobals } from "@/lib/content/load";
import { SECTION_TYPES, type Section } from "@/lib/content/schema";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const globals = loadGlobals();
const img = { src: "/images/sauna.jpg", alt: "A test image" };

/* One fixture per section type — registry coverage is enforced by type + test. */
const fixtures: Record<(typeof SECTION_TYPES)[number], Section> = {
  hero: {
    type: "hero",
    label: "A label",
    headline: "A hero headline",
    sub: "A hero sub",
    image: img,
    ctas: [{ label: "A hero cta", href: "/packages" }],
  },
  pillarGrid: {
    type: "pillarGrid",
    heading: "A pillar heading",
    tagline: "A pillar tagline",
    pillars: ["gym", "golf", "pilates", "recovery"],
  },
  editorialSplit: {
    type: "editorialSplit",
    label: "A split label",
    headline: "A split headline",
    paragraphs: ["A split paragraph"],
    bullets: ["A split bullet"],
    image: img,
    cta: { label: "A split cta", href: "/contact" },
  },
  statBar: {
    type: "statBar",
    stats: [{ value: "99%", label: "A stat label" }],
  },
  packageGrid: { type: "packageGrid", heading: "A grid heading" },
  packageTeaser: {
    type: "packageTeaser",
    heading: "A teaser heading",
    cta: { label: "A teaser cta", href: "/packages" },
  },
  testimonials: { type: "testimonials", heading: "A testimonial heading" },
  gallery: { type: "gallery", heading: "A gallery heading", images: [img] },
  faqAccordion: { type: "faqAccordion", heading: "An faq heading" },
  ctaBanner: {
    type: "ctaBanner",
    variant: "discovery-call",
    headline: "A banner headline",
    body: "A banner body",
    cta: { label: "A banner cta", href: "https://example.com" },
  },
  contactPanel: { type: "contactPanel", heading: "A contact heading" },
};

/* What we assert appears for each type. */
const expectedText: Record<(typeof SECTION_TYPES)[number], string[]> = {
  hero: ["A hero headline", "A hero sub", "A hero cta"],
  pillarGrid: ["A pillar heading", globals.site.pillars.gym!.label],
  editorialSplit: ["A split headline", "A split paragraph", "A split bullet"],
  statBar: ["99%", "A stat label"],
  packageGrid: [
    "A grid heading",
    globals.site.packageCategories.gym!,
    globals.packages[0]!.name,
    globals.site.sauna.heading,
  ],
  packageTeaser: ["A teaser heading", globals.packages[0]!.name],
  testimonials: [
    "A testimonial heading",
    globals.testimonials[0]!.name,
    globals.site.reviewCta.label,
  ],
  gallery: ["A gallery heading"],
  faqAccordion: ["An faq heading", globals.site.contact.email],
  ctaBanner: ["A banner headline", "A banner body", "A banner cta"],
  contactPanel: [
    "A contact heading",
    globals.site.contact.phone,
    globals.site.contact.address,
  ],
};

describe("section component library", () => {
  test("registry covers exactly SECTION_TYPES", () => {
    expect([...REGISTERED_SECTION_TYPES].sort()).toEqual(
      [...SECTION_TYPES].sort(),
    );
  });

  for (const type of SECTION_TYPES) {
    test(`${type} renders its fixture content`, () => {
      const { unmount } = render(
        <SectionRenderer sections={[fixtures[type]]} globals={globals} />,
      );
      for (const text of expectedText[type]) {
        expect(
          screen.getAllByText(text, { exact: false }).length,
          `expected "${text}" in ${type}`,
        ).toBeGreaterThan(0);
      }
      unmount();
    });
  }

  test("an unknown section type throws at render", () => {
    const rogue = { type: "carousel", headline: "nope" } as unknown as Section;
    expect(() =>
      render(<SectionRenderer sections={[rogue]} globals={globals} />),
    ).toThrow(/Unknown section type/);
  });
});
