// Pure route-protection policy (SPEC §15.3), unit-tested without Next. The
// middleware verifies the session cookie then defers the decision to here.

export type AuthDecision =
  | { type: "allow" }
  | { type: "redirect"; to: string }
  | { type: "unauthorized" };

export const LOGIN_PATH = "/admin/login";

// Public paths inside the protected prefixes (reachable while unauthenticated).
const PUBLIC_PATHS = new Set([LOGIN_PATH, "/api/auth/login", "/api/auth/logout"]);

export function isProtectedPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

export function decideAuth(
  pathname: string,
  authenticated: boolean,
): AuthDecision {
  if (!isProtectedPath(pathname)) return { type: "allow" };
  if (authenticated) return { type: "allow" };
  // API routes get a 401; page routes redirect to login.
  if (pathname.startsWith("/api")) return { type: "unauthorized" };
  return { type: "redirect", to: LOGIN_PATH };
}
