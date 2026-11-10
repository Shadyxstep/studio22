import type { Metadata } from "next";
import type { ReactNode } from "react";
import { loadSite } from "@/lib/content/load";
import { CtaTracker } from "./_components/CtaTracker";
import { SmoothScroll } from "./_components/SmoothScroll";
import { V2Footer } from "./_components/V2Footer";
import { V2Nav } from "./_components/V2Nav";
import { v2Font } from "./_lib/font";
import "./v2.css";

/* Preview route: never indexed, not in the sitemap (sitemap.ts lists only
   PAGE_NAMES). GTM + Vercel Analytics come from the root layout. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function V2Layout({ children }: { children: ReactNode }) {
  const site = loadSite();
  return (
    <div className={`v2 ${v2Font.variable}`}>
      <SmoothScroll />
      <CtaTracker />
      <V2Nav name={site.name} />
      {children}
      <V2Footer name={site.name} />
    </div>
  );
}
