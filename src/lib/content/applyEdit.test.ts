import { describe, expect, it } from "vitest";
import { createTestDb, type TestDbHandle } from "@/lib/db/test";
import { versions } from "@/lib/db/schema";
import { getCurrentVersion } from "@/lib/db/versions";
import { applyEdit } from "./applyEdit";
import { canRedo, canUndo, redo, undo } from "./undo";
import { seedSite } from "./seed";
import { OpError } from "./ops";

async function seeded(): Promise<TestDbHandle> {
  const handle = await createTestDb();
  await seedSite(handle.db);
  return handle;
}

describe("applyEdit (PGlite)", () => {
  it("one call = one new parent-linked version and the pointer advances", async () => {
    const { db, client } = await seeded();
    try {
      const before = await getCurrentVersion(db);
      const homeId = before!.content.pages.home.sections[0].id as string;

      const version = await applyEdit(
        db,
        [{ type: "setProp", page: "home", sectionId: homeId, path: ["headline"], value: "Edited" }],
        { author: "owner", opSummary: "edit hero headline" },
      );

      expect(version.parentVersionId).toBe(before!.id);
      const current = await getCurrentVersion(db);
      expect(current!.id).toBe(version.id);
      expect(
        (current!.content.pages.home.sections[0] as { headline?: string }).headline,
      ).toBe("Edited");
      expect(await db.select().from(versions)).toHaveLength(2);
    } finally {
      await client.close();
    }
  });

  it("a failing batch writes nothing", async () => {
    const { db, client } = await seeded();
    try {
      const before = await getCurrentVersion(db);
      await expect(
        applyEdit(
          db,
          [{ type: "removeSection", page: "home", sectionId: "ghost" }],
          { author: "agent" },
        ),
      ).rejects.toThrow(OpError);
      expect(await db.select().from(versions)).toHaveLength(1);
      expect((await getCurrentVersion(db))!.id).toBe(before!.id);
    } finally {
      await client.close();
    }
  });

  it("undo restores the parent as a NEW version; redo reapplies; never destructive", async () => {
    const { db, client } = await seeded();
    try {
      const seed = await getCurrentVersion(db);
      const homeId = seed!.content.pages.home.sections[0].id as string;
      expect(await canUndo(db)).toBe(false);

      await applyEdit(
        db,
        [{ type: "setProp", page: "home", sectionId: homeId, path: ["headline"], value: "V2" }],
        { author: "owner" },
      );
      expect(await canUndo(db)).toBe(true);
      expect(await canRedo(db)).toBe(false);

      const undone = await undo(db);
      expect(undone.author).toBe("undo");
      expect(undone.content).toEqual(seed!.content);
      expect(await canRedo(db)).toBe(true);

      const redone = await redo(db);
      expect(
        (redone.content.pages.home.sections[0] as { headline?: string }).headline,
      ).toBe("V2");

      // append-only: seed + edit + undo + redo = 4 rows, all retained
      expect(await db.select().from(versions)).toHaveLength(4);
      await expect(redo(db)).rejects.toThrow("nothing to redo");
    } finally {
      await client.close();
    }
  });
});
