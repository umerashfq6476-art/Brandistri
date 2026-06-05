import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Edit3,
  FileText,
  Inbox,
  Mail,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import MarkAsReadButton from "@/components/admin/MarkAsReadButton";

export const dynamic = "force-dynamic";

interface DashboardData {
  stats: {
    posts: { total: number; published: number; drafts: number };
    projects: { total: number; featured: number };
    messages: { unread: number; total: number };
    services: { active: number };
  };
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    service_type: string | null;
    budget: string | null;
    received_at: string;
    read: boolean;
  }>;
  recentPosts: Array<{
    id: string;
    slug: string;
    title: string;
    published: boolean;
    published_at: string | null;
    created_at: string;
  }>;
  recentProjects: Array<{
    id: string;
    slug: string;
    title: string;
    client: string;
    category: string;
    created_at: string;
  }>;
}

async function loadDashboard(): Promise<DashboardData> {
  const supabase = getSupabaseServerClient();

  // Fire every query in parallel — total wall time is the slowest one.
  const [
    postsCount,
    publishedPosts,
    projectsCount,
    featuredProjects,
    unreadMessages,
    totalMessages,
    activeServices,
    recentMessages,
    recentPosts,
    recentProjects,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("featured", true),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false)
      .eq("archived", false),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("messages")
      .select("id, name, email, service_type, budget, received_at, read")
      .order("received_at", { ascending: false })
      .limit(5),
    supabase
      .from("posts")
      .select("id, slug, title, published, published_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("projects")
      .select("id, slug, title, client, category, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const totalPosts = postsCount.count ?? 0;
  const publishedPostsCount = publishedPosts.count ?? 0;

  return {
    stats: {
      posts: {
        total: totalPosts,
        published: publishedPostsCount,
        drafts: Math.max(0, totalPosts - publishedPostsCount),
      },
      projects: {
        total: projectsCount.count ?? 0,
        featured: featuredProjects.count ?? 0,
      },
      messages: {
        unread: unreadMessages.count ?? 0,
        total: totalMessages.count ?? 0,
      },
      services: {
        active: activeServices.count ?? 0,
      },
    },
    recentMessages: recentMessages.data ?? [],
    recentPosts: recentPosts.data ?? [],
    recentProjects: recentProjects.data ?? [],
  };
}

export default async function AdminDashboardPage() {
  const { stats, recentMessages, recentPosts, recentProjects } = await loadDashboard();

  return (
    <div className="space-y-10">
      {/* Stats row */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            index={0}
            icon="FileText"
            prefix="Content"
            label="Blog Posts"
            value={stats.posts.total}
            detail={`${stats.posts.published} published · ${stats.posts.drafts} draft${stats.posts.drafts === 1 ? "" : "s"}`}
          />
          <StatCard
            index={1}
            icon="Briefcase"
            prefix="Portfolio"
            label="Projects"
            value={stats.projects.total}
            detail={`${stats.projects.featured} featured`}
          />
          <StatCard
            index={2}
            icon="Mail"
            prefix="Inbox"
            label="Unread Messages"
            value={stats.messages.unread}
            detail={`${stats.messages.total} total received`}
            accent
          />
          <StatCard
            index={3}
            icon="Sparkles"
            prefix="Offerings"
            label="Active Services"
            value={stats.services.active}
            detail="Visible on the public site"
          />
        </div>
      </section>

      {/* Two-column block: messages + quick actions */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Recent messages */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Recent messages
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Latest contact form submissions
              </p>
            </div>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </header>

          {recentMessages.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No messages yet"
              description="Submissions from the contact form will appear here."
            />
          ) : (
            <ul className="divide-y divide-border">
              {recentMessages.map((message) => (
                <li
                  key={message.id}
                  className={
                    !message.read
                      ? "bg-accent-secondary/[0.04]"
                      : undefined
                  }
                >
                  <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <span
                            aria-hidden
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary"
                          />
                        )}
                        <p className="truncate text-sm font-medium text-text-primary">
                          {message.name}
                        </p>
                        <span className="hidden text-text-muted sm:inline">·</span>
                        <p className="hidden truncate text-xs text-text-muted sm:block">
                          {message.email}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary">
                        {[
                          message.service_type ?? "General inquiry",
                          message.budget ?? null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-text-muted">
                        {formatDistanceToNow(new Date(message.received_at), {
                          addSuffix: true,
                        })}
                      </span>
                      {!message.read && (
                        <MarkAsReadButton messageId={message.id} />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <aside className="rounded-2xl border border-border bg-surface">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Quick actions
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Jump straight into the work
            </p>
          </header>
          <div className="space-y-2 p-4">
            <QuickAction
              href="/admin/blog/new"
              label="Write New Blog Post"
              icon={PlusCircle}
            />
            <QuickAction
              href="/admin/projects/new"
              label="Add New Project"
              icon={PlusCircle}
            />
            <QuickAction
              href="/admin/services"
              label="Edit Services"
              icon={Edit3}
            />
            <QuickAction
              href="/admin/messages"
              label="View All Messages"
              icon={Mail}
            />
          </div>
        </aside>
      </section>

      {/* Recent activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="rounded-2xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Recent blog posts
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Latest 5 articles
              </p>
            </div>
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
            >
              All posts
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </header>
          {recentPosts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description="Drafts and published articles will show up here."
              action={{ label: "Write your first post", href: "/admin/blog/new" }}
            />
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="group flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-surface-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary group-hover:text-white">
                        {post.title || "Untitled draft"}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {post.published ? (
                          <span className="text-accent-secondary">Published</span>
                        ) : (
                          <span className="text-text-secondary">Draft</span>
                        )}{" "}
                        ·{" "}
                        {formatDistanceToNow(
                          new Date(post.published_at ?? post.created_at),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted transition group-hover:text-text-primary">
                      <Edit3 className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent projects */}
        <div className="rounded-2xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Recent projects
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Last 3 added
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
            >
              All projects
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </header>
          {recentProjects.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No projects yet"
              description="Portfolio case studies will appear here as you add them."
              action={{ label: "Add your first project", href: "/admin/projects/new" }}
            />
          ) : (
            <ul className="divide-y divide-border">
              {recentProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="group flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-surface-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary group-hover:text-white">
                        {project.title}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {project.client} · {project.category} ·{" "}
                        {formatDistanceToNow(new Date(project.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted transition group-hover:text-text-primary">
                      <Edit3 className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/* ─── Small inline pieces ───────────────────────────────────────────────── */

interface QuickActionProps {
  href: string;
  label: string;
  icon: typeof PlusCircle;
}

function QuickAction({ href, label, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary transition hover:border-accent-primary/40 hover:bg-surface-2 hover:text-text-primary"
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-text-muted group-hover:text-accent-primary" aria-hidden />
        {label}
      </span>
      <ArrowRight
        className="h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary"
        aria-hidden
      />
    </Link>
  );
}

interface EmptyStateProps {
  icon: typeof FileText;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-4 text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-text-muted">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-accent-primary/90"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
