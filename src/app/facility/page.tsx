import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";

const page = loadPage("facility");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function FacilityPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
