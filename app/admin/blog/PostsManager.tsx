"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  FileText,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { Badge, Button, Input, Select } from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import {
  bulkDeletePostsAction,
  deletePostAction,
} from "./actions";

export interface PostRowSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  published_at: string | null;
}

type StatusFilter = "all" | "published" | "draft";
type SortKey = "date_desc" | "date_asc" | "title_asc" | "status";

const PAGE_SIZE = 10;

const CATEGORIES = [
  "All categories",
  "Branding",
  "Strategy",
  "Web",
  "Social",
  "Video",
  "Insights",
  "Case Study",
];

interface PostsManagerProps {
  initialPosts: PostRowSummary[];
}

export default function PostsManager({ initialPosts }: PostsManagerProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);
  const [deleting, startDelete] = useTransition();
  const [bulkDeleting, startBulkDelete] = useTransition();

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = posts.filter((post) => {
      if (q && !post.title.toLowerCase().includes(q)) return false;
      if (category !== "All categories" && post.category !== category) {
        return false;
      }
      if (status === "published" && !post.published) return false;
      if (status === "draft" && post.published) return false;
      return true;
    });

    list.sort((a, b) => {
      switch (sort) {
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "date_asc":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "status":
          return Number(b.published) - Number(a.published);
        case "date_desc":
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });

    return list;
  }, [posts, search, category, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPosts = filteredSorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Reset to page 1 whenever filters change.
  useMemoizedReset(() => setPage(1), [search, category, status, sort]);

  const pageIds = pagedPosts.map((p) => p.id);
  const allSelectedOnPage =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function toggleAllOnPage() {
    const next = new Set(selected);
    if (allSelectedOnPage) {
      pageIds.forEach((id) => next.delete(id));
    } else {
      pageIds.forEach((id) => next.add(id));
    }
    setSelected(next);
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const result = await deletePostAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Post deleted.");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setPendingDelete(null);
      router.refresh();
    });
  }

  function handleBulkDelete() {
    const ids = Array.from(selected);
    startBulkDelete(async () => {
      const result = await bulkDeletePostsAction(ids);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Posts deleted.");
      setPosts((prev) => prev.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
      setPendingBulkDelete(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-text-muted">
            {filteredSorted.length} of {posts.length} posts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="grid gap-2 rounded-2xl border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="pl-9"
            aria-label="Search posts"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="published">Published only</option>
          <option value="draft">Drafts only</option>
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort posts"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="title_asc">Title A → Z</option>
          <option value="status">By status</option>
        </Select>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-accent-primary/40 bg-accent-primary/5 px-4 py-3">
          <p className="text-sm text-text-primary">
            <strong>{selected.size}</strong> post{selected.size === 1 ? "" : "s"} selected
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setPendingBulkDelete(true)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
            >
              Delete selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {posts.length === 0 ? (
        <EmptyState />
      ) : pagedPosts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-text-secondary">
            No posts match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-background text-[10px] uppercase tracking-[0.14em] text-text-muted">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelectedOnPage}
                      onChange={toggleAllOnPage}
                      aria-label="Select all on this page"
                      className="h-3.5 w-3.5 cursor-pointer accent-accent-primary"
                    />
                  </th>
                  <th className="w-20 px-4 py-3">Cover</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="w-1 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedPosts.map((post) => (
                  <tr
                    key={post.id}
                    className={cn(
                      "transition",
                      selected.has(post.id) && "bg-accent-primary/5",
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(post.id)}
                        onChange={() => toggleOne(post.id)}
                        aria-label={`Select ${post.title}`}
                        className="h-3.5 w-3.5 cursor-pointer accent-accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-10 w-16 overflow-hidden rounded-md border border-border bg-background">
                        {post.cover_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.cover_image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-text-muted">
                            <FileText className="h-4 w-4" aria-hidden />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="block max-w-[420px] truncate font-medium text-text-primary hover:underline"
                      >
                        {post.title || "Untitled"}
                      </Link>
                      {post.excerpt && (
                        <p className="mt-0.5 max-w-[420px] truncate text-xs text-text-muted">
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="info">{post.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <Badge tone="success">Published</Badge>
                      ) : (
                        <Badge tone="warning">Draft</Badge>
                      )}
                      {post.featured && (
                        <Badge tone="muted" className="ml-1.5">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          aria-label="Preview on site"
                          className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          aria-label="Edit post"
                          className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                        <button
                          type="button"
                          aria-label="Delete post"
                          onClick={() => setPendingDelete(post.id)}
                          className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-red-500/40 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3 text-xs text-text-secondary">
              <p>
                Page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Previous page"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  aria-label="Next page"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        title="Delete this post?"
        description="The post will be permanently removed. Drafts cannot be recovered."
        confirmLabel="Delete post"
        loading={deleting}
      />
      <ConfirmDialog
        open={pendingBulkDelete}
        onCancel={() => setPendingBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selected.size} post${selected.size === 1 ? "" : "s"}?`}
        description="The selected posts will be permanently removed."
        confirmLabel="Delete posts"
        loading={bulkDeleting}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
        <FileText className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
        No blog posts yet
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Write the first post to fill the blog index on the public site.
      </p>
      <Link
        href="/admin/blog/new"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
      >
        <PlusCircle className="h-4 w-4" aria-hidden />
        Write your first post
      </Link>
    </div>
  );
}

/**
 * Small effect-like hook that fires `fn` once whenever any value in `deps`
 * changes — used to reset the page index when the filters change without
 * accidentally running on mount.
 */
function useMemoizedReset(fn: () => void, deps: ReadonlyArray<unknown>) {
  useMemo(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
