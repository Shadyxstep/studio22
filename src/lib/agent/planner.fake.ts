import type { Content } from "@/lib/content/content-types";
import { PAGE_NAMES, type PageName } from "@/lib/content/schema";
import type { ToolCall } from "./tools";

// Deterministic fake planner (SPEC §15.4). Maps a natural-language request to a
// ToolCall[] via keyword/section matching — same shape as the real planner, so
// keyless dev and tests exercise the identical executor path.

const QUOTED = /["“”']([^"“”']+)["“”']/; // first quoted string in the request

const FIELDS = [
  "headline",
  "heading",
  "tagline",
  "sub",
  "label",
  "body",
] as const;

function matchPage(request: string): PageName {
  const lower = request.toLowerCase();
  for (const name of PAGE_NAMES) {
    if (lower.includes(name.replace("-", " ")) || lower.includes(name)) {
      return name;
    }
  }
  return "home";
}

/** Find a section id on the page whose id or type is named in the request. */
function matchSection(
  request: string,
  content: Content,
  page: PageName,
): string | null {
  const lower = request.toLowerCase();
  const sections = content.pages[page]?.sections ?? [];
  for (const node of sections) {
    if (node.id && lower.includes(node.id.toLowerCase())) return node.id;
  }
  for (const node of sections) {
    if (lower.includes(node.type.toLowerCase())) return node.id ?? null;
  }
  return null;
}

/**
 * Plan a request into tool calls (may be empty if nothing matched).
 * Deterministic for a given (request, content).
 */
export function planFake(request: string, content: Content): ToolCall[] {
  const lower = request.toLowerCase();
  const page = matchPage(request);
  const calls: ToolCall[] = [];

  // 1. Contact detail changes: "phone/email ... '<value>'"
  const quoted = request.match(QUOTED)?.[1];
  if (quoted && (lower.includes("phone") || lower.includes("email"))) {
    const field = lower.includes("phone") ? "phone" : "email";
    calls.push({
      tool: "set_global",
      args: { target: "site", path: ["contact", field], value: quoted },
    });
    return calls;
  }

  // 2. Remove a section: "remove/delete the <section>"
  if (/\b(remove|delete)\b/.test(lower)) {
    const id = matchSection(request, content, page);
    if (id) {
      calls.push({ tool: "remove_section", args: { page, sectionId: id } });
    }
    return calls;
  }

  // 3. Section copy change: "<field> ... '<value>'" on a matched section.
  if (quoted) {
    const id = matchSection(request, content, page);
    if (id) {
      const field = FIELDS.find((f) => lower.includes(f)) ?? "headline";
      calls.push({
        tool: "set_prop",
        args: { page, sectionId: id, path: [field], value: quoted },
      });
    }
  }

  return calls;
}
