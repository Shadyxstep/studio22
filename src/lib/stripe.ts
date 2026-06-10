import Stripe from "stripe";

export class NotConfiguredError extends Error {
  constructor() {
    super(
      "Payments are not configured: STUDIO22_PAYMENTS must be \"true\" and all Stripe keys present (SPEC §5, §10).",
    );
    this.name = "NotConfiguredError";
  }
}

/** True only when the SPEC §5 activation gate is fully satisfied. */
export function paymentsConfigured(): boolean {
  return (
    process.env.STUDIO22_PAYMENTS === "true" &&
    !!process.env.STRIPE_SECRET_KEY &&
    !!process.env.STRIPE_WEBHOOK_SECRET &&
    !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

/*
 * Dormant factory (SPEC §10). Throws NotConfiguredError until activation.
 * HUMAN TODO at activation: real keys in .env + stripePriceId per package
 * in content/packages.json + flip purchasable per package.
 */
export function getStripe(): Stripe {
  if (!paymentsConfigured()) {
    throw new NotConfiguredError();
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}
