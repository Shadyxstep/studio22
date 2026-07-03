"use client";

import { useCallback, useEffect, useState } from "react";
import { PostEditor, type EditablePost } from "./PostEditor";

interface ApiPost extends EditablePost {
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
}

export function PostsManager() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [editing, setEditing] = useState<ApiPost | "new" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/posts");
    const json = await res.json();
    if (json.ok) setPosts(json.data);
    else setNotice(json.error);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function toggleStatus(post: ApiPost) {
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: post.status === "published" ? "draft" : "published",
      }),
    });
    await refresh();
  }

  async function remove(post: ApiPost) {
    if (!window.confirm(`Delete “${post.title}”? This can't be undone.`)) return;
    await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    await refresh();
  }

  if (editing) {
    return (
      <PostEditor
        post={editing === "new" ? null : editing}
        onDone={async () => {
          setEditing(null);
          await refresh();
        }}
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {notice && <p className="text-sm text-red-400">{notice}</p>}
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="self-start rounded-full border border-sage bg-sage px-6 py-3 text-sm text-ink transition-colors hover:bg-sage/85"
      >
        New article
      </button>
      {posts.length === 0 ? (
        <p className="text-sm text-mid">No articles yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-bone">{post.title}</p>
                <p className="text-xs text-mid">
                  {post.status === "published"
                    ? `Published · /blog/${post.slug}`
                    : "Draft"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(post)}
                className="text-sm text-mid hover:text-bone"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(post)}
                className="text-sm text-sage hover:opacity-80"
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => remove(post)}
                className="text-sm text-red-400 hover:opacity-80"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
