import { PAGE_NAMES, type Page, type PageName, type Section } from "./schema";
import { loadGlobals, loadPage } from "./load";
import { ContentSchema, seedSectionId, type Content } from "./content-types";
import { getSite, CUSTOMER_KEY } from "@/lib/db/versions";
import { sites, versions, type Site } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import { eq } from "drizzle-orm";

// Seed (SPEC §15.2): transform content/*.json into the DB Content document with
// deterministic section ids, and install it as a site's first version. The same
// transform feeds the file-fallback path (T5.3), so files and DB render through
// one shape. Idempotent: an existing site with a current version is left alone.

/** Assign deterministic ids (`page.type.n`) to a page's sections. */
export function withSectionIds(pageName: PageName, page: Page): Page {
  const typeCounts = new Map<string, number>();
  const sections: Section[] = page.sections.map((section) => {
    const n = typeCounts.get(section.type) ?? 0;
    typeCounts.set(section.type, n + 1);
    return { ...section, id: section.id ?? seedSectionId(pageName, section.type, n) };
  });
  return { ...page, sections };
}

/** Build the full DB Content document from the content/ files. Pure given loaders. */
export function buildSeedContent(): Content {
  const globals = loadGlobals();
  const pages = Object.fromEntries(
    PAGE_NAMES.map((name) => [name, withSectionIds(name, loadPage(name))]),
  ) as Record<PageName, Page>;
  return ContentSchema.parse({ ...globals, pages });
}

export interface SeedResult {
  site: Site;
  created: boolean;
}

/**
 * Install the seed content as the site's first version. Re-running against a
 * seeded site changes nothing (created: false, version count unchanged).
 */
export async function seedSite(
  db: Database,
  content: Content = buildSeedContent(),
): Promise<SeedResult> {
  const existing = await getSite(db);
  if (existing?.currentVersionId) return { site: existing, created: false };

  let site: Site;
  if (existing) {
    site = existing;
  } else {
    const [inserted] = await db
      .insert(sites)
      .values({ customerKey: CUSTOMER_KEY })
      .returning();
    site = inserted;
  }

  const [version] = await db
    .insert(versions)
    .values({
      siteId: site.id,
      parentVersionId: null,
      content,
      author: "seed",
      opSummary: "initial seed from content/*.json",
    })
    .returning();

  await db
    .update(sites)
    .set({ currentVersionId: version.id })
    .where(eq(sites.id, site.id));

  return { site: { ...site, currentVersionId: version.id }, created: true };
}
