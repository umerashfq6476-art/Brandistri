import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/shared/Section";
import BlogCard, { type BlogCardData } from "@/components/blog/BlogCard";
import { getPublishedPosts } from "@/lib/supabase/helpers";
import type { PostCategory } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the studio on branding, strategy, web, and design.",
};

export const revalidate = 60;

const CATEGORIES: PostCategory[] = [
  "Branding",
  "Strategy",
  "Web",
  "Social",
  "Video",
  "Insights",
  "Case Study",
];

function isPostCategory(value: string | undefined): value is PostCategory {
  return !!value && (CATEGORIES as string[]).includes(value);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const active = isPostCategory(searchParams.category)
    ? searchParams.category
    : null;

  // Fetch the full published feed once; filter + count in memory so the
  // category tabs can show accurate per-category totals.
  const { posts } = await getPublishedPosts({ pageSize: 100 });

  const counts = new Map<string, number>();
  counts.set("all", posts.length);
  for (const c of CATEGORIES) {
    counts.set(c, posts.filter((p) => p.category === c).length);
  }

  const visible = active ? posts.filter((p) => p.category === active) : posts;

  const cards: BlogCardData[] = visible.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    cover_image: p.cover_image,
    category: p.category,
    read_time: p.read_time,
    date: p.published_at ?? p.created_at,
  }));

  return (
    <Section>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary">
        Journal
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold tracking-tight text-text-primary">
        Notes from the studio.
      </h1>

      {/* Category filter tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        <CategoryTab label="All" href="/blog" active={!active} count={counts.get("all") ?? 0} />
        {CATEGORIES.map((c) => (
          <CategoryTab
            key={c}
            label={c}
            href={`/blog?category=${encodeURIComponent(c)}`}
            active={active === c}
            count={counts.get(c) ?? 0}
          />
        ))}
      </div>

      {cards.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-border bg-surface p-12 text-center text-text-secondary">
          {posts.length === 0
            ? "No articles published yet — check back soon."
            : "No articles in this category yet."}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </Section>
  );
}

function CategoryTab({
  label,
  href,
  active,
  count,
}: {
  label: string;
  href: string;
  active: boolean;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-accent-secondary bg-accent-secondary text-background"
          : "border-border bg-surface text-text-primary hover:border-text-primary hover:bg-surface-2",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
          active ? "bg-background/15 text-background" : "bg-background/60 text-text-secondary",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
