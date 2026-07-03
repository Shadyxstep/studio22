import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { defaultDrafter } from "@/lib/blog/draft";

// AI article drafting (SPEC §15.5): notes in, a validated draft out. The owner
// reviews the draft in the form; nothing is saved here.

const bodySchema = z.object({ notes: z.string().min(1).max(20_000) });

export async function POST(request: NextRequest) {
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

  const drafter = defaultDrafter();
  try {
    const draft = await drafter.draft(parsed.data.notes);
    return NextResponse.json({ ok: true, data: { mode: drafter.mode, draft } });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `drafting failed: ${e instanceof Error ? e.message : String(e)}`,
      },
      { status: 502 },
    );
  }
}
