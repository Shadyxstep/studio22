import type { MetadataRoute } from "next";
import { indexablePages, pagePath, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexablePages().map((name) => ({
    url: `${SITE_URL}${pagePath(name)}`,
    changeFrequency: name === "home" ? "weekly" : "monthly",
    priority: name === "home" ? 1 : 0.7,
  }));
}
