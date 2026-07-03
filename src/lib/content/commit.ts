import { eq } from "drizzle-orm";
import { sites, versions, type Version, type VersionAuthor } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import type { Content } from "./content-types";

// The single low-level write path (SPEC §15.2): append exactly one version and
// advance sites.current_version_id, atomically. applyEdit (ops-based) and
// revertToParent (undo/redo) both commit through here, so there is one
// transactional point where content is written.

export interface CommitInput {
  parentVersionId: string | null;
  content: Content;
  author: VersionAuthor;
  opSummary?: string;
}

export async function commitVersion(
  db: Database,
  siteId: string,
  input: CommitInput,
): Promise<Version> {
  return db.transaction(async (tx) => {
    const [version] = await tx
      .insert(versions)
      .values({
        siteId,
        parentVersionId: input.parentVersionId,
        content: input.content,
        author: input.author,
        opSummary: input.opSummary ?? null,
      })
      .returning();
    await tx
      .update(sites)
      .set({ currentVersionId: version.id })
      .where(eq(sites.id, siteId));
    return version;
  });
}
