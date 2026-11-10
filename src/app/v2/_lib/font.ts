import { Inter_Tight } from "next/font/google";

/*
 * V2 typeface. Inter Tight stands in for PP Neue Montreal (needs a licence).
 * To swap to a licensed local font, replace this file only, e.g.:
 *   import localFont from "next/font/local";
 *   export const v2Font = localFont({ src: [...], variable: "--font-v2" });
 */
export const v2Font = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-v2",
  display: "swap",
});
