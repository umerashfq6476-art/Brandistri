/**
 * Client-safe Supabase helpers.
 *
 * These functions are imported by Client Components (image uploaders, the
 * slug field, etc.), so this module must NOT pull in anything that touches
 * `next/headers` or the server client. It depends only on the browser client
 * and pure utilities — keeping it out of `helpers.ts`, which imports the
 * server client and therefore can't be bundled for the browser.
 *
 * `helpers.ts` re-exports `slugify` and `uploadImage` from here so existing
 * server-side imports keep working.
 */

import { getSupabaseBrowserClient } from "./client";
import type { Database } from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";

type AnyClient = SupabaseClient<Database>;

/* ─── Slug generation ───────────────────────────────────────────────────── */

/**
 * Convert any title into a URL-safe slug. Lowercase, ASCII-only, hyphenated.
 *
 *   slugify("How We Name Things — 2026") // "how-we-name-things-2026"
 */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "untitled"
  );
}

/* ─── Image uploads ─────────────────────────────────────────────────────── */

export type StorageBucket = "blog-covers" | "project-images" | "brand-assets";

export interface UploadImageOptions {
  /** Destination bucket. */
  bucket: StorageBucket;
  /** The file to upload (from <input type="file"> or react-dropzone). */
  file: File;
  /** Optional folder/prefix inside the bucket — e.g. a post slug or project id. */
  pathPrefix?: string;
  /** Override the generated filename. Defaults to a slugified version of the original. */
  filename?: string;
  /** Set to true to allow overwriting an existing object at the same path. */
  upsert?: boolean;
  /** Override the client. Defaults to the browser client (RLS-aware). */
  client?: AnyClient;
}

export interface UploadImageResult {
  path: string; // path inside the bucket
  publicUrl: string; // ready-to-render absolute URL
}

function getDefaultBrowserClient(): AnyClient {
  return getSupabaseBrowserClient() as unknown as AnyClient;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

/**
 * Upload an image to one of the public buckets and return its public URL.
 *
 * Generates a collision-resistant path (`<prefix>/<timestamp>-<slug>.<ext>`)
 * unless the caller passes an explicit `filename`. The bucket policies
 * enforce admin-only writes, so this must be called from an authenticated
 * context.
 */
export async function uploadImage(
  options: UploadImageOptions,
): Promise<UploadImageResult> {
  const {
    bucket,
    file,
    pathPrefix,
    filename,
    upsert = false,
    client = getDefaultBrowserClient(),
  } = options;

  if (!file) {
    throw new Error("uploadImage: file is required.");
  }

  const originalName = file.name || "upload";
  const dotIndex = originalName.lastIndexOf(".");
  const ext = dotIndex >= 0 ? originalName.slice(dotIndex + 1).toLowerCase() : "";
  const baseName = dotIndex >= 0 ? originalName.slice(0, dotIndex) : originalName;

  const safeName =
    filename ?? `${Date.now()}-${slugify(baseName)}${ext ? `.${ext}` : ""}`;
  const fullPath = pathPrefix ? `${trimSlashes(pathPrefix)}/${safeName}` : safeName;

  const { error: uploadError } = await client.storage
    .from(bucket)
    .upload(fullPath, file, {
      cacheControl: "3600",
      upsert,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(`[supabase:uploadImage] ${uploadError.message}`);
  }

  const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(fullPath);

  return {
    path: fullPath,
    publicUrl: publicUrlData.publicUrl,
  };
}
