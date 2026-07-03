import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyOwnerPassword } from "@/lib/auth/password";
import {
  resolveSessionSecret,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
} from "@/lib/auth/session";
import { loadEnv } from "@/lib/env";

// Owner login (SPEC §15.3). Node runtime (scrypt). Sets the httpOnly session
// cookie on success; a wrong password gets a uniform 401.

const bodySchema = z.object({ password: z.string().min(1) });

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

  const env = loadEnv();
  if (!verifyOwnerPassword(parsed.data.password, env.ownerPasswordHash)) {
    return NextResponse.json({ ok: false, error: "wrong password" }, { status: 401 });
  }

  const token = await signSession(resolveSessionSecret(env));
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return response;
}
