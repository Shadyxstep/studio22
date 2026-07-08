import { contentMode, loadEnv } from "@/lib/env";
import type { Page, PageName } from "./schema";
import type { Globals } from "./load";
import { buildSeedContent } from "./seed";
import type { Content } from "./content-types";

// Content serving (SPEC §15.1, amended after preview testing 2026-07-07):
// pages are DYNAMIC and read the current version per request. The original
// static + revalidateTag design left deployed pages serving stale content —
// tag invalidation raced the route re-render and stale HTML got re-cached
// (~1 min lag at best, silent no-op at worst). A direct read is correct by
// construction; at this site's traffic a per-request DB read is negligible.
// File mode (no DATABASE_URL): the seed transform of content/*.json, memoized —
// and the fallback whenever the DB read fails, so the site never goes down
// with the database.

let fileContent: Content | undefined;

/** The content/*.json document (memoized — files are immutable at runtime). */
function getFileContent(): Content {
  fileContent ??= buildSeedContent();
  return fileContent;
}

async function readDbContent(): Promise<Content> {
  // Lazy imports keep pg out of the module graph in file mode.
  const { getDb } = await import("@/lib/db/client");
  const { getCurrentVersion } = await import("@/lib/db/versions");
  const version = await getCurrentVersion(getDb());
  if (!version) throw new Error("site is not seeded (no current version)");
  return version.content;
}

/** The live content document. Never throws in page rendering: DB errors fall back to files. */
export async function getContent(): Promise<Content> {
  if (contentMode(loadEnv()) === "files") return getFileContent();
  try {
    return await readDbContent();
  } catch (err) {
    console.error("content: DB read failed, serving file fallback", err);
    return getFileContent();
  }
}

export interface PageContent {
  page: Page;
  globals: Globals;
}

/** Everything one page route needs: its section list + the global entities. */
export async function getPageContent(name: PageName): Promise<PageContent> {
  const content = await getContent();
  const page = content.pages[name];
  if (!page) throw new Error(`unknown page "${name}"`);
  return {
    page,
    globals: {
      site: content.site,
      packages: content.packages,
      testimonials: content.testimonials,
      faqs: content.faqs,
    },
  };
}
