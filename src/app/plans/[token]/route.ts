import type { NextRequest } from "next/server";
import { getActivePlanByToken } from "@/lib/plans/queries";
import { contentMode, loadEnv } from "@/lib/env";

// Member plan link (SPEC §15.6): /plans/<token> STREAMS the PDF through this
// handler — never a redirect, because Blob URLs are permanently public and a
// leaked redirect target would survive revocation. Revoked and unknown tokens
// take the identical code path (getActivePlanByToken → null) so there is no
// enumeration signal, and the response is a branded "no longer active" page.

const NOT_ACTIVE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Studio 22 — link not active</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         background: #1a1816; color: #eceae6; font-family: system-ui, sans-serif; }
  main { text-align: center; padding: 2rem; }
  h1 { font-weight: 500; font-size: 1.5rem; }
  p { color: #8e8a82; font-size: 0.95rem; line-height: 1.6; }
</style>
</head>
<body>
<main>
  <h1>This plan link is no longer active</h1>
  <p>If you were expecting a training plan here,<br>get in touch with Studio 22 and we'll sort it.</p>
</main>
</body>
</html>`;

function notActive(): Response {
  return new Response(NOT_ACTIVE_HTML, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (contentMode(loadEnv()) === "files" || !token) return notActive();

  const { getDb } = await import("@/lib/db/client");
  const plan = await getActivePlanByToken(getDb(), token);
  if (!plan) return notActive();

  const blob = await fetch(plan.blobUrl);
  if (!blob.ok || !blob.body) {
    console.error(`plans: blob fetch failed (${blob.status}) for plan ${plan.id}`);
    return notActive();
  }

  return new Response(blob.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${plan.label.replace(/[^\w .-]/g, "")}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
