import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("packages");

export const metadata: Metadata = pageMetadata("packages");

export default function PackagesPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
