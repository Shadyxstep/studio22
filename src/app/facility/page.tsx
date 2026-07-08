import type { Metadata } from "next";

// Content is DB-backed and read per request (content/serve.ts, 2026-07-07).
export const dynamic = "force-dynamic";
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
