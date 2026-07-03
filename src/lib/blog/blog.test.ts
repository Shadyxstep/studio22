import { describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/test";
import {
  createPost,
  deletePost,
  getPublishedPostBySlug,
  listAllPosts,
  listPublishedPosts,
  setPostStatus,
  updatePost,
} from "./queries";
import { renderMarkdown } from "./render";
import { slugify, uniqueSlug } from "./schema";
import { buildArticleJsonLd } from "@/lib/seo";
import { loadSite } from "@/lib/content/load";

const INPUT = {
  title: "Why strength is a skill",
  excerpt: "Strength is practised, not owned.",
  bodyMd: "## The point\n\nTrain like it matters.",
};

describe("slug logic", () => {
  it("slugifies titles and resolves collisions with -n suffixes", () => {
    expect(slugify("Why Strength Is a Skill!")).toBe("why-strength-is-a-skill");
    expect(slugify("  Émile's   plan  ")).toBe("emiles-plan");
    expect(slugify("!!!")).toBe("post");
    const taken = new Set(["why-strength-is-a-skill", "why-strength-is-a-skill-2"]);
    expect(uniqueSlug("Why Strength Is a Skill", taken)).toBe(
      "why-strength-is-a-skill-3",
    );
  });
});

describe("markdown rendering", () => {
  it("renders headings/lists and escapes raw HTML", () => {
    const html = renderMarkdown("## Head\n\n- one\n- two\n\n<script>alert(1)</script>");
    expect(html).toContain("<h2>Head</h2>");
    expect(html).toContain("<li>one</li>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("post lifecycle (PGlite)", () => {
  it("create → draft invisible → publish → visible; slug immutable; publish date stable", async () => {
    const { db, client } = await createTestDb();
    try {
      const post = await createPost(db, INPUT);
      expect(post.slug).toBe("why-strength-is-a-skill");
      expect(post.status).toBe("draft");

      // drafts are invisible to public reads
      expect(await listPublishedPosts(db)).toHaveLength(0);
      expect(await getPublishedPostBySlug(db, post.slug)).toBeNull();

      const published = await setPostStatus(db, post.id, "published");
      expect(published!.publishedAt).toBeInstanceOf(Date);
      expect(await getPublishedPostBySlug(db, post.slug)).not.toBeNull();

      // title edits do not change the slug; re-publishing keeps the original date
      const updated = await updatePost(db, post.id, { ...INPUT, title: "New title" });
      expect(updated!.slug).toBe("why-strength-is-a-skill");
      await setPostStatus(db, post.id, "draft");
      const republished = await setPostStatus(db, post.id, "published");
      expect(republished!.publishedAt!.getTime()).toBe(
        published!.publishedAt!.getTime(),
      );

      // collision: same title again gets -2
      const second = await createPost(db, INPUT);
      expect(second.slug).toBe("why-strength-is-a-skill-2");

      expect(await listAllPosts(db)).toHaveLength(2);
      expect(await deletePost(db, second.id)).toBe(true);
    } finally {
      await client.close();
    }
  });
});

describe("article JSON-LD", () => {
  it("builds schema.org Article from a post", async () => {
    const { db, client } = await createTestDb();
    try {
      const post = await createPost(db, INPUT);
      const live = await setPostStatus(db, post.id, "published");
      const jsonLd = buildArticleJsonLd(live!, loadSite());
      expect(jsonLd["@type"]).toBe("Article");
      expect(jsonLd.headline).toBe(INPUT.title);
      expect(jsonLd.url).toContain("/blog/why-strength-is-a-skill");
      expect(jsonLd.datePublished).toBeTruthy();
    } finally {
      await client.close();
    }
  });
});
