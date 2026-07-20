import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { loadSite } from "@/lib/content/load";
import { SITE_URL } from "@/lib/seo";
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
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_IE",
    images: ["/images/signage-founders.jpg"],
  },
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
        <Nav site={site} />
        {children}
        <Footer site={site} />
        <Analytics />
      </body>
    </html>
  );
}
