import { randomBytes } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { plans, type Plan } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import { buildMailto } from "@/lib/mailto";

// Training-plan queries (SPEC §15.6) — all SQL lives here. Access is by exact
// token match only; there is no public listing surface, and revoked/unknown
// tokens are indistinguishable to a caller.

/** 32 random bytes, base64url → a 256-bit unguessable link token. */
export function newPlanToken(): string {
  return randomBytes(32).toString("base64url");
}

export const planInputSchema = z.object({
  memberEmail: z.string().trim().toLowerCase().email().max(254),
  label: z.string().trim().min(1).max(200),
  blobUrl: z.string().min(1),
});
export type PlanInput = z.infer<typeof planInputSchema>;

export async function createPlan(db: Database, input: PlanInput): Promise<Plan> {
  const data = planInputSchema.parse(input);
  const [row] = await db
    .insert(plans)
    .values({ ...data, token: newPlanToken() })
    .returning();
  return row;
}

export async function listPlans(db: Database): Promise<Plan[]> {
  return db.select().from(plans).orderBy(desc(plans.createdAt));
}

/** The ONLY read path for members: exact token, active plans only. */
export async function getActivePlanByToken(
  db: Database,
  token: string,
): Promise<Plan | null> {
  const [row] = await db.select().from(plans).where(eq(plans.token, token));
  return row && row.revokedAt === null ? row : null;
}

export async function revokePlan(db: Database, id: string): Promise<Plan | null> {
  const [row] = await db
    .update(plans)
    .set({ revokedAt: new Date() })
    .where(eq(plans.id, id))
    .returning();
  return row ?? null;
}

export async function restorePlan(db: Database, id: string): Promise<Plan | null> {
  const [row] = await db
    .update(plans)
    .set({ revokedAt: null })
    .where(eq(plans.id, id))
    .returning();
  return row ?? null;
}

/** The delivery email the owner sends from his own address (SPEC §15.6). */
export function buildPlanMailto(plan: Plan, siteUrl: string): string {
  const link = `${siteUrl}/plans/${plan.token}`;
  return buildMailto(
    plan.memberEmail,
    `Your Studio 22 training plan — ${plan.label}`,
    [
      "Hi,",
      "",
      `Your training plan (${plan.label}) is ready:`,
      link,
      "",
      "The link is personal to you — anything unclear, just reply.",
      "",
      "Studio 22",
    ].join("\n"),
  );
}
