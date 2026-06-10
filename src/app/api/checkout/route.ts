import { z } from "zod";
import { loadPackages } from "@/lib/content/load";
import { SITE_URL } from "@/lib/seo";
import { getStripe, paymentsConfigured } from "@/lib/stripe";

const BodySchema = z.object({
  packageId: z.string().min(1),
});

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const pkg = loadPackages().find((p) => p.id === parsed.data.packageId);
  if (!pkg) {
    return Response.json(
      { ok: false, error: "unknown_package" },
      { status: 404 },
    );
  }

  // Dormancy gate first (SPEC §10): without full activation the whole
  // feature answers 501, regardless of package state.
  if (!paymentsConfigured()) {
    return Response.json(
      { ok: false, error: "payments_not_configured" },
      { status: 501 },
    );
  }

  if (!pkg.purchasable || !pkg.stripePriceId) {
    return Response.json(
      { ok: false, error: "package_not_purchasable" },
      { status: 409 },
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    // SPEC §10: weekly → subscription, one-time → payment
    mode: pkg.billing === "weekly" ? "subscription" : "payment",
    line_items: [{ price: pkg.stripePriceId, quantity: 1 }],
    success_url: `${SITE_URL}/checkout/success`,
    cancel_url: `${SITE_URL}/checkout/cancelled`,
  });
  return Response.json({ ok: true, data: { url: session.url } });
}
