import type { Metadata } from "next";
import { loadGiftVouchers, loadGlobals, loadV2Home } from "@/lib/content/load";
import { getPackageCta } from "@/lib/packages";
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd, pageMetadata } from "@/lib/seo";
import { Facility } from "./_components/Facility";
import { GettingStarted } from "./_components/GettingStarted";
import { GiftVouchers } from "./_components/GiftVouchers";
import { Hero } from "./_components/Hero";
import { Offering } from "./_components/Offering";
import { Packages } from "./_components/Packages";
import { Reviews } from "./_components/Reviews";
import { Timetable } from "./_components/Timetable";
import { StickyPill } from "./_components/StickyPill";
import { Visit } from "./_components/Visit";
import { V2_CONFIG } from "./_lib/config";
import { fillPrice, morePackages, pickPackages, pickReviews } from "./_lib/packages";
import { GIFT_VOUCHERS_PATH, lowestPrice } from "./_lib/vouchers";

export const metadata: Metadata = pageMetadata("home");

export default function V2HomePage() {
  const globals = loadGlobals();
  const v2 = loadV2Home();
  const { site } = globals;
  const packages = pickPackages(globals.packages, V2_CONFIG.packageIds);
  const more = morePackages(globals.packages, v2.packages.moreCategories, V2_CONFIG.packageIds).map(
    (g) => ({ heading: site.packageCategories[g.category], packages: g.packages }),
  );
  const reviews = pickReviews(globals.testimonials, V2_CONFIG.reviewNames);
  const gift = loadGiftVouchers();
  const [trial] = pickPackages(globals.packages, [V2_CONFIG.stickyPill.packageId]);
  const pill =
    V2_CONFIG.stickyPill.promo === "gift-vouchers"
      ? {
          href: GIFT_VOUCHERS_PATH,
          label: fillPrice(gift.pill.label, { price: lowestPrice(gift.groups) }),
          button: gift.pill.button,
          ctaId: "gift_vouchers",
        }
      : {
          href: getPackageCta(trial, site).href,
          label: fillPrice(v2.stickyPill.label, trial),
          button: v2.stickyPill.button,
          ctaId: "book_trial",
        };
  return (
    <main id="v2-main" className="v2-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([buildLocalBusinessJsonLd(site), buildWebSiteJsonLd(site)]),
        }}
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
      <Timetable n={4} content={v2.timetable} />
      <Packages n={5} content={v2.packages} packages={packages} more={more} site={site} />
      <GiftVouchers n={6} content={gift} />
      <Reviews n={7} content={v2.reviews} reviews={reviews} site={site} />
      <Visit n={8} content={v2.visit} site={site} />
      {V2_CONFIG.stickyPill.enabled && <StickyPill {...pill} />}
    </main>
  );
}
