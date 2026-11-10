import type { Metadata } from "next";
import { loadGlobals } from "@/lib/content/load";
import { getPackageCta } from "@/lib/packages";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Hero } from "./_components/Hero";
import { Chapter } from "./_components/Chapter";
import { Offering } from "./_components/Offering";
import { Packages } from "./_components/Packages";
import { Reviews } from "./_components/Reviews";
import { StickyPill } from "./_components/StickyPill";
import { Visit } from "./_components/Visit";
import { V2_CONFIG } from "./_lib/config";
import { pickPackages, pickReviews } from "./_lib/packages";

export const metadata: Metadata = {
  title: { absolute: "Studio 22 — The Future of Wellness (V2 preview)" },
};

export default function V2HomePage() {
  const globals = loadGlobals();
  const packages = pickPackages(globals.packages, V2_CONFIG.packageIds);
  const reviews = pickReviews(globals.testimonials, V2_CONFIG.reviewNames);
  const pill = V2_CONFIG.stickyPill;
  const [trial] = pickPackages(globals.packages, [pill.packageId]);
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildLocalBusinessJsonLd(globals.site)),
        }}
      />
      <Hero site={globals.site} />
      <Offering />
      <Chapter />
      <Packages packages={packages} site={globals.site} />
      <Reviews reviews={reviews} site={globals.site} />
      <Visit site={globals.site} />
      {pill.enabled && (
        <StickyPill
          href={getPackageCta(trial, globals.site).href}
          label={pill.label(trial.price)}
          button={pill.button}
        />
      )}
    </main>
  );
}
