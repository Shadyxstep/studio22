import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { getPageContent } from "@/lib/content/serve";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPageContent("get-started");
  return { title: page.title, description: page.description };
}

export default async function GetStartedPage() {
  const { page, globals } = await getPageContent("get-started");
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={globals} />
    </main>
  );
}
