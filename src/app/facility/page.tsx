import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { getPageContent } from "@/lib/content/serve";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPageContent("facility");
  return { title: page.title, description: page.description };
}

export default async function FacilityPage() {
  const { page, globals } = await getPageContent("facility");
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={globals} />
    </main>
  );
}
