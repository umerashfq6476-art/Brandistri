"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { Button, Field, Input, Select, Textarea, Toggle } from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { SlugField, TagsInput } from "@/components/admin/editors";
import type { PostCategory, PostRow } from "@/lib/supabase/types";
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
  type PostFormPayload,
} from "./actions";

const CATEGORIES: PostCategory[] = [
  "Branding",
  "Strategy",
  "Web",
  "Social",
  "Video",
  "Insights",
  "Case Study",
];

interface PostFormProps {
  mode: "new" | "edit";
  initial?: PostRow;
}

const EMPTY_INITIAL: Omit<PostFormPayload, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null,
  category: "Insights",
  tags: [],
  read_time: 5,
  featured: false,
  published: false,
  seo_title: null,
  seo_description: null,
  seo_keywords: [],
  author_name: null,
};

export default function PostForm({ mode, initial }: PostFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, startDelete] = useTransition();

  const [state, setState] = useState<Omit<PostFormPayload, "id">>(() => {
    if (!initial) return EMPTY_INITIAL;
    return {
      title: initial.title,
      slug: initial.slug,
      excerpt: initial.excerpt ?? "",
      content: initial.content,
      cover_image: initial.cover_image,
      category: initial.category,
      tags: initial.tags,
      read_time: initial.read_time,
      featured: initial.featured,
      published: initial.published,
      seo_title: initial.seo_title,
      seo_description: initial.seo_description,
      seo_keywords: initial.seo_keywords,
      author_name: initial.author_name,
    };
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  function set<K extends keyof typeof state>(key: K, value: (typeof state)[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function submit(publishOverride?: boolean) {
    startTransition(async () => {
      const payload: PostFormPayload = {
        ...state,
        id: initial?.id,
        published: publishOverride ?? state.published,
      };

      if (mode === "new") {
        const result = await createPostAction(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message ?? "Saved.");
        if (publishOverride !== undefined) set("published", publishOverride);
        if (result.data?.id) {
          router.replace(`/admin/blog/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
        return;
      }

      const result = await updatePostAction(payload);
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
      const result = await deletePostAction(initial.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Deleted.");
      router.replace("/admin/blog");
    });
  }

  const seoTitleLen = (state.seo_title ?? "").length;
  const seoDescLen = (state.seo_description ?? "").length;
  const previewHref = initial ? `/blog/${state.slug}` : null;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All posts
          </Link>
          <span className="text-xs text-text-muted">·</span>
          <h1 className="font-display text-lg font-semibold tracking-tight">
            {mode === "new" ? "New post" : "Edit post"}
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

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main column */}
        <div className="space-y-5">
          <Field label="Title" required>
            <Input
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Headline for the post"
              className="font-display text-xl"
              autoFocus
            />
          </Field>

          <SlugField
            title={state.title}
            slug={state.slug}
            onSlugChange={(s) => set("slug", s)}
            manuallyEdited={slugManuallyEdited}
            onManualEditChange={setSlugManuallyEdited}
            required
          />

          <Field label="Content" required>
            <RichTextEditor
              value={state.content}
              onChange={(html) => set("content", html)}
              placeholder="Tell the story…"
            />
          </Field>

          <Field
            label="Excerpt"
            hint="Shown in blog listings and meta description fallback."
            trailing={`${(state.excerpt ?? "").length} chars`}
          >
            <Textarea
              value={state.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="One or two sentences summarising the post."
              rows={3}
            />
          </Field>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-5">
          <SettingsSection title="Publishing">
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
              description="Highlight on the blog index"
            />
          </SettingsSection>

          <SettingsSection title="Taxonomy">
            <Field label="Category">
              <Select
                value={state.category}
                onChange={(e) => set("category", e.target.value as PostCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tags" hint="Press Enter or comma to add a tag.">
              <TagsInput
                value={state.tags}
                onChange={(t) => set("tags", t)}
                placeholder="branding, strategy, …"
              />
            </Field>
            <Field label="Read time">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={state.read_time}
                  onChange={(e) =>
                    set("read_time", Math.max(1, Number(e.target.value) || 1))
                  }
                  className="max-w-[120px]"
                />
                <span className="text-xs text-text-muted">min read</span>
              </div>
            </Field>
            <Field label="Author name (optional)">
              <Input
                value={state.author_name ?? ""}
                onChange={(e) => set("author_name", e.target.value || null)}
                placeholder="Studio default if blank"
              />
            </Field>
          </SettingsSection>

          <SettingsSection title="Cover image">
            <ImageDropzone
              bucket="blog-covers"
              pathPrefix={state.slug || "drafts"}
              value={state.cover_image}
              onChange={(url) => set("cover_image", url)}
            />
          </SettingsSection>

          <SettingsSection title="SEO">
            <Field
              label="Meta title"
              trailing={`${seoTitleLen} / 60`}
              hint={seoTitleLen > 60 ? "Slightly long — Google truncates around 60 characters." : undefined}
            >
              <Input
                value={state.seo_title ?? ""}
                onChange={(e) => set("seo_title", e.target.value || null)}
                placeholder="Falls back to the post title"
                maxLength={120}
              />
            </Field>
            <Field
              label="Meta description"
              trailing={`${seoDescLen} / 160`}
              hint={seoDescLen > 160 ? "Description may be truncated in search results." : undefined}
            >
              <Textarea
                value={state.seo_description ?? ""}
                onChange={(e) => set("seo_description", e.target.value || null)}
                placeholder="Falls back to the excerpt"
                rows={3}
                maxLength={250}
              />
            </Field>
            <Field label="Meta keywords" hint="Optional · comma-separated">
              <TagsInput
                value={state.seo_keywords}
                onChange={(k) => set("seo_keywords", k)}
                placeholder="modern branding, agency, …"
              />
            </Field>
          </SettingsSection>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete}
        onCancel={() => setPendingDelete(false)}
        onConfirm={handleDelete}
        title="Delete this post?"
        description="This action cannot be undone."
        confirmLabel="Delete post"
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
