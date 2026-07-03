"use client";

import { useState } from "react";

interface Turn {
  role: "owner" | "agent";
  text: string;
}

interface ChatResponse {
  ok: boolean;
  error?: string;
  data?: {
    mode: "fake" | "real";
    planned: number;
    applied: number;
    rejected: string[];
    versionId: string | null;
    canUndo: boolean;
  };
}

function summarise(data: NonNullable<ChatResponse["data"]>): string {
  if (data.applied === 0 && data.rejected.length === 0) {
    return "I couldn't map that to an edit. Try naming the page and section, e.g. “change the home hero headline to …”.";
  }
  const parts: string[] = [];
  if (data.applied > 0) {
    parts.push(
      `Applied ${data.applied} edit${data.applied === 1 ? "" : "s"} — the site is updated.`,
    );
  }
  for (const reason of data.rejected) parts.push(`Skipped one: ${reason}`);
  return parts.join(" ");
}

export function ChatEditor() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    setTurns((t) => [...t, { role: "owner", text }]);
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = (await res.json()) as ChatResponse;
      if (json.ok && json.data) {
        setCanUndo(json.data.canUndo);
        setTurns((t) => [...t, { role: "agent", text: summarise(json.data!) }]);
      } else {
        setTurns((t) => [
          ...t,
          { role: "agent", text: json.error ?? "Something went wrong." },
        ]);
      }
    } catch {
      setTurns((t) => [
        ...t,
        { role: "agent", text: "Something went wrong — try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function undoLast() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "undo" }),
      });
      const json = (await res.json()) as ChatResponse;
      setCanUndo(Boolean(json.ok && json.data?.canUndo));
      setTurns((t) => [
        ...t,
        {
          role: "agent",
          text: json.ok ? "Undone — the previous version is live again." : (json.error ?? "Nothing to undo."),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-bone">Site editor</h2>
        {canUndo && (
          <button
            type="button"
            onClick={undoLast}
            disabled={busy}
            className="text-sm text-mid underline-offset-4 hover:text-bone hover:underline disabled:opacity-50"
          >
            Undo last change
          </button>
        )}
      </div>
      <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-line p-5">
        {turns.length === 0 && (
          <p className="text-sm text-mid">
            Tell me what to change — for example “change the home hero headline
            to ‘Train with intent’” or “update the phone number to ‘+353 …’”.
          </p>
        )}
        {turns.map((turn, i) => (
          <p
            key={i}
            className={
              turn.role === "owner"
                ? "self-end rounded-2xl bg-sage/15 px-4 py-2 text-sm text-bone"
                : "self-start text-sm text-mid"
            }
          >
            {turn.text}
          </p>
        ))}
        {busy && <p className="self-start text-sm text-mid">Working…</p>}
      </div>
      <form onSubmit={send} className="flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the change…"
          className="flex-1 rounded-full border border-line bg-transparent px-5 py-3 text-sm text-bone outline-none transition-colors focus:border-sage"
        />
        <button
          type="submit"
          disabled={busy || message.trim().length === 0}
          className="rounded-full border border-sage bg-sage px-6 py-3 text-sm text-ink transition-colors hover:bg-sage/85 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}
