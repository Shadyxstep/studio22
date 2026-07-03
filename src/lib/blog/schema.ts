import { z } from "zod";

// Blog domain (SPEC §15.5). Post rows live in Postgres (db/schema.ts); this
// module holds the validation contracts + the pure slug logic.

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

/** Owner-editable fields (admin form + AI draft output). */
export const postInputSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  bodyMd: z.string().min(1),
  coverUrl: z.string().optional(),
  coverAlt: z.string().optional(),
});
export type PostInput = z.infer<typeof postInputSchema>;

/** The AI draft contract (SPEC §15.5): notes in, a validated draft out. */
export const draftOutputSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  bodyMd: z.string().min(1),
});
export type DraftOutput = z.infer<typeof draftOutputSchema>;

/** Slugify a title: lowercase, ascii-ish, hyphen-separated, trimmed. */
export function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "post";
}

/** Resolve a unique slug given the set already taken: base, base-2, base-3, … */
export function uniqueSlug(title: string, taken: ReadonlySet<string>): string {
  const base = slugify(title);
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
