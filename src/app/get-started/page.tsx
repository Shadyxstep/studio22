import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { loadGlobals, loadPage } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

const page = loadPage("get-started");

export const metadata: Metadata = pageMetadata("get-started");

export default function GetStartedPage() {
  return (
    <main>
      <SectionRenderer sections={page.sections} globals={loadGlobals()} />
    </main>
  );
}
