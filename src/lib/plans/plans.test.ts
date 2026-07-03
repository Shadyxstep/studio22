// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/test";
import {
  buildPlanMailto,
  createPlan,
  getActivePlanByToken,
  listPlans,
  newPlanToken,
  planInputSchema,
  restorePlan,
  revokePlan,
} from "./queries";

const INPUT = {
  memberEmail: "member@example.com",
  label: "12-week strength block",
  blobUrl: "https://blob.example/plans/abc.pdf",
};

describe("plan tokens", () => {
  it("are 256-bit base64url and unique", () => {
    const tokens = new Set(Array.from({ length: 200 }, () => newPlanToken()));
    expect(tokens.size).toBe(200);
    for (const token of tokens) {
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/); // 32 bytes base64url
    }
  });
});

describe("plan input validation", () => {
  it("normalises the email and rejects junk", () => {
    const parsed = planInputSchema.parse({
      ...INPUT,
      memberEmail: "  Member@Example.COM ",
    });
    expect(parsed.memberEmail).toBe("member@example.com");
    expect(planInputSchema.safeParse({ ...INPUT, memberEmail: "nope" }).success).toBe(false);
    expect(planInputSchema.safeParse({ ...INPUT, label: "" }).success).toBe(false);
  });
});

describe("plan lifecycle (PGlite)", () => {
  it("create → active by token; revoked and unknown are indistinguishable (both null)", async () => {
    const { db, client } = await createTestDb();
    try {
      const plan = await createPlan(db, INPUT);
      expect(plan.token).toMatch(/^[A-Za-z0-9_-]{43}$/);

      expect(await getActivePlanByToken(db, plan.token)).not.toBeNull();
      // unknown token → null (the route's single not-active path)
      expect(await getActivePlanByToken(db, newPlanToken())).toBeNull();

      await revokePlan(db, plan.id);
      // revoked token → null, the SAME result as unknown: no enumeration signal
      expect(await getActivePlanByToken(db, plan.token)).toBeNull();

      await restorePlan(db, plan.id);
      expect(await getActivePlanByToken(db, plan.token)).not.toBeNull();

      expect(await listPlans(db)).toHaveLength(1);
    } finally {
      await client.close();
    }
  });
});

describe("delivery mailto", () => {
  it("addresses the member and carries the tokenized link, never the blob URL", async () => {
    const { db, client } = await createTestDb();
    try {
      const plan = await createPlan(db, INPUT);
      const mailto = buildPlanMailto(plan, "https://studio-22.ie");
      expect(mailto.startsWith("mailto:member@example.com?")).toBe(true);
      expect(decodeURIComponent(mailto)).toContain(
        `https://studio-22.ie/plans/${plan.token}`,
      );
      expect(mailto).not.toContain("blob.example");
    } finally {
      await client.close();
    }
  });
});
