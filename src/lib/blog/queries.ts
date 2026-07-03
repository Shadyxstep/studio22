import { desc, eq } from "drizzle-orm";
import { posts, type Post } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import { postInputSchema, uniqueSlug, type PostInput } from "./schema";

// Post queries (SPEC §15.5) — all SQL lives here. Drafts are invisible to the
// public reads; the slug is assigned once from the title and never changes.

export async function listPublishedPosts(db: Database): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));
}

export async function listAllPosts(db: Database): Promise<Post[]> {
  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function getPublishedPostBySlug(
  db: Database,
  slug: string,
): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug));
  return row && row.status === "published" ? row : null;
}

export async function getPostById(db: Database, id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}

export async function createPost(db: Database, input: PostInput): Promise<Post> {
  const data = postInputSchema.parse(input);
  const existing = await db.select({ slug: posts.slug }).from(posts);
  const slug = uniqueSlug(data.title, new Set(existing.map((r) => r.slug)));
  const [row] = await db
    .insert(posts)
    .values({
      slug,
      title: data.title,
      excerpt: data.excerpt,
      bodyMd: data.bodyMd,
      coverUrl: data.coverUrl ?? null,
      coverAlt: data.coverAlt ?? null,
    })
    .returning();
  return row;
}

export async function updatePost(
  db: Database,
  id: string,
  input: PostInput,
): Promise<Post | null> {
  const data = postInputSchema.parse(input);
  const [row] = await db
    .update(posts)
    .set({
      title: data.title,
      excerpt: data.excerpt,
      bodyMd: data.bodyMd,
      coverUrl: data.coverUrl ?? null,
      coverAlt: data.coverAlt ?? null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();
  return row ?? null;
}

/** Publish: sets published_at ONCE (first publish); re-publishing keeps the date. */
export async function setPostStatus(
  db: Database,
  id: string,
  status: "draft" | "published",
): Promise<Post | null> {
  const current = await getPostById(db, id);
  if (!current) return null;
  const publishedAt =
    status === "published" ? (current.publishedAt ?? new Date()) : current.publishedAt;
  const [row] = await db
    .update(posts)
    .set({ status, publishedAt, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return row ?? null;
}

export async function deletePost(db: Database, id: string): Promise<boolean> {
  const rows = await db.delete(posts).where(eq(posts.id, id)).returning();
  return rows.length > 0;
}
