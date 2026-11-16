import { buildLlmsTxt } from "@/lib/llms";

/*
 * /llms.txt — a plain-markdown summary for AI assistants and answer engines
 * (llmstxt.org). Built from the same content files as the site, so prices,
 * classes and the timetable never drift from what visitors see.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
