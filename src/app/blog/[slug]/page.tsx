import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPost } from "@/lib/blog/serve";
import { renderMarkdown } from "@/lib/blog/render";
import { getContent } from "@/lib/content/serve";
import { buildArticleJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const { site } = await getContent();
  const jsonLd = buildArticleJsonLd(post, site);
  const html = renderMarkdown(post.bodyMd);

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs uppercase tracking-[0.2em] text-mid">
        <Link href="/blog" className="hover:text-bone">
          Journal
        </Link>
        {" · "}
        {formatDate(post.publishedAt)}
      </p>
      <h1 className="mt-4 font-display text-5xl leading-tight text-bone">
        {post.title}
      </h1>
      {post.coverUrl && (
        <div className="relative mt-10 h-72 w-full overflow-hidden rounded-2xl md:h-96">
          <Image
            src={post.coverUrl}
            alt={post.coverAlt ?? ""}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      {/* Rendered from owner-authored markdown with raw HTML escaped (lib/blog/render.ts). */}
      <div
        className="prose-s22 mt-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
