import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("contact");

export const metadata: Metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
