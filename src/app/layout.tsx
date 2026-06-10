import type { Metadata } from "next";
import { Tenor_Sans, Hanken_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { loadSite } from "@/lib/content/load";
import "./globals.css";

const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tenor",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio 22",
  description: "Movement. Strength. Recovery. Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = loadSite();
  return (
    <html lang="en">
      <body
        className={`${tenor.variable} ${hanken.variable} bg-ink font-body text-bone antialiased`}
      >
        <Nav site={site} />
        {children}
        <Footer site={site} />
      </body>
    </html>
  );
}
