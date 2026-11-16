import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("facility");

export const metadata: Metadata = pageMetadata("facility");

export default function FacilityPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
