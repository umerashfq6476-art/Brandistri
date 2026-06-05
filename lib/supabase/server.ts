import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

function requirePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }
  return { url, anonKey };
}

/**
 * Server Component Supabase client.
 *
 * Reads cookies via next/headers so the session is fresh on every render.
 * Cookie writes are no-ops in Server Components (Next.js doesn't allow
 * mutating cookies there); the middleware handles the actual rotation.
 *
 * Create a new instance per request — do not cache across requests.
 */
export function getSupabaseServerClient() {
  const { url, anonKey } = requirePublicEnv();
  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Cookie writes from Server Components are intentionally ignored.
        // The middleware (and route handlers below) handle session rotation.
      },
      remove() {
        // Same as above — no-op outside of writable contexts.
      },
    },
  });
}

/**
 * Route Handler Supabase client.
 *
 * Use inside route.ts files where cookies CAN be written. This is where
 * sign-in, sign-out, and refreshSession should run so the new session
 * cookies make it back to the browser.
 */
export function getSupabaseRouteClient() {
  const { url, anonKey } = requirePublicEnv();
  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}

/**
 * Public (anon) Supabase client with NO cookie/session handling.
 *
 * Use for reading public content (published posts, projects, active services
 * and packages) inside Server Components. Because it never calls
 * `cookies()`, pages that use it stay statically renderable — enabling true
 * ISR (`export const revalidate`) instead of forcing dynamic rendering.
 */
export function getSupabasePublicClient() {
  const { url, anonKey } = requirePublicEnv();
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 *
 * Server-only. Never import from a Client Component or expose to the
 * browser. Use for trusted admin tasks (cron jobs, webhooks, scripted
 * migrations) where you need to read/write regardless of RLS.
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
