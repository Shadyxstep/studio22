import { describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/test";
import { getCurrentVersion, getSite } from "@/lib/db/versions";
import { versions } from "@/lib/db/schema";
import { ContentSchema } from "./content-types";
import { buildSeedContent, seedSite, withSectionIds } from "./seed";
import { loadPage } from "./load";

describe("withSectionIds", () => {
  it("assigns deterministic page.type.n ids and preserves existing ids", () => {
    const page = withSectionIds("home", loadPage("home"));
    const ids = page.sections.map((s) => s.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(ids[0]).toBe(`home.${page.sections[0].type}.0`);
    // nth-of-type counter: two sections of the same type get .0 and .1
    const byType = new Map<string, string[]>();
    for (const s of page.sections) {
      byType.set(s.type, [...(byType.get(s.type) ?? []), s.id as string]);
    }
    for (const [type, list] of byType) {
      expect(list).toEqual(list.map((_, n) => `home.${type}.${n}`));
    }
    // idempotent: already-assigned ids are preserved verbatim
    expect(withSectionIds("home", page).sections.map((s) => s.id)).toEqual(ids);
  });
});

describe("buildSeedContent", () => {
  it("produces a document that satisfies the DB content schema", () => {
    const content = buildSeedContent();
    expect(() => ContentSchema.parse(content)).not.toThrow();
    expect(Object.keys(content.pages)).toHaveLength(7);
    expect(content.packages.length).toBeGreaterThan(0);
  });
});

describe("seedSite", () => {
  it("seeds once and is exactly idempotent on re-run", async () => {
    const { db, client } = await createTestDb();
    try {
      const first = await seedSite(db);
      expect(first.created).toBe(true);

      const site = await getSite(db);
      expect(site?.currentVersionId).toBeTruthy();

      const current = await getCurrentVersion(db);
      expect(current?.author).toBe("seed");
      expect(current?.parentVersionId).toBeNull();
      // content round-trips the schema from JSONB
      expect(() => ContentSchema.parse(current?.content)).not.toThrow();

      const second = await seedSite(db);
      expect(second.created).toBe(false);
      const allVersions = await db.select().from(versions);
      expect(allVersions).toHaveLength(1);
    } finally {
      await client.close();
    }
  });
});
