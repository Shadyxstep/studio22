import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { loadSite } from "@/lib/content/load";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
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
    <html lang="en">
      <body
        className={`${bodoni.variable} ${hanken.variable} bg-ink font-body text-bone antialiased`}
      >
        {/* runs before paint so a stored light preference never flashes dark */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("studio22-theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`,
          }}
        />
        <Nav site={site} />
        {children}
        <Footer site={site} />
      </body>
    </html>
  );
}
