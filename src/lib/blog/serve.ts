import { contentMode, loadEnv } from "@/lib/env";
import type { Post } from "@/lib/db/schema";

// Blog serving (SPEC §15.5, amended with content serving 2026-07-07): the blog
// routes are dynamic and read the DB per request — see content/serve.ts for why
// the cached design was dropped. File mode (no DATABASE_URL) renders empty
// rather than erroring; so does a failed DB read.

async function readPublished(): Promise<Post[]> {
  const { getDb } = await import("@/lib/db/client");
  const { listPublishedPosts } = await import("./queries");
  return listPublishedPosts(getDb());
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (contentMode(loadEnv()) === "files") return [];
  try {
    return await readPublished();
  } catch (err) {
    console.error("blog: DB read failed", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const all = await getPublishedPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
