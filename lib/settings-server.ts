/**
 * Server-only cached reader for site settings.
 *
 * Public pages (footer, contact page) need the business/social settings, but
 * the `settings` table is NOT readable by the anon role (see RLS). So we read
 * it with the service-role admin client and wrap the result in `unstable_cache`
 * so public pages stay statically renderable. Mutations in the admin call
 * `revalidateTag(SETTINGS_CACHE_TAG)` to refresh it immediately.
 *
 * This module imports the admin (service-role) client, so it must never be
 * imported by a Client Component.
 */

import { unstable_cache } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, getSiteSettings, type SiteSettings } from "@/lib/settings";

export const SETTINGS_CACHE_TAG = "site-settings";

export const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      return await getSiteSettings(getSupabaseAdminClient());
    } catch {
      // Missing env / DB hiccup — never break public rendering over settings.
      return DEFAULT_SETTINGS;
    }
  },
  ["site-settings"],
  { tags: [SETTINGS_CACHE_TAG] },
);
