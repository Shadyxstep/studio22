import type { Metadata } from "next";
import { loadGlobals, loadV2Home } from "@/lib/content/load";
import { getPackageCta } from "@/lib/packages";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Facility } from "./_components/Facility";
import { GettingStarted } from "./_components/GettingStarted";
import { Hero } from "./_components/Hero";
import { Offering } from "./_components/Offering";
import { Packages } from "./_components/Packages";
import { Reviews } from "./_components/Reviews";
import { StickyPill } from "./_components/StickyPill";
import { Visit } from "./_components/Visit";
import { V2_CONFIG } from "./_lib/config";
import { fillPrice, morePackages, pickPackages, pickReviews } from "./_lib/packages";

export const metadata: Metadata = {
  title: { absolute: "Studio 22 — The Future of Wellness (V2 preview)" },
};

export default function V2HomePage() {
  const globals = loadGlobals();
  const v2 = loadV2Home();
  const { site } = globals;
  const packages = pickPackages(globals.packages, V2_CONFIG.packageIds);
  const more = morePackages(globals.packages, v2.packages.moreCategories, V2_CONFIG.packageIds).map(
    (g) => ({ heading: site.packageCategories[g.category], packages: g.packages }),
  );
  const reviews = pickReviews(globals.testimonials, V2_CONFIG.reviewNames);
  const [trial] = pickPackages(globals.packages, [V2_CONFIG.stickyPill.packageId]);
  return (
    <main id="v2-main" className="v2-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusinessJsonLd(site)) }}
      />
      <div className="v2-fields" aria-hidden data-v2-loop>
        <div className="v2-field v2-field--1" />
        <div className="v2-field v2-field--2" />
        <div className="v2-field v2-field--3" />
      </div>
      <Hero hero={v2.hero} site={site} />
      <Offering n={1} offering={v2.offering} />
      <Facility n={2} facility={v2.facility} />
      <GettingStarted n={3} content={v2.gettingStarted} />
      <Packages n={4} content={v2.packages} packages={packages} more={more} site={site} />
      <Reviews n={5} content={v2.reviews} reviews={reviews} site={site} />
      <Visit n={6} content={v2.visit} site={site} />
      {V2_CONFIG.stickyPill.enabled && (
        <StickyPill
          href={getPackageCta(trial, site).href}
          label={fillPrice(v2.stickyPill.label, trial)}
          button={v2.stickyPill.button}
        />
      )}
    </main>
  );
}
