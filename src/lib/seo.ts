import type { Site } from "./content/schema";
import type { Post } from "./db/schema";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio-22.ie";

/** Article structured data for a blog post (SPEC §15.5). */
export function buildArticleJsonLd(post: Post, site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: site.name, url: SITE_URL },
    publisher: { "@type": "Organization", name: site.name, url: SITE_URL },
  };
}

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
