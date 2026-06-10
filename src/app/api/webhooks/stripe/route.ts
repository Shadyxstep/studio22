/*
 * Dormant Stripe webhook stub (SPEC §10).
 * HUMAN TODO at activation:
 *   1. Verify the signature with STRIPE_WEBHOOK_SECRET
 *      (stripe.webhooks.constructEvent on the raw body).
 *   2. Handle `checkout.session.completed` — notify the owner / record the sale.
 *   3. Return 200 for handled events, 400 for bad signatures.
 */
export async function POST(): Promise<Response> {
  return Response.json(
    { ok: false, error: "payments_not_configured" },
    { status: 501 },
  );
}
