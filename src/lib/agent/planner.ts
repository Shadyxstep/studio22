import type { Content } from "@/lib/content/content-types";
import { planFake } from "./planner.fake";
import type { ToolCall } from "./tools";

// Planner selection (SPEC §15.4): fake by default; real (Claude) when
// ANTHROPIC_API_KEY is present — see defaultPlanner in planner.anthropic.ts.
// Both return the identical ToolCall[] shape. The fake planner never touches
// the store; it only produces tool calls for the shared executor. SDK-free.

export interface Planner {
  readonly mode: "fake" | "real";
  plan(request: string, content: Content): Promise<ToolCall[]>;
}

export function fakePlanner(): Planner {
  return {
    mode: "fake",
    async plan(request, content) {
      return planFake(request, content);
    },
  };
}
