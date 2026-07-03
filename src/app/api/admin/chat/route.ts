import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { defaultPlanner } from "@/lib/agent/planner.anthropic";
import { execute } from "@/lib/agent/executor";
import { canUndo } from "@/lib/content/undo";
import { getCurrentVersion } from "@/lib/db/versions";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";

// The owner's editing endpoint (SPEC §15.4): one message → plan → execute →
// exactly one new version (or a clear list of rejections). Auth enforced by the
// middleware; DB mode required (edits are versions).

const bodySchema = z.object({ message: z.string().min(1).max(2000) });

export async function POST(request: NextRequest) {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The editor needs the database (DATABASE_URL). The public site is serving from files.",
      },
      { status: 409 },
    );
  }

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
  const current = await getCurrentVersion(db);
  if (!current) {
    return NextResponse.json(
      { ok: false, error: "site is not seeded" },
      { status: 409 },
    );
  }

  const planner = defaultPlanner();
  const calls = await planner.plan(parsed.data.message, current.content);
  const result = await execute(db, calls, parsed.data.message.slice(0, 200));

  return NextResponse.json({
    ok: true,
    data: {
      mode: planner.mode,
      planned: calls.length,
      applied: result.applied,
      rejected: result.rejected.map((r) => r.reason),
      versionId: result.version?.id ?? null,
      canUndo: await canUndo(db),
    },
  });
}
