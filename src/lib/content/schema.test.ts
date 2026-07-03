import { describe, expect, test } from "vitest";
import {
  BILLING,
  PACKAGE_CATEGORIES,
  PageSchema,
  PackagesSchema,
  PILLARS,
  SECTION_TYPES,
} from "./schema";
import { ContentValidationError, parseContent } from "./load";

describe("SPEC §6.1 constants", () => {
  test("section types match the closed library exactly", () => {
    expect(SECTION_TYPES).toEqual([
      "hero",
      "pillarGrid",
      "editorialSplit",
      "statBar",
      "packageGrid",
      "packageTeaser",
      "testimonials",
      "gallery",
      "faqAccordion",
      "ctaBanner",
      "contactPanel",
      "bookingEmbed",
    ]);
  });

  test("catalog vocabularies match SPEC", () => {
    expect(PACKAGE_CATEGORIES).toEqual(["gym", "pilates", "online-golf"]);
    expect(BILLING).toEqual(["weekly", "one-time"]);
    expect(PILLARS).toEqual(["gym", "golf", "pilates", "recovery"]);
  });
});

describe("page schema", () => {
  const validPage = {
    title: "Home",
    description: "A description",
    sections: [
      {
        type: "hero",
        headline: "The Future of Wellness.",
        sub: "Movement. Strength. Recovery. Community",
        ctas: [{ label: "book a discovery call", href: "https://example.com" }],
      },
      { type: "pillarGrid", pillars: ["gym", "golf", "pilates", "recovery"] },
      { type: "ctaBanner", variant: "discovery-call" },
    ],
  };

  test("a valid page parses", () => {
    const page = parseContent(PageSchema, validPage, "test.json");
    expect(page.sections).toHaveLength(3);
    expect(page.sections[0].type).toBe("hero");
  });

  test("an unknown section type throws ContentValidationError", () => {
    const bad = {
      ...validPage,
      sections: [{ type: "carousel", headline: "nope" }],
    };
    expect(() => parseContent(PageSchema, bad, "test.json")).toThrow(
      ContentValidationError,
    );
  });

  test("an invalid field throws with the source and path in the message", () => {
    const bad = {
      ...validPage,
      sections: [{ type: "hero", headline: 42 }],
    };
    try {
      parseContent(PageSchema, bad, "pages/home.json");
      expect.unreachable("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(ContentValidationError);
      const msg = (e as Error).message;
      expect(msg).toContain("pages/home.json");
      expect(msg).toContain("headline");
    }
  });
});

describe("package catalog schema", () => {
  const pkg = {
    id: "performance",
    category: "gym",
    name: "Performance Package",
    price: 75,
    billing: "weekly",
    features: [],
    purchasable: false,
  };

  test("a valid catalog parses", () => {
    expect(parseContent(PackagesSchema, [pkg], "packages.json")).toHaveLength(
      1,
    );
  });

  test("duplicate ids are rejected", () => {
    expect(() =>
      parseContent(PackagesSchema, [pkg, pkg], "packages.json"),
    ).toThrow(/unique/);
  });

  test("a non-numeric price is rejected", () => {
    expect(() =>
      parseContent(PackagesSchema, [{ ...pkg, price: "75" }], "packages.json"),
    ).toThrow(ContentValidationError);
  });
});
