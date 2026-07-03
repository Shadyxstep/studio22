import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { loadEnv } from "@/lib/env";

// Cover-image upload (SPEC §15.5): multipart file → Vercel Blob under an
// unguessable pathname. Absent BLOB_READ_WRITE_TOKEN → a clear 409 notice.

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const { blobToken } = loadEnv();
  if (!blobToken) {
    return NextResponse.json(
      { ok: false, error: "image uploads need BLOB_READ_WRITE_TOKEN" },
      { status: 409 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "multipart field `file` is required" },
      { status: 400 },
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: "covers must be JPEG, PNG or WebP" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "covers must be under 8 MB" },
      { status: 400 },
    );
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const pathname = `covers/${randomBytes(16).toString("hex")}.${ext}`;
  const blob = await put(pathname, file, {
    access: "public",
    token: blobToken,
    contentType: file.type,
  });
  return NextResponse.json({ ok: true, data: { url: blob.url } });
}
