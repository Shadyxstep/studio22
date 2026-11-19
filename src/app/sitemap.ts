import type { MetadataRoute } from "next";
import { indexablePages, pagePath, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = indexablePages().map((name) => ({
    url: `${SITE_URL}${pagePath(name)}`,
    changeFrequency: name === "home" ? "weekly" : "monthly",
    priority: name === "home" ? 1 : 0.7,
  }));
  // /gift-vouchers has its own content file rather than a pages/*.json entry
  return [...pages, { url: `${SITE_URL}/gift-vouchers`, changeFrequency: "monthly", priority: 0.7 }];
}
