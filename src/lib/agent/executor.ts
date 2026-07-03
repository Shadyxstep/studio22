import { applyEdit } from "@/lib/content/applyEdit";
import type { EditOp } from "@/lib/content/ops";
import type { Content } from "@/lib/content/content-types";
import type { PageName, Section } from "@/lib/content/schema";
import { getCurrentVersion } from "@/lib/db/versions";
import type { Version } from "@/lib/db/schema";
import type { Database } from "@/lib/db/types";
import { parseToolArgs, type ToolCall, TOOL_ARGS } from "./tools";
import type { EditScopes } from "./scopes";
import { STUDIO22_SCOPES } from "./scopes";
import type { z } from "zod";

// The single shared apply path (SPEC §15.4). For each ToolCall:
//   zod-validate args → resolve the target exists → enforce edit scopes
//   SERVER-SIDE → translate to an op.
// Then ALL accepted ops go through applyEdit as exactly ONE version (one NL
// request = one version). The planner/LLM is an untrusted client: out-of-scope
// edits are rejected HERE even when the planner emitted them — never in a prompt.

export class EditScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EditScopeError";
  }
}

export interface RejectedCall {
  call: ToolCall;
  reason: string;
}

export interface ExecutionResult {
  version: Version | null; // null when no op was accepted
  applied: number;
  rejected: RejectedCall[];
}

type Args<T extends keyof typeof TOOL_ARGS> = z.infer<(typeof TOOL_ARGS)[T]>;

function findSection(
  content: Content,
  page: PageName,
  id: string,
): Section {
  const node = content.pages[page]?.sections.find((s) => s.id === id);
  if (!node) {
    throw new EditScopeError(`section "${id}" not found on page "${page}"`);
  }
  return node;
}

/** Validate one call against args, target existence, and edit scopes → an op. */
function toOp(call: ToolCall, content: Content, scopes: EditScopes): EditOp {
  const parsed = parseToolArgs(call);
  if (!parsed.success) {
    throw new EditScopeError(
      `invalid args for ${call.tool}: ${parsed.error.issues
        .map((i) => i.message)
        .join("; ")}`,
    );
  }

  switch (call.tool) {
    case "set_prop": {
      const args = parsed.data as Args<"set_prop">;
      const node = findSection(content, args.page, args.sectionId);
      const field = String(args.path[0]);
      if (!scopes.editableFields[node.type].includes(field)) {
        throw new EditScopeError(
          `field "${field}" is not editable on "${node.type}"`,
        );
      }
      return {
        type: "setProp",
        page: args.page,
        sectionId: args.sectionId,
        path: args.path,
        value: args.value,
      };
    }
    case "set_global": {
      const args = parsed.data as Args<"set_global">;
      if (!scopes.targets.includes(args.target)) {
        throw new EditScopeError(`global target "${args.target}" is not editable`);
      }
      if (args.target === "site") {
        const head = String(args.path[0] ?? "");
        if (!scopes.siteFields.includes(head)) {
          throw new EditScopeError(`site field "${head || "(whole site)"}" is not editable`);
        }
      }
      if (args.target === "packages" && args.path.length >= 2) {
        const field = String(args.path[1]);
        if (!scopes.packageFields.includes(field)) {
          throw new EditScopeError(`package field "${field}" is not editable`);
        }
      }
      return {
        type: "setGlobal",
        target: args.target,
        path: args.path,
        value: args.value,
      };
    }
    case "insert_section": {
      const args = parsed.data as Args<"insert_section">;
      if (!scopes.insertableTypes.includes(args.node.type)) {
        throw new EditScopeError(
          `inserting section type "${args.node.type}" is not allowed`,
        );
      }
      return {
        type: "insertSection",
        page: args.page,
        index: args.index,
        node: args.node,
      };
    }
    case "move_section": {
      const args = parsed.data as Args<"move_section">;
      findSection(content, args.page, args.sectionId);
      return {
        type: "moveSection",
        page: args.page,
        sectionId: args.sectionId,
        toIndex: args.toIndex,
      };
    }
    case "remove_section": {
      const args = parsed.data as Args<"remove_section">;
      findSection(content, args.page, args.sectionId);
      return {
        type: "removeSection",
        page: args.page,
        sectionId: args.sectionId,
      };
    }
  }
}

/**
 * Execute a planned request: validate + scope-check every call, then apply the
 * accepted ops as exactly one version. Out-of-scope/invalid/missing-target calls
 * are rejected (counted), never applied.
 */
export async function execute(
  db: Database,
  calls: ToolCall[],
  opSummary?: string,
  scopes: EditScopes = STUDIO22_SCOPES,
): Promise<ExecutionResult> {
  const current = await getCurrentVersion(db);
  if (!current) throw new EditScopeError("site has no current version");

  const ops: EditOp[] = [];
  const rejected: RejectedCall[] = [];
  for (const call of calls) {
    try {
      ops.push(toOp(call, current.content, scopes));
    } catch (e) {
      rejected.push({ call, reason: e instanceof Error ? e.message : String(e) });
    }
  }

  if (ops.length === 0) return { version: null, applied: 0, rejected };

  // One NL request = exactly one version.
  const version = await applyEdit(db, ops, { author: "agent", opSummary });
  return { version, applied: ops.length, rejected };
}
