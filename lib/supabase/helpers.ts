/**
 * Reusable Supabase data-access helpers.
 *
 * These functions wrap the raw Supabase client with:
 *   - typed inputs / outputs sourced from lib/supabase/types.ts
 *   - sensible default ordering and filtering for public pages
 *   - consistent error handling (throws on failure with a descriptive message)
 *
 * Most helpers default to the server client so they can be used inside Server
 * Components and Route Handlers. A `client` argument lets callers pass an
 * already-instantiated browser client when running on the client.
 */

import { getSupabaseBrowserClient } from "./client";
import { getSupabasePublicClient, getSupabaseServerClient } from "./server";
import { slugify } from "./storage";
import type {
  Database,
  MessageInsert,
  MessageRow,
  PackageRow,
  PostCategory,
  PostRow,
  ProjectCategory,
  ProjectRow,
  ServiceRow,
} from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Client-safe helpers live in ./storage (no server-only imports) so Client
// Components can use them without pulling next/headers into the browser bundle.
// Re-exported here for backwards-compatible server-side imports.
export {
  slugify,
  uploadImage,
  type StorageBucket,
  type UploadImageOptions,
  type UploadImageResult,
} from "./storage";

type AnyClient = SupabaseClient<Database>;

/* ─── Small utilities ───────────────────────────────────────────────────── */

function getDefaultServerClient(): AnyClient {
  return getSupabaseServerClient() as unknown as AnyClient;
}

/**
 * Cookie-less anon client for public content reads. Keeps Server Components
 * statically renderable so ISR works. Only sees rows the anon role is allowed
 * to read (published posts/projects, active services/packages).
 */
function getDefaultPublicClient(): AnyClient {
  return getSupabasePublicClient() as unknown as AnyClient;
}

function getDefaultBrowserClient(): AnyClient {
  return getSupabaseBrowserClient() as unknown as AnyClient;
}

/**
 * Returns the query data, logging (but not throwing) on failure so a transient
 * read error at build/ISR time degrades to empty content instead of taking the
 * whole page down. The caller passes a safe fallback as `result.data`.
 */
function ensureOk<T>(result: { data: T; error: { message: string } | null }, context: string): T {
  if (result.error) {
    console.error(`[supabase:${context}] ${result.error.message}`);
  }
  return result.data;
}

/* ─── Posts ─────────────────────────────────────────────────────────────── */

export interface PostListOptions {
  page?: number;            // 1-based
  pageSize?: number;        // default 12
  category?: PostCategory;  // exact match
  tag?: string;             // single tag membership
  featured?: boolean;       // only featured rows
  client?: AnyClient;
}

export interface PostListResult {
  posts: PostRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch published blog posts with pagination + optional filters.
 *
 * Returns the current page plus metadata so callers can render pagers
 * without a follow-up count query.
 */
export async function getPublishedPosts(options: PostListOptions = {}): Promise<PostListResult> {
  const {
    page = 1,
    pageSize = 12,
    category,
    tag,
    featured,
    client = getDefaultPublicClient(),
  } = options;

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let query = client
    .from("posts")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category) query = query.eq("category", category);
  if (typeof featured === "boolean") query = query.eq("featured", featured);
  if (tag) query = query.contains("tags", [tag]);

  const result = await query;
  const data = ensureOk({ data: result.data ?? [], error: result.error }, "getPublishedPosts");
  const total = result.count ?? data.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));

  return {
    posts: data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

/**
 * Fetch a single published post by its URL slug. Returns null when the slug
 * is unknown or the post is unpublished.
 */
export async function getPostBySlug(
  slug: string,
  client: AnyClient = getDefaultPublicClient(),
): Promise<PostRow | null> {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`[supabase:getPostBySlug] ${error.message}`);
    return null;
  }
  return data;
}

/* ─── Projects ──────────────────────────────────────────────────────────── */

export interface ProjectListOptions {
  page?: number;
  pageSize?: number;
  category?: ProjectCategory | "All Projects";
  featured?: boolean;
  client?: AnyClient;
}

export interface ProjectListResult {
  projects: ProjectRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch published portfolio projects with optional category filter +
 * pagination. Pass "All Projects" (or omit `category`) for the full feed.
 */
export async function getPublishedProjects(
  options: ProjectListOptions = {},
): Promise<ProjectListResult> {
  const {
    page = 1,
    pageSize = 24,
    category,
    featured,
    client = getDefaultPublicClient(),
  } = options;

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let query = client
    .from("projects")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && category !== "All Projects") {
    query = query.eq("category", category);
  }
  if (typeof featured === "boolean") query = query.eq("featured", featured);

  const result = await query;
  const data = ensureOk(
    { data: result.data ?? [], error: result.error },
    "getPublishedProjects",
  );
  const total = result.count ?? data.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));

  return {
    projects: data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

/**
 * Fetch a single published project by slug. Returns null when not found.
 */
export async function getProjectBySlug(
  slug: string,
  client: AnyClient = getDefaultPublicClient(),
): Promise<ProjectRow | null> {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`[supabase:getProjectBySlug] ${error.message}`);
    return null;
  }
  return data;
}

/* ─── Services ──────────────────────────────────────────────────────────── */

/**
 * Fetch all active services, ordered by display_order. Used by the public
 * services page and the marketing footer.
 */
export async function getActiveServices(
  client: AnyClient = getDefaultPublicClient(),
): Promise<ServiceRow[]> {
  const { data, error } = await client
    .from("services")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    console.error(`[supabase:getActiveServices] ${error.message}`);
    return [];
  }
  return data ?? [];
}

/**
 * Fetch a single active service by slug.
 */
export async function getServiceBySlug(
  slug: string,
  client: AnyClient = getDefaultPublicClient(),
): Promise<ServiceRow | null> {
  const { data, error } = await client
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error(`[supabase:getServiceBySlug] ${error.message}`);
    return null;
  }
  return data;
}

/* ─── Packages ──────────────────────────────────────────────────────────── */

/**
 * Fetch all active pricing packages in display order.
 */
export async function getActivePackages(
  client: AnyClient = getDefaultPublicClient(),
): Promise<PackageRow[]> {
  const { data, error } = await client
    .from("packages")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error(`[supabase:getActivePackages] ${error.message}`);
    return [];
  }
  return data ?? [];
}

/* ─── Messages (contact form) ───────────────────────────────────────────── */

export interface SubmitMessageInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  project_type?: string;
  service_type?: string;
  budget?: string;
  timeline?: string;
  source?: MessageInsert["source"];
  client?: AnyClient;
}

/**
 * Insert a new contact-form submission. Validates required fields client-side
 * and uses the browser client by default so RLS treats the request as anon.
 *
 * Returns the saved row so the caller can render a confirmation or hand the
 * id to a downstream email step.
 */
export async function submitContactMessage(
  input: SubmitMessageInput,
): Promise<MessageRow> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const message = input.message?.trim();

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  const client = input.client ?? getDefaultBrowserClient();

  const payload: MessageInsert = {
    name,
    email,
    message,
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    project_type: input.project_type?.trim() || null,
    service_type: input.service_type?.trim() || null,
    budget: input.budget?.trim() || null,
    timeline: input.timeline?.trim() || null,
    source: input.source ?? "contact",
  };

  const { data, error } = await client
    .from("messages")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`[supabase:submitContactMessage] ${error?.message ?? "Insert returned no row."}`);
  }
  return data;
}

/* ─── Slug generation ───────────────────────────────────────────────────── */

export interface UniqueSlugOptions {
  /** Table to check for collisions. */
  table: "posts" | "projects" | "services";
  /** Optional row id to ignore (used when editing an existing row). */
  ignoreId?: string;
  /** Override the client. Defaults to the server client. */
  client?: AnyClient;
}

/**
 * Generate a unique slug from a title for a given table, appending `-2`,
 * `-3`, etc. until no row collides. Pass `ignoreId` when editing an existing
 * row so a row's own slug doesn't count as a collision against itself.
 */
export async function generateUniqueSlug(
  title: string,
  options: UniqueSlugOptions,
): Promise<string> {
  const { table, ignoreId, client = getDefaultServerClient() } = options;
  const base = slugify(title);

  for (let attempt = 0; attempt < 100; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    let query = client.from(table).select("id").eq("slug", candidate).limit(1);
    if (ignoreId) query = query.neq("id", ignoreId);

    const { data, error } = await query;
    if (error) {
      throw new Error(`[supabase:generateUniqueSlug] ${error.message}`);
    }
    if (!data || data.length === 0) {
      return candidate;
    }
  }

  // Vanishingly unlikely fallback: append a timestamp so we never loop forever.
  return `${base}-${Date.now()}`;
}
