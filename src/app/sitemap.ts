import type { MetadataRoute } from "next";
import { PAGE_NAMES } from "@/lib/content/schema";
import { getPublishedPosts } from "@/lib/blog/serve";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = PAGE_NAMES.map((name) => ({
    url: name === "home" ? `${SITE_URL}/` : `${SITE_URL}/${name}`,
    changeFrequency: "monthly",
    priority: name === "home" ? 1 : 0.7,
  }));

  const posts = await getPublishedPosts();
  const blog: MetadataRoute.Sitemap = [
    ...(posts.length > 0
      ? [{ url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [...pages, ...blog];
}
