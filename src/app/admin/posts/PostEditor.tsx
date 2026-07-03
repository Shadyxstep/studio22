"use client";

import { useState } from "react";

export interface EditablePost {
  id: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  coverUrl: string | null;
  coverAlt: string | null;
}

const inputCls =
  "rounded-2xl border border-line bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-sage";

export function PostEditor({
  post,
  onDone,
}: {
  post: EditablePost | null;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [bodyMd, setBodyMd] = useState(post?.bodyMd ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function draftFromNotes() {
    if (!notes.trim()) return;
    setBusy("drafting");
    setError(null);
    try {
      const res = await fetch("/api/admin/posts/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const json = await res.json();
      if (json.ok) {
        setTitle(json.data.draft.title);
        setExcerpt(json.data.draft.excerpt);
        setBodyMd(json.data.draft.bodyMd);
      } else {
        setError(json.error);
      }
    } finally {
      setBusy(null);
    }
  }

  async function uploadCover(file: File) {
    setBusy("uploading");
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/posts/cover", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (json.ok) setCoverUrl(json.data.url);
      else setError(json.error);
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    setBusy("saving");
    setError(null);
    try {
      const payload = {
        title,
        excerpt,
        bodyMd,
        ...(coverUrl ? { coverUrl, coverAlt } : {}),
      };
      const res = await fetch(
        post ? `/api/admin/posts/${post.id}` : "/api/admin/posts",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (json.ok) onDone();
      else setError(json.error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 rounded-2xl border border-line p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-mid">
          Draft with AI (optional)
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Paste rough notes or a voice-note transcript — I'll draft the article in your voice."
          className={inputCls}
        />
        <button
          type="button"
          onClick={draftFromNotes}
          disabled={busy !== null || !notes.trim()}
          className="self-start rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-bone disabled:opacity-50"
        >
          {busy === "drafting" ? "Drafting…" : "Draft article"}
        </button>
      </div>

      <label className="flex flex-col gap-2 text-sm text-mid">
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </label>
      <label className="flex flex-col gap-2 text-sm text-mid">
        Excerpt (shows on the listing + search results)
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-mid">
        Body (markdown — ## for headings)
        <textarea
          value={bodyMd}
          onChange={(e) => setBodyMd(e.target.value)}
          rows={16}
          className={`${inputCls} font-mono`}
        />
      </label>
      <div className="flex flex-col gap-2 text-sm text-mid">
        <span>Cover image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadCover(file);
          }}
          className="text-sm"
        />
        {coverUrl && (
          <label className="flex flex-col gap-2">
            Cover description (for accessibility)
            <input
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className={inputCls}
            />
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={busy !== null || !title.trim() || !excerpt.trim() || !bodyMd.trim()}
          className="rounded-full border border-sage bg-sage px-6 py-3 text-sm text-ink transition-colors hover:bg-sage/85 disabled:opacity-50"
        >
          {busy === "saving" ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={busy !== null}
          className="rounded-full border border-line px-6 py-3 text-sm text-bone transition-colors hover:border-bone disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
