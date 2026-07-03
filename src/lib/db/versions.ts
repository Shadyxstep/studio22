import { eq } from "drizzle-orm";
import { sites, type Site, type Version, versions } from "./schema";
import type { Database } from "./types";

// Pure site/version queries (SPEC §15.2): all SQL lives here, never in routes
// or pages. The atomic commit path (content/commit.ts, T5.5) composes these.

export const CUSTOMER_KEY = "studio22";

export async function getSite(db: Database): Promise<Site | null> {
  const [row] = await db
    .select()
    .from(sites)
    .where(eq(sites.customerKey, CUSTOMER_KEY));
  return row ?? null;
}

export async function getVersionById(
  db: Database,
  id: string,
): Promise<Version | null> {
  const [row] = await db.select().from(versions).where(eq(versions.id, id));
  return row ?? null;
}

/** The live version: the row pointed to by sites.current_version_id. */
export async function getCurrentVersion(
  db: Database,
): Promise<Version | null> {
  const [row] = await db
    .select({ version: versions })
    .from(sites)
    .innerJoin(versions, eq(versions.id, sites.currentVersionId))
    .where(eq(sites.customerKey, CUSTOMER_KEY));
  return row?.version ?? null;
}
