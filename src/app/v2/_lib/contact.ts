/** "+353 874094321" → "+353 87 409 4321" (Irish mobile grouping). Other
 *  shapes are returned untouched. */
export function formatPhone(raw: string): string {
  const m = raw.replace(/\s+/g, "").match(/^\+353(\d{2})(\d{3})(\d{4})$/);
  return m ? `+353 ${m[1]} ${m[2]} ${m[3]}` : raw;
}

export function telHref(raw: string): string {
  return `tel:${raw.replace(/\s+/g, "")}`;
}

/** Address for display without the country, matching the V2 mockup. */
export function shortAddress(parts: { street: string; locality: string; region: string; postalCode: string }) {
  return `${parts.street}, ${parts.locality}, ${parts.region}, ${parts.postalCode}`;
}
