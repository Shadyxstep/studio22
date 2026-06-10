import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";

const page = loadPage("home");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function HomePage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
