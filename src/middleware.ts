import { NextResponse, type NextRequest } from "next/server";
import { decideAuth } from "@/lib/auth/protect";
import { resolveSessionSecret, SESSION_COOKIE, verifySession } from "@/lib/auth/session";

// Edge auth gate (SPEC §15.3): verify the owner session cookie (jose = Web
// Crypto, Edge-safe) and defer the allow/redirect/401 decision to the pure
// policy in lib/auth/protect.ts. Public pages are untouched by the matcher.

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = await verifySession(resolveSessionSecret(), token);
  const decision = decideAuth(request.nextUrl.pathname, authenticated);

  switch (decision.type) {
    case "allow":
      return NextResponse.next();
    case "unauthorized":
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    case "redirect": {
      const url = request.nextUrl.clone();
      url.pathname = decision.to;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
