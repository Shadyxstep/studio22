import { describe, expect, it, vi } from "vitest";
import { fakeDrafter, realDrafter, type DraftCreate } from "./draft";

describe("fake drafter", () => {
  it("is deterministic and satisfies the draft contract", async () => {
    const notes = "Strength is a skill\nPractise heavy singles\nRest properly";
    const a = await fakeDrafter().draft(notes);
    const b = await fakeDrafter().draft(notes);
    expect(a).toEqual(b);
    expect(a.title).toBe("Strength is a skill");
    expect(a.bodyMd).toContain("## Strength is a skill");
    expect(a.excerpt.length).toBeGreaterThan(0);
  });
});

describe("real drafter (stubbed transport)", () => {
  it("parses a valid JSON completion", async () => {
    const stub: DraftCreate = async () => ({
      stop_reason: "end_turn",
      content: [
        {
          type: "text",
          text: 'Here you go: {"title": "T", "excerpt": "E", "bodyMd": "## T\\n\\nBody"}',
        },
      ],
    });
    const draft = await realDrafter(stub, "test-model").draft("notes");
    expect(draft.title).toBe("T");
    expect(draft.bodyMd).toContain("Body");
  });

  it("retries once on invalid output, then rejects via zod", async () => {
    const create = vi
      .fn<DraftCreate>()
      // first: missing bodyMd → zod fails → retry
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: '{"title": "T", "excerpt": "E"}' }],
      })
      // second: still invalid → the call rejects
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: '{"title": "", "excerpt": "", "bodyMd": ""}' }],
      });
    await expect(realDrafter(create, "test-model").draft("notes")).rejects.toThrow();
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("recovers when the retry returns valid JSON", async () => {
    const create = vi
      .fn<DraftCreate>()
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [{ type: "text", text: "no json here" }],
      })
      .mockResolvedValueOnce({
        stop_reason: "end_turn",
        content: [
          { type: "text", text: '{"title": "T2", "excerpt": "E2", "bodyMd": "B2"}' },
        ],
      });
    const draft = await realDrafter(create, "test-model").draft("notes");
    expect(draft.title).toBe("T2");
  });
});
