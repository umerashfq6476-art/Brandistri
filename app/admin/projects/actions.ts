"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseRouteClient } from "@/lib/supabase/server";
import { generateUniqueSlug, slugify } from "@/lib/supabase/helpers";
import type {
  ProjectCategory,
  ProjectInsert,
  ProjectMetric,
  ProjectUpdate,
} from "@/lib/supabase/types";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };

/**
 * Everything the project editor sends to the server. Mirrors the three editor
 * tabs (Info · Case Study · Images). Fields not surfaced in the UI
 * (testimonial, services, duration, display_order) keep their DB defaults on
 * insert and are left untouched on update.
 */
export interface ProjectFormPayload {
  id?: string;
  // Tab 1 — Information
  title: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  tags: string[];
  year: number;
  accent_color: string;
  featured: boolean;
  published: boolean;
  // Tab 2 — Case study content
  description: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: ProjectMetric[];
  // Tab 3 — Images
  cover_image: string | null;
  gallery_images: string[];
}

const HEX_RE = /^#[0-9a-f]{6}$/;

function normalizeAccent(input: string): string {
  const v = (input || "").trim().toLowerCase();
  return HEX_RE.test(v) ? v : "#6366f1";
}

function cleanMetrics(metrics: ProjectMetric[]): ProjectMetric[] {
  // Drop fully-blank metric cards so we never persist empty rows.
  return (metrics ?? [])
    .map((m) => ({
      value: (m.value ?? "").trim(),
      label: (m.label ?? "").trim(),
      description: (m.description ?? "").trim(),
    }))
    .filter((m) => m.value || m.label || m.description);
}

function validate(payload: ProjectFormPayload): string | null {
  if (!payload.title.trim()) return "Project title is required.";
  if (!payload.client.trim()) return "Client name is required.";
  if (!payload.description.trim()) return "A short description is required.";
  if (
    !Number.isInteger(payload.year) ||
    payload.year < 2000 ||
    payload.year > 2100
  ) {
    return "Year must be between 2000 and 2100.";
  }
  return null;
}

/**
 * Create a new portfolio project. Returns the new id so the caller can move
 * to the edit page (where images can then be uploaded against a stable slug).
 */
export async function createProjectAction(
  payload: ProjectFormPayload,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const error = validate(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const desiredSlug = payload.slug.trim() || slugify(payload.title);
  const slug = await generateUniqueSlug(desiredSlug, { table: "projects" });

  const insert: ProjectInsert = {
    slug,
    title: payload.title.trim(),
    client: payload.client.trim(),
    category: payload.category,
    tags: payload.tags,
    description: payload.description.trim(),
    challenge: payload.challenge?.trim() || null,
    solution: payload.solution?.trim() || null,
    results: payload.results?.trim() || null,
    metrics: cleanMetrics(payload.metrics),
    cover_image: payload.cover_image,
    gallery_images: payload.gallery_images,
    accent_color: normalizeAccent(payload.accent_color),
    year: payload.year,
    featured: payload.featured,
    published: payload.published,
    published_at: payload.published ? new Date().toISOString() : null,
  };

  const { data, error: insertError } = await supabase
    .from("projects")
    .insert(insert)
    .select("id, slug")
    .single();

  if (insertError || !data) {
    return {
      ok: false,
      error: insertError?.message ?? "Failed to create project.",
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/work");
  return {
    ok: true,
    data: { id: data.id, slug: data.slug },
    message: payload.published ? "Project published." : "Draft saved.",
  };
}

/**
 * Update an existing project. Re-slugs only when the slug actually changed,
 * and stamps published_at the first time the project goes live.
 */
export async function updateProjectAction(
  payload: ProjectFormPayload,
): Promise<ActionResult<{ slug: string }>> {
  if (!payload.id) return { ok: false, error: "Missing project id." };
  const error = validate(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const existing = await supabase
    .from("projects")
    .select("slug, published_at")
    .eq("id", payload.id)
    .maybeSingle();

  if (existing.error || !existing.data) {
    return { ok: false, error: "Project not found." };
  }

  const normalizedSlug = slugify(payload.slug || payload.title);
  const slug =
    normalizedSlug === existing.data.slug
      ? existing.data.slug
      : await generateUniqueSlug(normalizedSlug, {
          table: "projects",
          ignoreId: payload.id,
        });

  let publishedAt = existing.data.published_at;
  if (payload.published && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const update: ProjectUpdate = {
    slug,
    title: payload.title.trim(),
    client: payload.client.trim(),
    category: payload.category,
    tags: payload.tags,
    description: payload.description.trim(),
    challenge: payload.challenge?.trim() || null,
    solution: payload.solution?.trim() || null,
    results: payload.results?.trim() || null,
    metrics: cleanMetrics(payload.metrics),
    cover_image: payload.cover_image,
    gallery_images: payload.gallery_images,
    accent_color: normalizeAccent(payload.accent_color),
    year: payload.year,
    featured: payload.featured,
    published: payload.published,
    published_at: publishedAt,
  };

  const { error: updateError } = await supabase
    .from("projects")
    .update(update)
    .eq("id", payload.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${payload.id}/edit`);
  revalidatePath("/admin");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/work");

  return {
    ok: true,
    data: { slug },
    message: payload.published ? "Project published." : "Draft saved.",
  };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing project id." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/work");
  return { ok: true, message: "Project deleted." };
}

export async function bulkDeleteProjectsAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  if (ids.length === 0) return { ok: false, error: "No projects selected." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("projects").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/work");
  return {
    ok: true,
    data: { deleted: ids.length },
    message: `Deleted ${ids.length} project${ids.length === 1 ? "" : "s"}.`,
  };
}
