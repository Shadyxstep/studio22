import Anthropic from "@anthropic-ai/sdk";
import { type Env, llmMode, loadEnv } from "@/lib/env";
import type { Content } from "@/lib/content/content-types";
import { fakePlanner, type Planner } from "./planner";
import { GUARDRAILS } from "./scopes";
import { toolDefinitions, toolPlanSchema, type ToolCall } from "./tools";

// Real planner (SPEC §15.4): Claude via a manual tool-use loop. The owner's
// request + the current content go to the model with the agent tools; Claude
// emits tool_use blocks collected into a ToolCall[] (the same shape the fake
// planner produces). The executor then validates + applies them — Claude is an
// untrusted client, so out-of-scope edits are still rejected there.

// Default model: Sonnet (SPEC §15.4 cost posture) — override via AGENT_MODEL.
export const DEFAULT_AGENT_MODEL = "claude-sonnet-5";

export class LlmRefusalError extends Error {
  constructor() {
    super("the model refused the request");
    this.name = "LlmRefusalError";
  }
}

// Minimal Anthropic messages.create surface we depend on (SDK-version-stable).
export type PlanCreate = (body: Record<string, unknown>) => Promise<{
  stop_reason?: string | null;
  content: Array<{ type: string; id?: string; name?: string; input?: unknown }>;
}>;

const SYSTEM =
  "You are the site editor for Studio 22, a premium gym, golf simulator and " +
  "pilates studio in Dún Laoghaire. Convert the owner's request into tool calls " +
  "that edit the site content. Rules: " +
  "(1) Only use the provided tools — do not reply with prose. " +
  "(2) Use the exact page names and section ids from the CURRENT CONTENT. " +
  "(3) Make the minimal set of edits that satisfies the request. " +
  "(4) If the request cannot be expressed as edits to this site, make no tool calls. " +
  GUARDRAILS.map((g, i) => `(${5 + i}) ${g}`).join(" ");

const MAX_ROUNDS = 4;

function contentDigest(content: Content): string {
  // Compact view: per-page section ids/types + the editable globals.
  return JSON.stringify({
    pages: Object.fromEntries(
      Object.entries(content.pages).map(([name, page]) => [
        name,
        page.sections.map((s) => ({ id: s.id, ...s })),
      ]),
    ),
    site: content.site,
    packages: content.packages,
    testimonials: content.testimonials,
    faqs: content.faqs,
  });
}

/** Build a planning round trip from an Anthropic-style create fn (testable w/ a stub). */
export function anthropicTransport(create: PlanCreate, model: string) {
  return async (request: string, content: Content): Promise<unknown> => {
    const messages: Array<{ role: string; content: unknown }> = [
      {
        role: "user",
        content: `CURRENT CONTENT:\n${contentDigest(content)}\n\nREQUEST: ${request}`,
      },
    ];
    const calls: Array<{ tool: string; args: Record<string, unknown> }> = [];

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const res = await create({
        model,
        max_tokens: 4096,
        system: SYSTEM,
        tools: toolDefinitions(),
        messages,
      });
      if (res.stop_reason === "refusal") throw new LlmRefusalError();

      const toolUses = res.content.filter((b) => b.type === "tool_use");
      for (const tu of toolUses) {
        if (tu.name) {
          calls.push({
            tool: tu.name,
            args: (tu.input ?? {}) as Record<string, unknown>,
          });
        }
      }
      if (res.stop_reason !== "tool_use" || toolUses.length === 0) break;

      // Continue the loop: echo the assistant turn + ack each call so Claude can
      // decide whether more edits are needed; the executor applies once, after.
      messages.push({ role: "assistant", content: res.content });
      messages.push({
        role: "user",
        content: toolUses.map((tu) => ({
          type: "tool_result",
          tool_use_id: tu.id,
          content: "queued",
        })),
      });
    }
    return calls;
  };
}

/** A real planner backed by a create fn; validates the emitted plan (untrusted client). */
export function realPlanner(create: PlanCreate, model: string): Planner {
  const transport = anthropicTransport(create, model);
  return {
    mode: "real",
    async plan(request, content): Promise<ToolCall[]> {
      return toolPlanSchema.parse(await transport(request, content));
    },
  };
}

/**
 * Default planner (SPEC §15.4): real Claude when ANTHROPIC_API_KEY is present,
 * deterministic fake otherwise. The single selection point for the chat route.
 */
export function defaultPlanner(env: Env = loadEnv()): Planner {
  if (llmMode(env) !== "real") return fakePlanner();
  const client = new Anthropic({ apiKey: env.anthropicApiKey });
  const model = process.env.AGENT_MODEL?.trim() || DEFAULT_AGENT_MODEL;
  const create: PlanCreate = (body) =>
    client.messages.create(
      body as unknown as Anthropic.MessageCreateParamsNonStreaming,
    ) as unknown as ReturnType<PlanCreate>;
  return realPlanner(create, model);
}
