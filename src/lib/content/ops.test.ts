import { describe, expect, it } from "vitest";
import { buildSeedContent } from "./seed";
import { applyOps, editOpSchema, OpError, type EditOp } from "./ops";
import type { Content } from "./content-types";

const content: Content = buildSeedContent();
const homeFirst = content.pages.home.sections[0];

describe("applyOps — happy paths", () => {
  it("setProp edits a section field on the addressed page only", () => {
    const next = applyOps(content, [
      {
        type: "setProp",
        page: "home",
        sectionId: homeFirst.id as string,
        path: ["headline"],
        value: "New headline",
      },
    ]);
    const edited = next.pages.home.sections[0] as { headline?: string };
    expect(edited.headline).toBe("New headline");
    // pure: the input document is untouched
    expect((homeFirst as { headline?: string }).headline).not.toBe("New headline");
    // other pages untouched
    expect(next.pages.facility).toEqual(content.pages.facility);
  });

  it("setGlobal with a deep path edits a global entity; [] replaces the whole target", () => {
    const next = applyOps(content, [
      { type: "setGlobal", target: "site", path: ["contact", "phone"], value: "+353 1 555 0000" },
    ]);
    expect(next.site.contact.phone).toBe("+353 1 555 0000");

    const faqs = [{ question: "When are you open?", answer: "Daily." }];
    const replaced = applyOps(content, [
      { type: "setGlobal", target: "faqs", path: [], value: faqs },
    ]);
    expect(replaced.faqs).toEqual(faqs);
  });

  it("insert, move, remove address one page's section list", () => {
    const node = {
      type: "ctaBanner" as const,
      id: "home.ctaBanner.99",
      variant: "custom" as const,
      headline: "Try us",
      cta: { label: "Book", href: "/book" },
    };
    const inserted = applyOps(content, [
      { type: "insertSection", page: "home", index: 0, node },
    ]);
    expect(inserted.pages.home.sections[0].id).toBe("home.ctaBanner.99");

    const moved = applyOps(inserted, [
      { type: "moveSection", page: "home", sectionId: "home.ctaBanner.99", toIndex: 2 },
    ]);
    expect(moved.pages.home.sections[2].id).toBe("home.ctaBanner.99");

    const removed = applyOps(moved, [
      { type: "removeSection", page: "home", sectionId: "home.ctaBanner.99" },
    ]);
    expect(removed.pages.home.sections.map((s) => s.id)).toEqual(
      content.pages.home.sections.map((s) => s.id),
    );
  });
});

describe("applyOps — adversarial (every failure = zero mutation)", () => {
  const cases: { name: string; ops: EditOp[] }[] = [
    {
      name: "unknown section id",
      ops: [{ type: "setProp", page: "home", sectionId: "nope", path: ["headline"], value: "x" }],
    },
    {
      name: "right id, wrong page",
      ops: [
        {
          type: "removeSection",
          page: "facility",
          sectionId: homeFirst.id as string,
        },
      ],
    },
    {
      name: "insert index out of range",
      ops: [
        {
          type: "insertSection",
          page: "home",
          index: 999,
          node: { type: "faqAccordion", id: "home.faqAccordion.9" },
        },
      ],
    },
    {
      name: "duplicate section id on insert",
      ops: [
        {
          type: "insertSection",
          page: "home",
          index: 0,
          node: { type: "faqAccordion", id: homeFirst.id as string },
        },
      ],
    },
    {
      name: "schema-violating value (hero headline must be non-empty)",
      ops: [
        {
          type: "setProp",
          page: "home",
          sectionId: homeFirst.id as string,
          path: ["headline"],
          value: "",
        },
      ],
    },
    {
      name: "setProp path through a non-object",
      ops: [
        {
          type: "setProp",
          page: "home",
          sectionId: homeFirst.id as string,
          path: ["headline", "deep", "deeper"],
          value: "x",
        },
      ],
    },
    {
      name: "setGlobal producing an invalid package catalog (duplicate ids)",
      ops: [
        {
          type: "setGlobal",
          target: "packages",
          path: [],
          value: [content.packages[0], content.packages[0]],
        },
      ],
    },
  ];

  for (const { name, ops } of cases) {
    it(`rejects: ${name}`, () => {
      const before = structuredClone(content);
      expect(() => applyOps(content, ops)).toThrow(OpError);
      expect(content).toEqual(before);
    });
  }

  it("op schema rejects unknown pages and sections without ids", () => {
    expect(
      editOpSchema.safeParse({
        type: "setProp",
        page: "not-a-page",
        sectionId: "x",
        path: ["headline"],
        value: "x",
      }).success,
    ).toBe(false);
    expect(
      editOpSchema.safeParse({
        type: "insertSection",
        page: "home",
        index: 0,
        node: { type: "faqAccordion" }, // no id
      }).success,
    ).toBe(false);
  });

  it("a batch fails as a unit: one bad op means no changes from the good ones", () => {
    expect(() =>
      applyOps(content, [
        {
          type: "setProp",
          page: "home",
          sectionId: homeFirst.id as string,
          path: ["headline"],
          value: "Would be applied",
        },
        { type: "removeSection", page: "home", sectionId: "does-not-exist" },
      ]),
    ).toThrow(OpError);
  });
});
