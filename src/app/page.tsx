import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { getPageContent } from "@/lib/content/serve";
import { buildLocalBusinessJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { page, globals } = await getPageContent("home");
  return {
    // title.template only applies to child segments; the root page sets it absolutely
    title: { absolute: `${page.title} — ${globals.site.name}` },
    description: page.description,
  };
}

export default async function HomePage() {
  const { page, globals } = await getPageContent("home");
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
