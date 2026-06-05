import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Clock } from "lucide-react";
import Section from "@/components/shared/Section";
import { getPostBySlug } from "@/lib/supabase/helpers";

type Params = { slug: string };

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;

  return {
    title,
    description,
    keywords: post.seo_keywords?.length ? post.seo_keywords : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const date = post.published_at ?? post.created_at;

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to journal
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-text-secondary">
          <span className="rounded-full border border-accent-secondary/40 bg-accent-secondary/10 px-3 py-1 text-accent-secondary">
            {post.category}
          </span>
          <span>{format(new Date(date), "MMMM d, yyyy")}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {post.read_time} min read
          </span>
        </div>

        <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-5xl">
          {post.title}
        </h1>

        {post.author_name && (
          <p className="mt-4 text-sm text-text-secondary">By {post.author_name}</p>
        )}

        {post.excerpt && (
          <p className="mt-6 text-xl leading-relaxed text-text-primary/80">
            {post.excerpt}
          </p>
        )}

        {post.cover_image && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div
          className="article-body mt-10"
          // Content is authored in the trusted admin Tiptap editor.
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Section>
  );
}
