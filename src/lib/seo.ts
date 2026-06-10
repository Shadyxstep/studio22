import type { Site } from "./content/schema";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio-22.ie";

/** LocalBusiness/HealthClub structured data (SPEC §11), built from site.json. */
export function buildLocalBusinessJsonLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: site.name,
    url: SITE_URL,
    telephone: site.contact.phone,
    email: site.contact.email,
    image: `${SITE_URL}/images/signage-founders.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressParts.street,
      addressLocality: site.contact.addressParts.locality,
      addressRegion: site.contact.addressParts.region,
      postalCode: site.contact.addressParts.postalCode,
      addressCountry: site.contact.addressParts.country,
    },
    sameAs: site.social.map((s) => s.href),
  };
}
