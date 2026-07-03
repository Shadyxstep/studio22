import { SignJWT, jwtVerify } from "jose";
import { type Env, loadEnv } from "@/lib/env";

// HMAC-signed (HS256) httpOnly session cookie via jose (SPEC §15.3). jose runs
// in both Node and Edge (Web Crypto), so middleware can verify the cookie.

export const SESSION_COOKIE = "studio22_session";
const ALG = "HS256";
const SUBJECT = "owner";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Dev fallback secret so keyless dev works with an empty .env. NEVER used in
// production — there a real SESSION_SECRET is required.
const DEV_SECRET = "dev-insecure-session-secret-change-me";

export function resolveSessionSecret(
  env: Env = loadEnv(),
  nodeEnv: string | undefined = process.env.NODE_ENV,
): string {
  if (env.sessionSecret) return env.sessionSecret;
  if (nodeEnv !== "production") return DEV_SECRET;
  throw new Error("SESSION_SECRET is required in production");
}

function key(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSession(secret: string): Promise<string> {
  return new SignJWT({ sub: SUBJECT })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key(secret));
}

/** Verify a token; returns true iff it's a valid owner session. */
export async function verifySession(
  secret: string,
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key(secret), {
      algorithms: [ALG],
    });
    return payload.sub === SUBJECT;
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
