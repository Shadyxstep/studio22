import type { Metadata } from "next";
import { loadGlobals } from "@/lib/content/load";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Hero } from "./_components/Hero";
import { Chapter } from "./_components/Chapter";
import { Offering } from "./_components/Offering";
import { Packages } from "./_components/Packages";
import { Reviews } from "./_components/Reviews";
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
    </main>
  );
}
