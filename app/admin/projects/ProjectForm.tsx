"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  ImagePlus,
  Info,
  Save,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
  Toggle,
} from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { Tabs, type TabItem } from "@/components/admin/ui/Tabs";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageDropzone from "@/components/admin/ImageDropzone";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import { SlugField, TagsInput, MetricsEditor } from "@/components/admin/editors";
import type { ProjectCategory, ProjectRow } from "@/lib/supabase/types";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
  type ProjectFormPayload,
} from "./actions";

const CATEGORIES: ProjectCategory[] = [
  "Brand Identity",
  "Web Design",
  "Social Branding",
  "Video Content",
  "Brand Strategy",
];

type TabValue = "info" | "content" | "images";

const TABS: TabItem<TabValue>[] = [
  { value: "info", label: "Information", icon: <Info className="h-3.5 w-3.5" aria-hidden /> },
  { value: "content", label: "Case Study", icon: <Sparkles className="h-3.5 w-3.5" aria-hidden /> },
  { value: "images", label: "Images", icon: <ImagePlus className="h-3.5 w-3.5" aria-hidden /> },
];

interface ProjectFormProps {
  mode: "new" | "edit";
  initial?: ProjectRow;
}

type FormState = Omit<ProjectFormPayload, "id">;

const EMPTY_INITIAL: FormState = {
  title: "",
  slug: "",
  client: "",
  category: "Brand Identity",
  tags: [],
  year: new Date().getFullYear(),
  accent_color: "#6366f1",
  featured: false,
  published: false,
  description: "",
  challenge: null,
  solution: null,
  results: null,
  metrics: [],
  cover_image: null,
  gallery_images: [],
};

export default function ProjectForm({ mode, initial }: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, startDelete] = useTransition();
  const [tab, setTab] = useState<TabValue>("info");

  const [state, setState] = useState<FormState>(() => {
    if (!initial) return EMPTY_INITIAL;
    return {
      title: initial.title,
      slug: initial.slug,
      client: initial.client,
      category: initial.category,
      tags: initial.tags,
      year: initial.year,
      accent_color: initial.accent_color,
      featured: initial.featured,
      published: initial.published,
      description: initial.description,
      challenge: initial.challenge,
      solution: initial.solution,
      results: initial.results,
      metrics: initial.metrics,
      cover_image: initial.cover_image,
      gallery_images: initial.gallery_images,
    };
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  // Lightweight inline validation so we can surface field errors + jump tabs.
  function firstError(): { tab: TabValue; message: string } | null {
    if (!state.title.trim()) return { tab: "info", message: "Project title is required." };
    if (!state.client.trim()) return { tab: "info", message: "Client name is required." };
    if (state.year < 2000 || state.year > 2100)
      return { tab: "info", message: "Year must be between 2000 and 2100." };
    if (!state.description.trim())
      return { tab: "content", message: "A short description is required." };
    return null;
  }

  function submit(publishOverride?: boolean) {
    const invalid = firstError();
    if (invalid) {
      setTab(invalid.tab);
      toast.error(invalid.message);
      return;
    }

    startTransition(async () => {
      const payload: ProjectFormPayload = {
        ...state,
        id: initial?.id,
        published: publishOverride ?? state.published,
      };

      if (mode === "new") {
        const result = await createProjectAction(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message ?? "Saved.");
        if (publishOverride !== undefined) set("published", publishOverride);
        if (result.data?.id) {
          router.replace(`/admin/projects/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
        return;
      }

      const result = await updateProjectAction(payload);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved.");
      if (publishOverride !== undefined) set("published", publishOverride);
      if (result.data?.slug && result.data.slug !== state.slug) {
        set("slug", result.data.slug);
      }
      router.refresh();
    });
  }

  function handleDelete() {
    if (!initial?.id) return;
    startDelete(async () => {
      const result = await deleteProjectAction(initial.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Deleted.");
      router.replace("/admin/projects");
    });
  }

  const previewHref = initial ? `/work/${state.slug}` : null;
  // Images can only attach to an existing row (stable slug for storage paths).
  const canUploadImages = mode === "edit";

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All projects
          </Link>
          <span className="text-xs text-text-muted">·</span>
          <h1 className="font-display text-lg font-semibold tracking-tight">
            {mode === "new" ? "New project" : "Edit project"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {previewHref && (
            <Link
              href={previewHref}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Preview
              <ExternalLink className="h-3 w-3" aria-hidden />
            </Link>
          )}
          {mode === "edit" && (
            <Button
              variant="danger"
              size="md"
              onClick={() => setPendingDelete(true)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
            >
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="md"
            onClick={() => submit(false)}
            loading={pending}
            leftIcon={<Save className="h-3.5 w-3.5" aria-hidden />}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => submit(true)}
            loading={pending}
            leftIcon={<Send className="h-3.5 w-3.5" aria-hidden />}
          >
            {state.published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs items={TABS} value={tab} onChange={setTab} />

      {/* TAB 1 — Information */}
      {tab === "info" && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5 rounded-2xl border border-border bg-surface p-5">
            <Field label="Project title" required>
              <Input
                value={state.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Helio — Brand Identity System"
                className="font-display text-xl"
                autoFocus
              />
            </Field>

            <SlugField
              title={state.title}
              slug={state.slug}
              onSlugChange={(s) => set("slug", s)}
              basePath="/work/"
              manuallyEdited={slugManuallyEdited}
              onManualEditChange={setSlugManuallyEdited}
              required
            />

            <Field label="Client" required>
              <Input
                value={state.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="Client or company name"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <Select
                  value={state.category}
                  onChange={(e) =>
                    set("category", e.target.value as ProjectCategory)
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Year">
                <Input
                  type="number"
                  min={2000}
                  max={2100}
                  value={state.year}
                  onChange={(e) =>
                    set("year", Number(e.target.value) || new Date().getFullYear())
                  }
                />
              </Field>
            </div>

            <Field label="Tags" hint="Press Enter or comma to add a tag.">
              <TagsInput
                value={state.tags}
                onChange={(t) => set("tags", t)}
                placeholder="logo, identity, packaging, …"
              />
            </Field>
          </div>

          <div className="space-y-5">
            <SettingsSection title="Visibility">
              <Toggle
                checked={state.published}
                onChange={(v) => set("published", v)}
                label={state.published ? "Published" : "Draft"}
                description={
                  state.published
                    ? initial?.published_at
                      ? `First published ${new Date(initial.published_at).toLocaleDateString()}`
                      : "Will publish on save"
                    : "Not visible on the public site"
                }
              />
              <Toggle
                checked={state.featured}
                onChange={(v) => set("featured", v)}
                label="Featured"
                description="Highlight on the homepage & work index"
              />
            </SettingsSection>

            <SettingsSection title="Card accent color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label="Accent color"
                  value={state.accent_color}
                  onChange={(e) => set("accent_color", e.target.value.toLowerCase())}
                  className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-border bg-background"
                />
                <Input
                  value={state.accent_color}
                  onChange={(e) => set("accent_color", e.target.value.toLowerCase())}
                  placeholder="#6366f1"
                  aria-label="Accent color hex"
                  className="font-mono"
                />
              </div>
              <p className="text-xs text-text-muted">
                Used as the project&apos;s tint on cards and the case study hero.
              </p>
            </SettingsSection>
          </div>
        </div>
      )}

      {/* TAB 2 — Case study content */}
      {tab === "content" && (
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-5">
          <Field
            label="Short description"
            required
            hint="Shown in portfolio listings and the project intro."
            trailing={`${state.description.length} chars`}
          >
            <Textarea
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="One or two sentences summarising the project."
              rows={3}
            />
          </Field>

          <Field label="The Challenge">
            <RichTextEditor
              value={state.challenge ?? ""}
              onChange={(html) => set("challenge", html || null)}
              placeholder="What problem was the client facing?"
            />
          </Field>

          <Field label="Our Strategy & Solution">
            <RichTextEditor
              value={state.solution ?? ""}
              onChange={(html) => set("solution", html || null)}
              placeholder="How did we approach and solve it?"
            />
          </Field>

          <Field label="Project Results">
            <Textarea
              value={state.results ?? ""}
              onChange={(e) => set("results", e.target.value || null)}
              placeholder="Summarise the outcomes and impact."
              rows={4}
            />
          </Field>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
              Result metrics
            </h3>
            <p className="mb-3 mt-1 text-xs text-text-muted">
              Each metric has a value and a label — e.g. value{" "}
              <span className="text-text-secondary">“80% increase”</span>, label{" "}
              <span className="text-text-secondary">“Brand Recognition”</span>.
            </p>
            <MetricsEditor
              value={state.metrics}
              onChange={(m) => set("metrics", m)}
            />
          </div>
        </div>
      )}

      {/* TAB 3 — Images */}
      {tab === "images" && (
        <div className="space-y-6">
          {!canUploadImages && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
              Save the project as a draft first — images upload against the
              saved project, so this unlocks once it exists.
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
              Cover image
            </h3>
            <p className="text-xs text-text-muted">
              Primary image shown in portfolio listings and the case study hero.
            </p>
            <div className={canUploadImages ? "" : "pointer-events-none opacity-50"}>
              <ImageDropzone
                bucket="project-images"
                pathPrefix={`${state.slug || "drafts"}/cover`}
                value={state.cover_image}
                onChange={(url) => set("cover_image", url)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
              Project gallery
            </h3>
            <p className="text-xs text-text-muted">
              Upload multiple images, drag to reorder, and remove individually.
            </p>
            <div className={canUploadImages ? "" : "pointer-events-none opacity-50"}>
              <MultiImageUploader
                bucket="project-images"
                pathPrefix={`${state.slug || "drafts"}/gallery`}
                value={state.gallery_images}
                onChange={(urls) => set("gallery_images", urls)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete}
        onCancel={() => setPendingDelete(false)}
        onConfirm={handleDelete}
        title="Delete this project?"
        description="This action cannot be undone."
        confirmLabel="Delete project"
        loading={deleting}
      />
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
