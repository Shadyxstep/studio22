import type { Version, VersionAuthor } from "@/lib/db/schema";
import { getCurrentVersion, getVersionById } from "@/lib/db/versions";
import type { Database } from "@/lib/db/types";
import { safeRevalidate } from "./applyEdit";
import { commitVersion } from "./commit";
import { OpError } from "./ops";

// Undo/redo = revert-to-parent (SPEC §15.2): produce a NEW version whose
// content restores the current version's parent — never destructive.

async function revertToParent(
  db: Database,
  author: VersionAuthor,
): Promise<Version> {
  const current = await getCurrentVersion(db);
  if (!current) throw new OpError("site has no current version");
  if (!current.parentVersionId) {
    throw new OpError("current version has no parent to revert to");
  }
  const parent = await getVersionById(db, current.parentVersionId);
  if (!parent) {
    throw new OpError(`parent version "${current.parentVersionId}" not found`);
  }

  const version = await commitVersion(db, current.siteId, {
    parentVersionId: current.id,
    content: parent.content,
    author,
    opSummary: `revert to ${parent.id}`,
  });
  await safeRevalidate();
  return version;
}

export async function canUndo(db: Database): Promise<boolean> {
  const current = await getCurrentVersion(db);
  return Boolean(current?.parentVersionId);
}

export async function canRedo(db: Database): Promise<boolean> {
  const current = await getCurrentVersion(db);
  return current?.author === "undo";
}

/** Revert to the parent of the current version. */
export async function undo(db: Database): Promise<Version> {
  if (!(await canUndo(db))) throw new OpError("nothing to undo");
  return revertToParent(db, "undo");
}

/** Reapply the change that was just undone (only valid immediately after undo). */
export async function redo(db: Database): Promise<Version> {
  if (!(await canRedo(db))) {
    throw new OpError("nothing to redo (last action was not an undo)");
  }
  return revertToParent(db, "redo");
}
