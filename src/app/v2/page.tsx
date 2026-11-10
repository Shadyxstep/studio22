import type { Metadata } from "next";
import { loadGlobals } from "@/lib/content/load";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Hero } from "./_components/Hero";
import { Chapter } from "./_components/Chapter";
import { Offering } from "./_components/Offering";
import { Packages } from "./_components/Packages";
import { V2_CONFIG } from "./_lib/config";
import { pickPackages } from "./_lib/packages";

export const metadata: Metadata = {
  title: { absolute: "Studio 22 — The Future of Wellness (V2 preview)" },
};

export default function V2HomePage() {
  const globals = loadGlobals();
  const packages = pickPackages(globals.packages, V2_CONFIG.packageIds);
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
    </main>
  );
}
