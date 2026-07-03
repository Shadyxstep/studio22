import { unstable_cache } from "next/cache";
import { contentMode, loadEnv } from "@/lib/env";
import type { Post } from "@/lib/db/schema";

// Blog serving (SPEC §15.5): published posts under the "posts" cache tag —
// admin saves call revalidatePosts(). The blog is DB-backed only; in file mode
// (no DATABASE_URL) it renders empty rather than erroring.

export const POSTS_TAG = "posts";

async function readPublished(): Promise<Post[]> {
  const { getDb } = await import("@/lib/db/client");
  const { listPublishedPosts } = await import("./queries");
  return listPublishedPosts(getDb());
}

const readPublishedCached = unstable_cache(readPublished, ["published-posts"], {
  tags: [POSTS_TAG],
});

export async function getPublishedPosts(): Promise<Post[]> {
  if (contentMode(loadEnv()) === "files") return [];
  try {
    return await readPublishedCached();
  } catch (err) {
    console.error("blog: DB read failed", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const all = await getPublishedPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Invalidate the public blog cache after an admin save. No-op outside Next. */
export async function revalidatePosts(): Promise<void> {
  try {
    const { revalidateTag } = await import("next/cache");
    revalidateTag(POSTS_TAG);
  } catch {
    // outside a Next request scope (tests/scripts) there is no cache
  }
}
