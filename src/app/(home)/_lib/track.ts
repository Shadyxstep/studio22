/*
 * CTA tracking. Links carry data-cta-id / data-cta-location; one delegated
 * listener (CtaTracker) pushes { event: "cta_click", cta_id, cta_location }
 * to the GTM dataLayer. No existing events in the repo to align with.
 */
export const CTA_EVENT = "cta_click";

export function cta(id: string, location: string) {
  return { "data-cta-id": id, "data-cta-location": location };
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function pushCta(id: string, location: string) {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: CTA_EVENT, cta_id: id, cta_location: location });
}
