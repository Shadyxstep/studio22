import { z } from "zod";
import {
  FaqsFileSchema,
  PAGE_NAMES,
  PackagesSchema,
  PageSchema,
  SiteSchema,
  TestimonialsFileSchema,
} from "./schema";

/*
 * The DB content shape (SPEC §15.2): everything the site renders, as one JSONB
 * document per version. File schemas (schema.ts) stay the single source of truth
 * for every fragment; this file only composes them and enforces the DB-only
 * invariant that every section carries a unique deterministic id.
 */

export const DbPagesSchema = z.record(z.enum(PAGE_NAMES), PageSchema);

export const ContentSchema = z
  .object({
    site: SiteSchema,
    packages: PackagesSchema,
    testimonials: TestimonialsFileSchema,
    faqs: FaqsFileSchema,
    pages: DbPagesSchema,
  })
  .superRefine((content, ctx) => {
    for (const [pageName, page] of Object.entries(content.pages)) {
      const seen = new Set<string>();
      page.sections.forEach((section, i) => {
        if (!section.id) {
          ctx.addIssue({
            code: "custom",
            path: ["pages", pageName, "sections", i, "id"],
            message: "DB content requires a section id",
          });
          return;
        }
        if (seen.has(section.id)) {
          ctx.addIssue({
            code: "custom",
            path: ["pages", pageName, "sections", i, "id"],
            message: `duplicate section id "${section.id}"`,
          });
        }
        seen.add(section.id);
      });
    }
  });

export type Content = z.infer<typeof ContentSchema>;

/** Deterministic id for a seeded section: `<page>.<type>.<n>` (nth of that type on the page). */
export function seedSectionId(
  pageName: string,
  sectionType: string,
  nthOfType: number,
): string {
  return `${pageName}.${sectionType}.${nthOfType}`;
}
