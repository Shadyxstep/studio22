import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage, loadSite } from "@/lib/content/load";
import { buildLocalBusinessJsonLd } from "@/lib/seo";

const page = loadPage("home");

export const metadata: Metadata = {
  // title.template only applies to child segments; the root page sets it absolutely
  title: { absolute: `${page.title} — ${loadSite().name}` },
  description: page.description,
};

export default function HomePage() {
  const globals = loadGlobals();
  const jsonLd = buildLocalBusinessJsonLd(globals.site);
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionRenderer sections={page.sections} globals={globals} />
    </main>
  );
}
