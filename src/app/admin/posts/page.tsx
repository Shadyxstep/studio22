import type { Metadata } from "next";
import Link from "next/link";
import { PostsManager } from "./PostsManager";

export const metadata: Metadata = {
  title: "Articles",
  robots: { index: false },
};

export default function AdminPostsPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col gap-10 px-6 py-24">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mid">Studio 22</p>
          <h1 className="mt-2 font-display text-4xl text-bone">Articles</h1>
        </div>
        <Link href="/admin" className="text-sm text-mid hover:text-bone">
          ← Admin
        </Link>
      </div>
      <PostsManager />
    </main>
  );
}
