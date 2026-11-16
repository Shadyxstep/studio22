import type { CSSProperties, ReactNode } from "react";
import { loadFaqs, loadSite, loadV2Home } from "@/lib/content/load";
import { v2MotionVars } from "@/lib/motion";
import { Ambient } from "./_components/Ambient";
import { CtaTracker } from "./_components/CtaTracker";
import { SmoothScroll } from "./_components/SmoothScroll";
import { V2Footer } from "./_components/V2Footer";
import { V2Nav } from "./_components/V2Nav";
import { v2Font } from "./_lib/font";
import "./v2.css";

/* The homepage's own chrome. GTM + Vercel Analytics come from the root layout. */
export default function V2Layout({ children }: { children: ReactNode }) {
  const site = loadSite();
  const v2 = loadV2Home();
  return (
    <div className={`v2 ${v2Font.variable}`} style={v2MotionVars() as CSSProperties}>
      <a href="#offering" className="v2-skip">
        {v2.skipLink}
      </a>
      <SmoothScroll />
      <CtaTracker />
      <Ambient />
      <V2Nav name={site.name} nav={v2.nav} />
      {children}
      <V2Footer name={site.name} footer={v2.footer} faqCount={loadFaqs().length} credit={site.footer.credit} />
    </div>
  );
}
