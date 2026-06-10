import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";

const page = loadPage("faqs");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function FaqsPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
