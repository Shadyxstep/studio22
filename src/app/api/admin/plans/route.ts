import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { z } from "zod";
import { createPlan, listPlans, buildPlanMailto } from "@/lib/plans/queries";
import { getDb } from "@/lib/db/client";
import { contentMode, loadEnv } from "@/lib/env";

// Admin plans collection (SPEC §15.6): GET list (with delivery links),
// POST multipart { file (PDF), memberEmail, label } → Blob + row.

const MAX_BYTES = 20 * 1024 * 1024;

function requireDb(): NextResponse | null {
  if (contentMode(loadEnv()) === "files") {
    return NextResponse.json(
      { ok: false, error: "training plans need the database (DATABASE_URL)" },
      { status: 409 },
    );
  }
  return null;
}

export async function GET() {
  const gate = requireDb();
  if (gate) return gate;
  const env = loadEnv();
  const rows = await listPlans(getDb());
  return NextResponse.json({
    ok: true,
    data: rows.map((plan) => ({
      id: plan.id,
      memberEmail: plan.memberEmail,
      label: plan.label,
      createdAt: plan.createdAt,
      revoked: plan.revokedAt !== null,
      link: `${env.siteUrl}/plans/${plan.token}`,
      mailto: buildPlanMailto(plan, env.siteUrl),
    })),
  });
}

const fieldsSchema = z.object({
  memberEmail: z.string().trim().toLowerCase().email().max(254),
  label: z.string().trim().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const gate = requireDb();
  if (gate) return gate;
  const env = loadEnv();
  if (!env.blobToken) {
    return NextResponse.json(
      { ok: false, error: "plan uploads need BLOB_READ_WRITE_TOKEN" },
      { status: 409 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const parsed = fieldsSchema.safeParse({
    memberEmail: form?.get("memberEmail"),
    label: form?.get("label"),
  });
  if (!(file instanceof File) || !parsed.success) {
    return NextResponse.json(
      { ok: false, error: "a PDF `file`, `memberEmail` and `label` are required" },
      { status: 400 },
    );
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { ok: false, error: "plans must be PDF files" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "plans must be under 20 MB" },
      { status: 400 },
    );
  }

  // Unguessable Blob pathname (SPEC §15.6): Blob has no private ACL, so the URL
  // itself must be a secret — and members never see it (the token route proxies).
  const pathname = `plans/${randomBytes(16).toString("hex")}.pdf`;
  const blob = await put(pathname, file, {
    access: "public",
    token: env.blobToken,
    contentType: "application/pdf",
  });

  const plan = await createPlan(getDb(), {
    memberEmail: parsed.data.memberEmail,
    label: parsed.data.label,
    blobUrl: blob.url,
  });

  return NextResponse.json(
    {
      ok: true,
      data: {
        id: plan.id,
        link: `${env.siteUrl}/plans/${plan.token}`,
        mailto: buildPlanMailto(plan, env.siteUrl),
      },
    },
    { status: 201 },
  );
}
