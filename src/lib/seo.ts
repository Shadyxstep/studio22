import type { Metadata } from "next";
import { loadFaqs, loadPackages, loadPage, loadSite, loadV2Home } from "./content/load";
import type { PageName, Site } from "./content/schema";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://studio-22.ie";

const PATHS: Record<PageName, string> = {
  home: "/",
  facility: "/facility",
  packages: "/packages",
  "get-started": "/get-started",
  faqs: "/faqs",
  contact: "/contact",
};

/* Next merges metadata shallowly: a page's openGraph/twitter replaces the
   root layout's, so the shared fields live here and every page spreads them. */
export const OG_SHARED = {
  type: "website" as const,
  locale: "en_IE",
  images: ["/images/signage-founders.jpg"],
};

/** Pages worth indexing: /faqs stays out while faqs.json has no entries. */
export function indexablePages(): PageName[] {
  return (Object.keys(PATHS) as PageName[]).filter((n) => n !== "faqs" || loadFaqs().length > 0);
}

export function pagePath(name: PageName) {
  return PATHS[name];
}

/** Title, description, canonical URL and Open Graph for a content page (SPEC §11). */
export function pageMetadata(name: PageName): Metadata {
  const page = loadPage(name);
  const site = loadSite();
  const full = `${page.title} — ${site.name}`;
  const indexable = indexablePages().includes(name);
  return {
    // the root page sets its title absolutely; title.template covers the rest
    title: name === "home" ? { absolute: full } : page.title,
    description: page.description,
    alternates: { canonical: PATHS[name] },
    openGraph: { ...OG_SHARED, siteName: site.name, title: full, description: page.description, url: PATHS[name] },
    twitter: { card: "summary_large_image", title: full, description: page.description },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

/** LocalBusiness/HealthClub structured data (SPEC §11), built from content. */
export function buildLocalBusinessJsonLd(site: Site) {
  const home = loadPage("home");
  const offering = loadV2Home().offering.cards;
  return {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    "@id": `${SITE_URL}/#business`,
    name: site.name,
    description: home.description,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    telephone: site.contact.phone,
    email: site.contact.email,
    image: [`${SITE_URL}/images/signage-founders.jpg`, `${SITE_URL}/images/pilates-studio.jpg`, `${SITE_URL}/images/golf-simulator.jpg`],
    hasMap: site.links.map,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressParts.street,
      addressLocality: site.contact.addressParts.locality,
      addressRegion: site.contact.addressParts.region,
      postalCode: site.contact.addressParts.postalCode,
      addressCountry: site.contact.addressParts.country,
    },
    areaServed: [site.contact.addressParts.locality, site.contact.addressParts.region],
    amenityFeature: offering.map((c) => ({
      "@type": "LocationFeatureSpecification",
      name: c.title,
      value: true,
    })),
    makesOffer: loadPackages().map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "EUR",
      url: p.purchaseUrl ?? `${SITE_URL}/packages`,
      category: site.packageCategories[p.category],
    })),
    sameAs: site.social.map((s) => s.href),
  };
}

export function buildWebSiteJsonLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    inLanguage: "en-IE",
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}
