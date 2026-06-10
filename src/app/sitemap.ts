import type { MetadataRoute } from "next";
import { PAGE_NAMES } from "@/lib/content/schema";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_NAMES.map((name) => ({
    url: name === "home" ? `${SITE_URL}/` : `${SITE_URL}/${name}`,
    changeFrequency: "monthly",
    priority: name === "home" ? 1 : 0.7,
  }));
}
