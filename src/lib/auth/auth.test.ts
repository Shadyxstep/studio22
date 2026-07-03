// @vitest-environment node
// jose rejects Uint8Arrays from jsdom's realm (instanceof across realms); the
// session code targets Node/Edge, so this suite runs in the node environment.
import { describe, expect, it } from "vitest";
import { DEV_PASSWORD, hashPassword, verifyOwnerPassword, verifyPassword } from "./password";
import { resolveSessionSecret, signSession, verifySession } from "./session";
import { decideAuth, isProtectedPath, LOGIN_PATH } from "./protect";
import { loadEnv } from "@/lib/env";

describe("password hashing", () => {
  it("round-trips and rejects wrong passwords and malformed hashes", () => {
    const hash = hashPassword("correct horse");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("correct horse", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
    expect(verifyPassword("x", "not-a-hash")).toBe(false);
    expect(verifyPassword("x", "scrypt$$")).toBe(false);
  });

  it("owner verification: hash wins; dev fallback only outside production", () => {
    const hash = hashPassword("s3cret");
    expect(verifyOwnerPassword("s3cret", hash, "production")).toBe(true);
    expect(verifyOwnerPassword(DEV_PASSWORD, hash, "production")).toBe(false);
    // no hash configured
    expect(verifyOwnerPassword(DEV_PASSWORD, undefined, "development")).toBe(true);
    expect(verifyOwnerPassword(DEV_PASSWORD, undefined, "production")).toBe(false);
    expect(verifyOwnerPassword("anything-else", undefined, "development")).toBe(false);
  });
});

describe("session", () => {
  it("signs and verifies an owner session; rejects tampering and wrong secrets", async () => {
    const token = await signSession("secret-a");
    expect(await verifySession("secret-a", token)).toBe(true);
    expect(await verifySession("secret-b", token)).toBe(false);
    expect(await verifySession("secret-a", token.slice(0, -2))).toBe(false);
    expect(await verifySession("secret-a", undefined)).toBe(false);
  });

  it("resolveSessionSecret: env value, dev fallback, production throw", () => {
    expect(
      resolveSessionSecret(loadEnv({ SESSION_SECRET: "s" }), "production"),
    ).toBe("s");
    expect(resolveSessionSecret(loadEnv({}), "development")).toBeTruthy();
    expect(() => resolveSessionSecret(loadEnv({}), "production")).toThrow(
      "SESSION_SECRET",
    );
  });
});

describe("route protection policy", () => {
  it("protects /admin and /api/admin, leaves the public site and login alone", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/packages")).toBe(false);
    expect(isProtectedPath(LOGIN_PATH)).toBe(false);
    expect(isProtectedPath("/api/auth/login")).toBe(false);
    expect(isProtectedPath("/admin")).toBe(true);
    expect(isProtectedPath("/admin/posts")).toBe(true);
    expect(isProtectedPath("/api/admin/chat")).toBe(true);
  });

  it("decides allow / redirect / 401 by surface", () => {
    expect(decideAuth("/admin", true)).toEqual({ type: "allow" });
    expect(decideAuth("/admin", false)).toEqual({
      type: "redirect",
      to: LOGIN_PATH,
    });
    expect(decideAuth("/api/admin/chat", false)).toEqual({
      type: "unauthorized",
    });
    expect(decideAuth("/", false)).toEqual({ type: "allow" });
  });
});
