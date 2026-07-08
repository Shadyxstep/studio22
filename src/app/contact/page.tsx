import type { Metadata } from "next";

// Content is DB-backed and read per request (content/serve.ts, 2026-07-07).
export const dynamic = "force-dynamic";
import { SectionRenderer } from "@/components/sections";
import { getPageContent } from "@/lib/content/serve";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPageContent("contact");
  return { title: page.title, description: page.description };
}

export default async function ContactPage() {
  const { page, globals } = await getPageContent("contact");
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={globals} />
    </main>
  );
}
