import { z } from "zod";
import { PAGE_NAMES, type PageName } from "./schema";
import { ContentSchema, type Content } from "./content-types";
import { sectionNodeSchema } from "./registry";

/*
 * Typed, path-addressed edit ops (SPEC §15.2) — the ONLY content mutations.
 * Adapted from the template's single-page ops to this site's multi-page shape:
 * section ops carry a `page` scope; `setGlobal` addresses the global entities
 * (site / packages / testimonials / faqs). applyEdit applies a batch atomically
 * as one new version. Pure data + a pure reducer; nothing here touches the DB.
 */

const pathSegment = z.union([z.string(), z.number().int().nonnegative()]);
const pageName = z.enum(PAGE_NAMES);

export const GLOBAL_TARGETS = ["site", "packages", "testimonials", "faqs"] as const;
export type GlobalTarget = (typeof GLOBAL_TARGETS)[number];

export const editOpSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("setProp"),
    page: pageName,
    sectionId: z.string().min(1),
    path: z.array(pathSegment).min(1),
    value: z.unknown(),
  }),
  z.object({
    type: z.literal("setGlobal"),
    target: z.enum(GLOBAL_TARGETS),
    // [] replaces the whole target (e.g. the faqs array); deeper paths edit in place.
    path: z.array(pathSegment),
    value: z.unknown(),
  }),
  z.object({
    type: z.literal("insertSection"),
    page: pageName,
    index: z.number().int().nonnegative(),
    node: sectionNodeSchema,
  }),
  z.object({
    type: z.literal("moveSection"),
    page: pageName,
    sectionId: z.string().min(1),
    toIndex: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal("removeSection"),
    page: pageName,
    sectionId: z.string().min(1),
  }),
]);

export type EditOp = z.infer<typeof editOpSchema>;
export const editOpsSchema = z.array(editOpSchema).min(1);

/** Raised when an op targets something that doesn't exist or yields invalid content. */
export class OpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpError";
  }
}

function sectionsOf(content: Content, page: PageName) {
  const p = content.pages[page];
  if (!p) throw new OpError(`page "${page}" not found`);
  return p.sections;
}

function findIndexOrThrow(
  sections: { id?: string }[],
  page: string,
  sectionId: string,
): number {
  const idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1) throw new OpError(`section "${sectionId}" not found on page "${page}"`);
  return idx;
}

/** Set `value` at `path` inside an object, requiring intermediate nodes to exist. */
function setIn(
  root: Record<string | number, unknown>,
  path: (string | number)[],
  value: unknown,
): void {
  let cursor: unknown = root;
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i];
    if (cursor === null || typeof cursor !== "object") {
      throw new OpError(`invalid path segment "${seg}" (parent is not an object)`);
    }
    cursor = (cursor as Record<string | number, unknown>)[seg];
  }
  if (cursor === null || typeof cursor !== "object") {
    throw new OpError(
      `invalid path ${JSON.stringify(path)} (target parent is not an object)`,
    );
  }
  (cursor as Record<string | number, unknown>)[path[path.length - 1]] = value;
}

/**
 * Apply ops to a deep clone of `content`, returning new content. Pure: throws on
 * any bad target (no partial mutation of the input), and re-validates the whole
 * document so a sequence can't produce invalid content.
 */
export function applyOps(content: Content, ops: EditOp[]): Content {
  const next = structuredClone(content);

  for (const op of ops) {
    switch (op.type) {
      case "setProp": {
        const sections = sectionsOf(next, op.page);
        const idx = findIndexOrThrow(sections, op.page, op.sectionId);
        setIn(sections[idx] as Record<string, unknown>, op.path, op.value);
        break;
      }
      case "setGlobal": {
        if (op.path.length === 0) {
          (next as Record<GlobalTarget, unknown>)[op.target] = op.value;
        } else {
          setIn(next[op.target] as Record<string | number, unknown>, op.path, op.value);
        }
        break;
      }
      case "insertSection": {
        const sections = sectionsOf(next, op.page);
        if (op.index > sections.length) {
          throw new OpError(
            `insert index ${op.index} out of range (0..${sections.length}) on page "${op.page}"`,
          );
        }
        if (sections.some((s) => s.id === op.node.id)) {
          throw new OpError(`duplicate section id "${op.node.id}" on page "${op.page}"`);
        }
        sections.splice(op.index, 0, op.node);
        break;
      }
      case "moveSection": {
        const sections = sectionsOf(next, op.page);
        const from = findIndexOrThrow(sections, op.page, op.sectionId);
        const [node] = sections.splice(from, 1);
        const to = Math.min(op.toIndex, sections.length);
        sections.splice(to, 0, node);
        break;
      }
      case "removeSection": {
        const sections = sectionsOf(next, op.page);
        const idx = findIndexOrThrow(sections, op.page, op.sectionId);
        sections.splice(idx, 1);
        break;
      }
    }
  }

  const result = ContentSchema.safeParse(next);
  if (!result.success) {
    throw new OpError(
      `ops produced invalid content: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    );
  }
  return result.data;
}
