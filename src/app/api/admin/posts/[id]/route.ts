import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  deletePost,
  getPostById,
  setPostStatus,
  updatePost,
} from "@/lib/blog/queries";
import { POST_STATUSES, postInputSchema } from "@/lib/blog/schema";
import { revalidatePosts } from "@/lib/blog/serve";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";

// Admin single-post routes (SPEC §15.5): GET read, PUT update fields,
// PATCH { status } publish/unpublish, DELETE remove.

type Params = { params: Promise<{ id: string }> };

function requireDb(): NextResponse | null {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      { ok: false, error: "the blog needs the database (DATABASE_URL)" },
      { status: 409 },
    );
  }
  return null;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const gate = requireDb();
  if (gate) return gate;
  const { id } = await params;
  const post = await getPostById(getDb(), id);
  if (!post) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, data: post });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const gate = requireDb();
  if (gate) return gate;
  const { id } = await params;
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
  const post = await updatePost(getDb(), id, parsed.data);
  if (!post) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  await revalidatePosts();
  return NextResponse.json({ ok: true, data: post });
}

const statusSchema = z.object({ status: z.enum(POST_STATUSES) });

export async function PATCH(request: NextRequest, { params }: Params) {
  const gate = requireDb();
  if (gate) return gate;
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid status" }, { status: 400 });
  }
  const post = await setPostStatus(getDb(), id, parsed.data.status);
  if (!post) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  await revalidatePosts();
  return NextResponse.json({ ok: true, data: post });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const gate = requireDb();
  if (gate) return gate;
  const { id } = await params;
  const deleted = await deletePost(getDb(), id);
  if (!deleted) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }
  await revalidatePosts();
  return NextResponse.json({ ok: true });
}
