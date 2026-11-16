import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { loadSite } from "@/lib/content/load";
import { OG_SHARED, SITE_URL } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const site = loadSite();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: "Movement. Strength. Recovery. Community",
  applicationName: site.name,
  twitter: { card: "summary_large_image" },
  openGraph: { ...OG_SHARED, siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: "#1a1816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Font variables live on <html> so the :root-level token aliases
       (--font-display/--font-body) can resolve them. */
    <html lang="en" className={`${cormorant.variable} ${hanken.variable}`}>
      <body className="bg-ink font-body text-bone antialiased">
        <GoogleTagManager />
        {/* runs before paint so a stored light preference never flashes dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("studio22-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`,
          }}
        />
        <SiteChrome>
          <Nav site={site} />
        </SiteChrome>
        {children}
        <SiteChrome>
          <Footer site={site} />
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
