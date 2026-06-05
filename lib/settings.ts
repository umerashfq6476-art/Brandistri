/**
 * Typed site-settings store backed by the Supabase `settings` table.
 *
 * Each section is persisted as one row whose `value` is a JSON blob, keyed by
 * the constants below. Reads merge the stored value over the defaults so a
 * missing key never breaks a consumer. Settings are NOT readable by the anon
 * role (see RLS), so server contexts without a user session (e.g. the contact
 * API route) must read them with the service-role admin client.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "./supabase/types";

type AnyClient = SupabaseClient<Database>;

export const SETTINGS_KEYS = {
  business: "business",
  social: "social",
  seo: "seo",
  contact: "contact",
} as const;

export type SettingsSection = keyof typeof SETTINGS_KEYS;

export interface BusinessSettings {
  name: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  available: boolean;
  /** Public URL of the navbar logo. Empty string falls back to the text wordmark. */
  logoUrl: string;
}

export interface SocialSettings {
  instagram: string;
  linkedin: string;
  behance: string;
  twitter: string;
  github: string;
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  gaId: string;
  faviconUrl: string;
}

export interface ContactSettings {
  notificationEmail: string;
  autoReply: string;
  formActive: boolean;
}

export interface SiteSettings {
  business: BusinessSettings;
  social: SocialSettings;
  seo: SeoSettings;
  contact: ContactSettings;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  business: {
    name: "Brandistri",
    tagline: "A modern branding studio.",
    contactEmail: "hello@brandistri.com",
    phone: "",
    address: "",
    available: true,
    logoUrl: "",
  },
  social: {
    instagram: "",
    linkedin: "",
    behance: "",
    twitter: "",
    github: "",
  },
  seo: {
    defaultTitle: "Brandistri — Branding, design, and digital systems.",
    defaultDescription: "We build brand systems, websites, and content that last.",
    gaId: "",
    faviconUrl: "",
  },
  contact: {
    notificationEmail: "hello@brandistri.com",
    autoReply:
      "Thanks for reaching out! We've received your message and will reply within 24 hours.",
    formActive: true,
  },
};

/** Shallow-merge a stored blob over the section default. */
function mergeSection<T extends object>(fallback: T, stored: Json | undefined): T {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return fallback;
  return { ...fallback, ...(stored as Partial<T>) };
}

/**
 * Read every settings section and return a fully-populated, typed object.
 * Pass the admin client when calling from a context without a user session.
 */
export async function getSiteSettings(client: AnyClient): Promise<SiteSettings> {
  const { data, error } = await client
    .from("settings")
    .select("key, value")
    .in("key", Object.values(SETTINGS_KEYS));

  if (error) {
    // Settings are non-critical for rendering — fall back to defaults.
    return DEFAULT_SETTINGS;
  }

  const byKey = new Map<string, Json>();
  (data ?? []).forEach((row) => byKey.set(row.key, row.value));

  return {
    business: mergeSection(DEFAULT_SETTINGS.business, byKey.get(SETTINGS_KEYS.business)),
    social: mergeSection(DEFAULT_SETTINGS.social, byKey.get(SETTINGS_KEYS.social)),
    seo: mergeSection(DEFAULT_SETTINGS.seo, byKey.get(SETTINGS_KEYS.seo)),
    contact: mergeSection(DEFAULT_SETTINGS.contact, byKey.get(SETTINGS_KEYS.contact)),
  };
}

/** Upsert a single settings section. */
export async function saveSettingsSection(
  client: AnyClient,
  section: SettingsSection,
  value: SiteSettings[SettingsSection],
): Promise<{ error: string | null }> {
  const { error } = await client
    .from("settings")
    .upsert(
      { key: SETTINGS_KEYS[section], value: value as unknown as Json },
      { onConflict: "key" },
    );
  return { error: error?.message ?? null };
}
