"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  Briefcase,
  Edit3,
  ExternalLink,
  LayoutGrid,
  PlusCircle,
  Search,
  Star,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import { Badge, Input, Select } from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { deleteProjectAction } from "./actions";

export interface ProjectRowSummary {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  cover_image: string | null;
  accent_color: string;
  featured: boolean;
  published: boolean;
  year: number;
  created_at: string;
}

type ViewMode = "grid" | "table";
type SortKey = "date_desc" | "date_asc" | "client_asc" | "title_asc";

const CATEGORIES = [
  "All categories",
  "Brand Identity",
  "Web Design",
  "Social Branding",
  "Video Content",
  "Brand Strategy",
];

interface ProjectsManagerProps {
  initialProjects: ProjectRowSummary[];
}

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState<SortKey>("date_desc");
  const [view, setView] = useState<ViewMode>("grid");

  const [pendingDelete, setPendingDelete] = useState<ProjectRowSummary | null>(null);
  const [deleting, startDelete] = useTransition();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.client.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (category !== "All categories" && p.category !== category) return false;
      return true;
    });

    list.sort((a, b) => {
      switch (sort) {
        case "date_asc":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "client_asc":
          return a.client.localeCompare(b.client);
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "date_desc":
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });

    return list;
  }, [projects, search, category, sort]);

  function handleDelete(project: ProjectRowSummary) {
    startDelete(async () => {
      const result = await deleteProjectAction(project.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Project deleted.");
      // Optimistically drop the row, then refresh the server tree.
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setPendingDelete(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          {filtered.length} of {projects.length} projects
        </p>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          Add Project
        </Link>
      </div>

      {/* Filters + view toggle */}
      <div className="grid gap-2 rounded-2xl border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or client…"
            className="pl-9"
            aria-label="Search projects"
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
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort projects"
        >
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="client_asc">Client A → Z</option>
          <option value="title_asc">Title A → Z</option>
        </Select>
        <div
          role="group"
          aria-label="View mode"
          className="flex items-center gap-1 rounded-lg border border-border bg-background p-1"
        >
          <ViewToggle
            active={view === "grid"}
            onClick={() => setView("grid")}
            label="Grid view"
            icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
          />
          <ViewToggle
            active={view === "table"}
            onClick={() => setView("table")}
            label="Table view"
            icon={<TableIcon className="h-4 w-4" aria-hidden />}
          />
        </div>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-text-secondary">
            No projects match the current filters.
          </p>
        </div>
      ) : view === "grid" ? (
        <GridView projects={filtered} onDelete={setPendingDelete} />
      ) : (
        <TableView projects={filtered} onDelete={setPendingDelete} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        title="Delete this project?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” will be permanently removed from the portfolio.`
            : undefined
        }
        confirmLabel="Delete project"
        loading={deleting}
      />
    </div>
  );
}

/* ─── Grid view ─────────────────────────────────────────────────────────── */

function GridView({
  projects,
  onDelete,
}: {
  projects: ProjectRowSummary[];
  onDelete: (p: ProjectRowSummary) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-accent-primary/40"
        >
          {/* Cover */}
          <div className="relative aspect-[16/10] overflow-hidden bg-background">
            {project.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.cover_image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{
                  background: `linear-gradient(135deg, ${project.accent_color}22, transparent)`,
                }}
              >
                <Briefcase className="h-6 w-6 text-text-muted" aria-hidden />
              </div>
            )}
            <div className="absolute left-3 top-3 flex gap-1.5">
              {project.published ? (
                <Badge tone="success">Published</Badge>
              ) : (
                <Badge tone="warning">Draft</Badge>
              )}
              {project.featured && (
                <Badge tone="info">
                  <Star className="h-2.5 w-2.5" aria-hidden /> Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: project.accent_color }}
              />
              <p className="truncate font-display text-base font-semibold tracking-tight">
                {project.title}
              </p>
            </div>
            <p className="mt-1 truncate text-xs text-text-muted">
              {project.client} · {project.category} · {project.year}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
              >
                <Edit3 className="h-3.5 w-3.5" aria-hidden />
                Edit
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href={`/work/${project.slug}`}
                  target="_blank"
                  aria-label="Preview on site"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  aria-label="Delete project"
                  className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-red-500/40 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Table view ────────────────────────────────────────────────────────── */

function TableView({
  projects,
  onDelete,
}: {
  projects: ProjectRowSummary[];
  onDelete: (p: ProjectRowSummary) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-[10px] uppercase tracking-[0.14em] text-text-muted">
            <tr>
              <th className="w-20 px-4 py-3">Cover</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Added</th>
              <th className="w-1 px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id} className="transition">
                <td className="px-4 py-3">
                  <div className="h-10 w-16 overflow-hidden rounded-md border border-border bg-background">
                    {project.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.cover_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-text-muted">
                        <Briefcase className="h-4 w-4" aria-hidden />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex items-center gap-2 font-medium text-text-primary hover:underline"
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: project.accent_color }}
                    />
                    <span className="max-w-[260px] truncate">
                      {project.title}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-secondary">{project.client}</td>
                <td className="px-4 py-3">
                  <Badge tone="info">{project.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  {project.published ? (
                    <Badge tone="success">Published</Badge>
                  ) : (
                    <Badge tone="warning">Draft</Badge>
                  )}
                  {project.featured && (
                    <Badge tone="muted" className="ml-1.5">
                      Featured
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">
                  {format(new Date(project.created_at), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/work/${project.slug}`}
                      target="_blank"
                      aria-label="Preview on site"
                      className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      aria-label="Edit project"
                      className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                    >
                      <Edit3 className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete project"
                      onClick={() => onDelete(project)}
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
    </div>
  );
}

/* ─── Small pieces ──────────────────────────────────────────────────────── */

function ViewToggle({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md transition",
        active
          ? "bg-accent-primary/15 text-accent-primary"
          : "text-text-muted hover:text-text-primary",
      )}
    >
      {icon}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
        <Briefcase className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
        No projects yet
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Add your first case study to populate the portfolio on the public site.
      </p>
      <Link
        href="/admin/projects/new"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
      >
        <PlusCircle className="h-4 w-4" aria-hidden />
        Add your first project
      </Link>
    </div>
  );
}
