import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog/serve";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Training philosophy from Studio 22 — how we think about strength, movement and performance.",
};

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-mid">Journal</p>
        <h1 className="mt-3 font-display text-5xl text-bone">
          Notes on training well
        </h1>
      </header>
      {posts.length === 0 ? (
        <p className="text-mid">
          Articles are on the way — check back soon.
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-6 md:flex-row md:items-center"
              >
                {post.coverUrl && (
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl md:w-72 shrink-0">
                    <Image
                      src={post.coverUrl}
                      alt={post.coverAlt ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-mid">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-bone transition-colors group-hover:text-sage">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-mid">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
