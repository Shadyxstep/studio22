import { describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/test";
import { getCurrentVersion } from "@/lib/db/versions";
import { versions } from "@/lib/db/schema";
import { seedSite } from "@/lib/content/seed";
import { fakePlanner } from "./planner";
import { realPlanner, type PlanCreate } from "./planner.anthropic";
import { execute } from "./executor";
import type { ToolCall } from "./tools";

async function seeded() {
  const handle = await createTestDb();
  await seedSite(handle.db);
  return handle;
}

describe("fake planner → executor (keyless e2e)", () => {
  it("chat request edits the hero headline as exactly one new version", async () => {
    const { db, client } = await seeded();
    try {
      const current = await getCurrentVersion(db);
      const planner = fakePlanner();
      const calls = await planner.plan(
        'change the home hero headline to "Train with intent"',
        current!.content,
      );
      expect(calls.length).toBe(1);

      const result = await execute(db, calls, "test edit");
      expect(result.applied).toBe(1);
      expect(result.rejected).toHaveLength(0);
      expect(result.version).not.toBeNull();

      const after = await getCurrentVersion(db);
      const hero = after!.content.pages.home.sections.find(
        (s) => s.type === "hero",
      ) as { headline?: string };
      expect(hero.headline).toBe("Train with intent");
      expect(await db.select().from(versions)).toHaveLength(2);
    } finally {
      await client.close();
    }
  });

  it("contact-detail request routes through set_global", async () => {
    const { db, client } = await seeded();
    try {
      const current = await getCurrentVersion(db);
      const calls = await fakePlanner().plan(
        'update the phone number to "+353 1 555 0123"',
        current!.content,
      );
      const result = await execute(db, calls);
      expect(result.applied).toBe(1);
      const after = await getCurrentVersion(db);
      expect(after!.content.site.contact.phone).toBe("+353 1 555 0123");
    } finally {
      await client.close();
    }
  });

  it("an unmappable request plans zero calls and writes nothing", async () => {
    const { db, client } = await seeded();
    try {
      const current = await getCurrentVersion(db);
      const calls = await fakePlanner().plan(
        "what's the weather like today?",
        current!.content,
      );
      expect(calls).toHaveLength(0);
      const result = await execute(db, calls);
      expect(result.version).toBeNull();
      expect(await db.select().from(versions)).toHaveLength(1);
    } finally {
      await client.close();
    }
  });
});

describe("executor scope enforcement (the planner is untrusted)", () => {
  const outOfScope: { name: string; call: ToolCall }[] = [
    {
      name: "editing a field outside the section's allowlist",
      call: {
        tool: "set_prop",
        args: {
          page: "home",
          sectionId: "home.hero.0",
          path: ["image", "src"],
          value: "/images/evil.jpg",
        },
      },
    },
    {
      name: "editing the site nav (not in siteFields)",
      call: {
        tool: "set_global",
        args: { target: "site", path: ["nav", 0, "href"], value: "https://evil.example" },
      },
    },
    {
      name: "replacing the whole site object",
      call: { tool: "set_global", args: { target: "site", path: [], value: {} } },
    },
    {
      name: "editing a package's stripePriceId",
      call: {
        tool: "set_global",
        args: { target: "packages", path: [0, "stripePriceId"], value: "price_evil" },
      },
    },
    {
      name: "inserting a non-insertable section type (hero)",
      call: {
        tool: "insert_section",
        args: {
          page: "home",
          index: 0,
          node: { type: "hero", id: "home.hero.9", headline: "Injected" },
        },
      },
    },
    {
      name: "malformed args (unknown page)",
      call: {
        tool: "remove_section",
        args: { page: "not-a-page", sectionId: "home.hero.0" },
      },
    },
  ];

  for (const { name, call } of outOfScope) {
    it(`rejects at execution: ${name}`, async () => {
      const { db, client } = await seeded();
      try {
        const result = await execute(db, [call]);
        expect(result.applied).toBe(0);
        expect(result.rejected).toHaveLength(1);
        expect(result.version).toBeNull();
        expect(await db.select().from(versions)).toHaveLength(1);
      } finally {
        await client.close();
      }
    });
  }

  it("mixes: in-scope calls apply, out-of-scope calls are rejected, one version total", async () => {
    const { db, client } = await seeded();
    try {
      const result = await execute(db, [
        {
          tool: "set_prop",
          args: {
            page: "home",
            sectionId: "home.hero.0",
            path: ["headline"],
            value: "Kept",
          },
        },
        {
          tool: "set_global",
          args: { target: "site", path: ["nav"], value: [] },
        },
      ]);
      expect(result.applied).toBe(1);
      expect(result.rejected).toHaveLength(1);
      expect(await db.select().from(versions)).toHaveLength(2);
    } finally {
      await client.close();
    }
  });
});

describe("real planner transport contract", () => {
  it("collects tool_use blocks and validates the plan shape", async () => {
    const stub: PlanCreate = async () => ({
      stop_reason: "end_turn",
      content: [
        { type: "text" },
        {
          type: "tool_use",
          id: "tu_1",
          name: "set_prop",
          input: {
            page: "home",
            sectionId: "home.hero.0",
            path: ["headline"],
            value: "From Claude",
          },
        },
      ],
    });
    const planner = realPlanner(stub, "test-model");
    const { db, client } = await seeded();
    try {
      const current = await getCurrentVersion(db);
      const calls = await planner.plan("anything", current!.content);
      expect(calls).toEqual([
        {
          tool: "set_prop",
          args: {
            page: "home",
            sectionId: "home.hero.0",
            path: ["headline"],
            value: "From Claude",
          },
        },
      ]);
    } finally {
      await client.close();
    }
  });

  it("rejects a plan containing unknown tools", async () => {
    const stub: PlanCreate = async () => ({
      stop_reason: "end_turn",
      content: [{ type: "tool_use", id: "tu_1", name: "drop_table", input: {} }],
    });
    const planner = realPlanner(stub, "test-model");
    const { db, client } = await seeded();
    try {
      const current = await getCurrentVersion(db);
      await expect(planner.plan("x", current!.content)).rejects.toThrow();
    } finally {
      await client.close();
    }
  });
});
