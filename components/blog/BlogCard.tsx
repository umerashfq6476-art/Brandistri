import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Clock, FileText } from "lucide-react";

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  read_time: number;
  date: string; // ISO timestamp
}

export default function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent-primary/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-text-muted">
            <FileText className="h-6 w-6" aria-hidden />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-primary backdrop-blur">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-text-secondary">
          <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {post.read_time} min read
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-text-primary transition-colors group-hover:text-accent-secondary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {post.excerpt}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary transition-colors group-hover:text-accent-secondary">
          Read article
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
