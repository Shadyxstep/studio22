import type { Metadata } from "next";
import { loadGlobals } from "@/lib/content/load";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { Hero } from "./_components/Hero";
import { Chapter } from "./_components/Chapter";
import { Offering } from "./_components/Offering";

export const metadata: Metadata = {
  title: { absolute: "Studio 22 — The Future of Wellness (V2 preview)" },
};

export default function V2HomePage() {
  const globals = loadGlobals();
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
    </main>
  );
}
