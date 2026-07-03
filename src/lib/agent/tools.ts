import { z } from "zod";
import { PAGE_NAMES, SECTION_TYPES } from "@/lib/content/schema";
import { sectionNodeSchema } from "@/lib/content/registry";
import { GLOBAL_TARGETS } from "@/lib/content/ops";

// Agent tool definitions (SPEC §15.4). Each tool maps 1:1 to an applyEdit op
// type; the Anthropic input_schema is derived from these shapes. Both the fake
// planner and the real Claude client emit the same ToolCall[] shape; the
// executor is the single shared apply path and the only place edits are
// validated against the owner's edit scopes.

export const TOOL_NAMES = [
  "set_prop",
  "set_global",
  "insert_section",
  "move_section",
  "remove_section",
] as const;
export type ToolName = (typeof TOOL_NAMES)[number];

const pathSegment = z.union([z.string(), z.number().int().nonnegative()]);
const page = z.enum(PAGE_NAMES);

// Per-tool argument schemas (the LLM is an untrusted client; the executor
// re-validates every call against these).
export const TOOL_ARGS = {
  set_prop: z.object({
    page,
    sectionId: z.string().min(1),
    path: z.array(pathSegment).min(1),
    value: z.unknown(),
  }),
  set_global: z.object({
    target: z.enum(GLOBAL_TARGETS),
    path: z.array(pathSegment),
    value: z.unknown(),
  }),
  insert_section: z.object({
    page,
    index: z.number().int().nonnegative(),
    node: sectionNodeSchema,
  }),
  move_section: z.object({
    page,
    sectionId: z.string().min(1),
    toIndex: z.number().int().nonnegative(),
  }),
  remove_section: z.object({
    page,
    sectionId: z.string().min(1),
  }),
} as const satisfies Record<ToolName, z.ZodType>;

export const toolCallSchema = z.object({
  tool: z.enum(TOOL_NAMES),
  args: z.record(z.string(), z.unknown()),
});
export type ToolCall = z.infer<typeof toolCallSchema>;
export const toolPlanSchema = z.array(toolCallSchema);

/** Validate a tool call's args against its per-tool schema (executor + tests). */
export function parseToolArgs(call: ToolCall) {
  return TOOL_ARGS[call.tool].safeParse(call.args);
}

export interface ToolDefinition {
  name: ToolName;
  description: string;
  input_schema: Record<string, unknown>;
}

const pathItem = {
  anyOf: [{ type: "string" }, { type: "integer", minimum: 0 }],
};
const pageProp = {
  type: "string",
  enum: [...PAGE_NAMES],
  description: "the page being edited",
};

// Hand-authored Anthropic input_schema per tool. Kept hand-written (not
// auto-derived) so the schema Claude sees is exact and stable; the executor
// still re-validates every arg against TOOL_ARGS.
export function toolDefinitions(): ToolDefinition[] {
  return [
    {
      name: "set_prop",
      description:
        'Edit a field of an existing section on a page. `path` addresses the field, e.g. ["headline"] or ["stats", 0, "value"].',
      input_schema: {
        type: "object",
        properties: {
          page: pageProp,
          sectionId: { type: "string", description: "id of an existing section on that page" },
          path: { type: "array", items: pathItem, minItems: 1 },
          value: { description: "the new value (string/number/array/object)" },
        },
        required: ["page", "sectionId", "path", "value"],
      },
    },
    {
      name: "set_global",
      description:
        "Edit the global entities: site settings (contact, hours, sauna, signup copy), the package catalog, testimonials, or FAQs. An empty path replaces the whole target (e.g. the FAQ list).",
      input_schema: {
        type: "object",
        properties: {
          target: { type: "string", enum: [...GLOBAL_TARGETS] },
          path: { type: "array", items: pathItem },
          value: { description: "the new value" },
        },
        required: ["target", "path", "value"],
      },
    },
    {
      name: "insert_section",
      description:
        "Insert a new section at an index on a page. `type` must be a registered section type; give it a new unique id.",
      input_schema: {
        type: "object",
        properties: {
          page: pageProp,
          index: { type: "integer", minimum: 0 },
          node: {
            type: "object",
            description:
              "the full section object incl. `type` (one of the registered types), a new unique `id`, and its fields",
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: [...SECTION_TYPES] },
            },
            required: ["id", "type"],
          },
        },
        required: ["page", "index", "node"],
      },
    },
    {
      name: "move_section",
      description: "Move an existing section to a new index on its page.",
      input_schema: {
        type: "object",
        properties: {
          page: pageProp,
          sectionId: { type: "string" },
          toIndex: { type: "integer", minimum: 0 },
        },
        required: ["page", "sectionId", "toIndex"],
      },
    },
    {
      name: "remove_section",
      description: "Remove an existing section from a page by id.",
      input_schema: {
        type: "object",
        properties: {
          page: pageProp,
          sectionId: { type: "string" },
        },
        required: ["page", "sectionId"],
      },
    },
  ];
}
