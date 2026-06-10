import type { Package } from "./content/schema";
import { formatPrice } from "./format";

/** Generic mailto composer — single place mailto URLs are built. */
export function buildMailto(to: string, subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${to}?${query}`;
}

/**
 * SPEC §9 sign-up flow, step 3 — the enquiry email for a selected package.
 * Pure; the client component only feeds it state.
 */
export function buildEnquiryMailto(opts: {
  to: string;
  pkg: Pick<Package, "name" | "price" | "billing">;
  name: string;
  phone: string;
}): string {
  const subject = `Enquiry — ${opts.pkg.name}`;
  const body = [
    `Package: ${opts.pkg.name}`,
    `Price: ${formatPrice(opts.pkg)}`,
    `Name: ${opts.name}`,
    `Phone: ${opts.phone}`,
  ].join("\n");
  return buildMailto(opts.to, subject, body);
}
