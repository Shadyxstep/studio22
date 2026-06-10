import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";

const page = loadPage("packages");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function PackagesPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
