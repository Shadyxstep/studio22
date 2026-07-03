import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { restorePlan, revokePlan } from "@/lib/plans/queries";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";

// Revoke / restore a plan link (SPEC §15.6). PATCH { revoked: boolean }.

const bodySchema = z.object({ revoked: z.boolean() });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      { ok: false, error: "training plans need the database" },
      { status: 409 },
    );
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const db = getDb();
  const plan = parsed.data.revoked
    ? await revokePlan(db, id)
    : await restorePlan(db, id);
  if (!plan) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    data: { id: plan.id, revoked: plan.revokedAt !== null },
  });
}
