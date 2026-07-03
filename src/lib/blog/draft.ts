import Anthropic from "@anthropic-ai/sdk";
import { type Env, llmMode, loadEnv } from "@/lib/env";
import { draftOutputSchema, type DraftOutput } from "./schema";

// AI article drafting (SPEC §15.5): the owner's rough notes → a validated
// {title, excerpt, bodyMd} draft in his voice. A single structured completion —
// deliberately NOT the planner/executor machinery (nothing here edits content;
// the owner reviews and saves through the normal posts CRUD). Deterministic
// fake when keyless, mirroring the planner selection pattern.

export interface Drafter {
  readonly mode: "fake" | "real";
  draft(notes: string): Promise<DraftOutput>;
}

/** Deterministic drafter for keyless dev/tests: structures the notes verbatim. */
export function fakeDrafter(): Drafter {
  return {
    mode: "fake",
    async draft(notes) {
      const lines = notes
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const first = lines[0] ?? "Notes";
      const title = first.length > 80 ? `${first.slice(0, 77)}…` : first;
      const rest = lines.slice(1);
      return draftOutputSchema.parse({
        title,
        excerpt: `${title} — from the studio floor.`,
        bodyMd: [
          `## ${title}`,
          "",
          ...(rest.length > 0 ? rest.map((l) => `${l}\n`) : [notes, ""]),
        ].join("\n"),
      });
    },
  };
}

export const DRAFT_MODEL_DEFAULT = "claude-sonnet-5";

const SYSTEM =
  "You draft articles for the owner of Studio 22, a premium gym, golf simulator " +
  "and pilates studio in Dún Laoghaire, from his rough notes or voice-note " +
  "transcripts. Write in his voice: plain, confident, evidence-led, no hype, no " +
  "exclamation marks. Keep every factual claim from the notes; invent nothing. " +
  "Respond with ONLY a JSON object: {\"title\": string, \"excerpt\": string " +
  "(1-2 sentences), \"bodyMd\": string (markdown, ## headings)}.";

// Minimal messages.create surface (testable with a stub).
export type DraftCreate = (body: Record<string, unknown>) => Promise<{
  stop_reason?: string | null;
  content: Array<{ type: string; text?: string }>;
}>;

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("no JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

/** Real drafter: one structured completion, zod-validated, one retry on invalid. */
export function realDrafter(create: DraftCreate, model: string): Drafter {
  async function once(notes: string, correction?: string): Promise<DraftOutput> {
    const res = await create({
      model,
      max_tokens: 4096,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: correction
            ? `NOTES:\n${notes}\n\nYour previous output was invalid: ${correction}. Respond with ONLY the corrected JSON.`
            : `NOTES:\n${notes}`,
        },
      ],
    });
    if (res.stop_reason === "refusal") throw new Error("the model refused the request");
    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");
    return draftOutputSchema.parse(extractJson(text));
  }

  return {
    mode: "real",
    async draft(notes) {
      try {
        return await once(notes);
      } catch (e) {
        return once(notes, e instanceof Error ? e.message : String(e));
      }
    },
  };
}

/** Real drafter when ANTHROPIC_API_KEY is present, deterministic fake otherwise. */
export function defaultDrafter(env: Env = loadEnv()): Drafter {
  if (llmMode(env) !== "real") return fakeDrafter();
  const client = new Anthropic({ apiKey: env.anthropicApiKey });
  const model = process.env.AGENT_MODEL?.trim() || DRAFT_MODEL_DEFAULT;
  const create: DraftCreate = (body) =>
    client.messages.create(
      body as unknown as Anthropic.MessageCreateParamsNonStreaming,
    ) as unknown as ReturnType<DraftCreate>;
  return realDrafter(create, model);
}
