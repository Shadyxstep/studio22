import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("faqs");

export const metadata: Metadata = pageMetadata("faqs");

export default function FaqsPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
