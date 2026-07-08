import type { VersionAuthor } from "@/lib/db/schema";
import { getCurrentVersion } from "@/lib/db/versions";
import type { Version } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import { commitVersion } from "./commit";
import { applyOps, editOpsSchema, OpError, type EditOp } from "./ops";

// applyEdit is THE single content-mutation primitive (SPEC §15.2). Manual edits
// and agent edits funnel through it; nothing else writes content. One call =
// exactly one new version (parent = prior current), atomically. Op failures
// throw BEFORE any write, so a partial batch adds 0 versions.

export interface ApplyEditOptions {
  author: VersionAuthor;
  opSummary?: string;
}

export async function applyEdit(
  db: Database,
  ops: EditOp[],
  options: ApplyEditOptions,
): Promise<Version> {
  // Validate op shapes up front (untrusted callers, e.g. the agent executor).
  const parsedOps = editOpsSchema.parse(ops);

  const current = await getCurrentVersion(db);
  if (!current) throw new OpError("site has no current version to edit");

  // Compute the next content purely; throws on any invalid op (0 writes so far).
  const nextContent = applyOps(current.content, parsedOps);

  // No cache invalidation needed: public pages are dynamic and read the
  // current version per request (content/serve.ts, 2026-07-07 amendment).
  return commitVersion(db, current.siteId, {
    parentVersionId: current.id,
    content: nextContent,
    author: options.author,
    opSummary: options.opSummary,
  });
}
