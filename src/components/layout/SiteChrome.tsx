"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/*
 * The homepage (/) ships its own nav and footer from
 * src/app/(home)/layout.tsx. This gate keeps the V1 chrome off that route;
 * every other page keeps the V1 nav and footer.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
