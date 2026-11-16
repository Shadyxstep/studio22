import type { MetadataRoute } from "next";
import { loadPage, loadSite } from "@/lib/content/load";

export default function manifest(): MetadataRoute.Manifest {
  const site = loadSite();
  return {
    name: site.name,
    short_name: site.name,
    description: loadPage("home").description,
    start_url: "/",
    display: "standalone",
    background_color: "#1a1816",
    theme_color: "#1a1816",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
