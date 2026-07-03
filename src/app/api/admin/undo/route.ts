import { NextResponse } from "next/server";
import { canRedo, canUndo, redo, undo } from "@/lib/content/undo";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";
import { OpError } from "@/lib/content/ops";

// Undo/redo for the owner editor (SPEC §15.2/§15.4): revert-to-parent as new
// versions, never destructive. POST { action: "undo" | "redo" }.

export async function POST(request: Request) {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      { ok: false, error: "undo needs the database" },
      { status: 409 },
    );
  }
  let action = "undo";
  try {
    const body = (await request.json()) as { action?: string };
    if (body.action === "redo") action = "redo";
  } catch {
    // default to undo on an empty body
  }

  const db = getDb();
  try {
    const version = action === "redo" ? await redo(db) : await undo(db);
    return NextResponse.json({
      ok: true,
      data: {
        versionId: version.id,
        canUndo: await canUndo(db),
        canRedo: await canRedo(db),
      },
    });
  } catch (e) {
    if (e instanceof OpError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 409 });
    }
    throw e;
  }
}
