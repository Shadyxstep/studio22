"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/*
 * The homepage (/) and the gift vouchers page ship their own nav and footer
 * from src/app/(home)/layout.tsx. This gate keeps the V1 chrome off those
 * routes; every other page keeps the V1 nav and footer.
 */
const OWN_CHROME = ["/", "/gift-vouchers"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (OWN_CHROME.includes(pathname)) return null;
  return <>{children}</>;
}
