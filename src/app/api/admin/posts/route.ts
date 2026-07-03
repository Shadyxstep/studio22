import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createPost, listAllPosts } from "@/lib/blog/queries";
import { postInputSchema } from "@/lib/blog/schema";
import { revalidatePosts } from "@/lib/blog/serve";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";

// Admin posts collection (SPEC §15.5). Auth enforced by the middleware.

function requireDb(): NextResponse | null {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      { ok: false, error: "the blog needs the database (DATABASE_URL)" },
      { status: 409 },
    );
  }
  return null;
}

export async function GET() {
  const gate = requireDb();
  if (gate) return gate;
  return NextResponse.json({ ok: true, data: await listAllPosts(getDb()) });
}

export async function POST(request: NextRequest) {
  const gate = requireDb();
  if (gate) return gate;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const parsed = postInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: z.prettifyError(parsed.error) },
      { status: 400 },
    );
  }
  const post = await createPost(getDb(), parsed.data);
  await revalidatePosts();
  return NextResponse.json({ ok: true, data: post }, { status: 201 });
}
