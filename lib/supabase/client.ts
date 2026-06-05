import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

/**
 * Browser-side Supabase client.
 *
 * Use in Client Components, hooks, and event handlers. The same session
 * cookies are written by the server client and middleware, so server and
 * client stay in sync without manual plumbing.
 *
 * Cached as a module-level singleton so React's strict double-render in
 * dev mode doesn't spawn a new GoTrueClient on every render.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      );
    }

    browserClient = createBrowserClient<Database>(url, anonKey);
  }
  return browserClient;
}

export type SupabaseBrowserClient = ReturnType<typeof getSupabaseBrowserClient>;
