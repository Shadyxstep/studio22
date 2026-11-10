"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/*
 * V2 homepage preview (/v2) ships its own nav and footer from
 * src/app/v2/layout.tsx. This gate keeps the V1 chrome off that route and
 * changes nothing anywhere else. Remove at V2 cutover.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/v2" || pathname?.startsWith("/v2/")) return null;
  return <>{children}</>;
}
