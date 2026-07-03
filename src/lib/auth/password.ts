import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Single-owner password hashing (SPEC §15.3). Node's built-in scrypt — no
// native build, no extra dependency. Stored format: `scrypt$<saltHex>$<hashHex>`.
// Runs only in the Node runtime (the login route), never in Edge middleware.

const KEYLEN = 64;

export function hashPassword(password: string, salt = randomBytes(16)): string {
  const hash = scryptSync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length !== KEYLEN) return false;
  const actual = scryptSync(password, salt, KEYLEN);
  return timingSafeEqual(actual, expected);
}

// Dev fallback (SPEC §15.3): with no OWNER_PASSWORD_HASH outside production,
// the password "owner" logs in — keyless local dev works with an empty .env.
export const DEV_PASSWORD = "owner";

export function verifyOwnerPassword(
  password: string,
  storedHash: string | undefined,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): boolean {
  if (storedHash) return verifyPassword(password, storedHash);
  if (nodeEnv !== "production") return password === DEV_PASSWORD;
  return false;
}
