"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseRouteClient } from "@/lib/supabase/server";
import { generateUniqueSlug, slugify } from "@/lib/supabase/helpers";
import type { PostCategory, PostInsert, PostUpdate } from "@/lib/supabase/types";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };

export interface PostFormPayload {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: PostCategory;
  tags: string[];
  read_time: number;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  author_name: string | null;
}

function validatePostPayload(payload: PostFormPayload): string | null {
  if (!payload.title.trim()) return "Title is required.";
  if (!payload.content || payload.content === "<p></p>") {
    return "Content cannot be empty.";
  }
  if (payload.read_time < 1 || payload.read_time > 120) {
    return "Read time must be between 1 and 120 minutes.";
  }
  return null;
}

/**
 * Create a new blog post and return its id so the caller can navigate to
 * the edit page. Generates a unique slug from the title if one isn't given.
 */
export async function createPostAction(
  payload: PostFormPayload,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const error = validatePostPayload(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const desiredSlug = payload.slug.trim() || slugify(payload.title);
  const slug = await generateUniqueSlug(desiredSlug, { table: "posts" });

  const insert: PostInsert = {
    title: payload.title.trim(),
    slug,
    excerpt: payload.excerpt.trim() || null,
    content: payload.content,
    cover_image: payload.cover_image,
    category: payload.category,
    tags: payload.tags,
    read_time: payload.read_time,
    featured: payload.featured,
    published: payload.published,
    seo_title: payload.seo_title?.trim() || null,
    seo_description: payload.seo_description?.trim() || null,
    seo_keywords: payload.seo_keywords,
    author_name: payload.author_name?.trim() || null,
    published_at: payload.published ? new Date().toISOString() : null,
  };

  const { data, error: insertError } = await supabase
    .from("posts")
    .insert(insert)
    .select("id, slug")
    .single();

  if (insertError || !data) {
    return { ok: false, error: insertError?.message ?? "Failed to create post." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  return {
    ok: true,
    data: { id: data.id, slug: data.slug },
    message: payload.published ? "Post published." : "Draft saved.",
  };
}

/**
 * Update an existing post by id. Re-derives the slug only when the slug
 * field has actually been edited (it's normalized here just in case).
 */
export async function updatePostAction(
  payload: PostFormPayload,
): Promise<ActionResult<{ slug: string }>> {
  if (!payload.id) return { ok: false, error: "Missing post id." };
  const error = validatePostPayload(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const existing = await supabase
    .from("posts")
    .select("slug, published, published_at")
    .eq("id", payload.id)
    .maybeSingle();

  if (existing.error || !existing.data) {
    return { ok: false, error: "Post not found." };
  }

  const normalizedSlug = slugify(payload.slug || payload.title);
  const slug =
    normalizedSlug === existing.data.slug
      ? existing.data.slug
      : await generateUniqueSlug(normalizedSlug, {
          table: "posts",
          ignoreId: payload.id,
        });

  // Stamp published_at the first time the post is published; keep it stable
  // after that even if the admin re-toggles draft → publish.
  let publishedAt = existing.data.published_at;
  if (payload.published && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  const update: PostUpdate = {
    title: payload.title.trim(),
    slug,
    excerpt: payload.excerpt.trim() || null,
    content: payload.content,
    cover_image: payload.cover_image,
    category: payload.category,
    tags: payload.tags,
    read_time: payload.read_time,
    featured: payload.featured,
    published: payload.published,
    seo_title: payload.seo_title?.trim() || null,
    seo_description: payload.seo_description?.trim() || null,
    seo_keywords: payload.seo_keywords,
    author_name: payload.author_name?.trim() || null,
    published_at: publishedAt,
  };

  const { error: updateError } = await supabase
    .from("posts")
    .update(update)
    .eq("id", payload.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${payload.id}/edit`);
  revalidatePath("/admin");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");

  return {
    ok: true,
    data: { slug },
    message: payload.published ? "Post published." : "Draft saved.",
  };
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing post id." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  return { ok: true, message: "Post deleted." };
}

export async function bulkDeletePostsAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  if (ids.length === 0) return { ok: false, error: "No posts selected." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("posts").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
  return {
    ok: true,
    data: { deleted: ids.length },
    message: `Deleted ${ids.length} post${ids.length === 1 ? "" : "s"}.`,
  };
}
