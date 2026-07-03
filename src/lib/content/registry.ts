import { z } from "zod";
import {
  SECTION_TYPES,
  SectionSchema,
  type Section,
  type SectionType,
} from "./schema";

/*
 * Section registry (SPEC §15.2): the closed map from section type to its props
 * schema, derived from the single source of truth in schema.ts. The agent's
 * insert tool and the ops reducer both validate nodes against this — an unknown
 * type cannot enter content, mirroring the build-time registry for components.
 */

type SectionOption = (typeof SectionSchema.options)[number];

function literalType(option: SectionOption): SectionType {
  return option.shape.type.value as SectionType;
}

export const SECTION_SCHEMAS: ReadonlyMap<SectionType, SectionOption> = new Map(
  SectionSchema.options.map((option) => [literalType(option), option]),
);

// Closed-registry invariant: exactly one schema per declared section type.
if (SECTION_SCHEMAS.size !== SECTION_TYPES.length) {
  throw new Error("section registry is out of sync with SECTION_TYPES");
}

/** A section as inserted into DB content: valid per its type AND carrying an id. */
export const sectionNodeSchema: z.ZodType<Section> = SectionSchema.refine(
  (s) => Boolean(s.id?.trim()),
  { message: "inserted sections require an id" },
);
