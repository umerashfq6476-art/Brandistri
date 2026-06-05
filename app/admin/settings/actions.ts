"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseRouteClient } from "@/lib/supabase/server";
import { SETTINGS_CACHE_TAG } from "@/lib/settings-server";
import {
  saveSettingsSection,
  type BusinessSettings,
  type ContactSettings,
  type SeoSettings,
  type SocialSettings,
} from "@/lib/settings";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/* ─── Section saves ─────────────────────────────────────────────────────── */

export async function saveBusinessSettingsAction(
  input: BusinessSettings,
): Promise<ActionResult> {
  const name = str(input.name, 120);
  const contactEmail = str(input.contactEmail, 200);
  if (!name) return { ok: false, error: "Agency name is required." };
  if (!contactEmail || !EMAIL_REGEX.test(contactEmail)) {
    return { ok: false, error: "A valid contact email is required." };
  }

  const value: BusinessSettings = {
    name,
    tagline: str(input.tagline, 200),
    contactEmail,
    phone: str(input.phone, 60),
    address: str(input.address, 300),
    available: Boolean(input.available),
    logoUrl: str(input.logoUrl, 500),
  };

  const { error } = await saveSettingsSection(getSupabaseRouteClient(), "business", value);
  if (error) return { ok: false, error };

  revalidatePath("/admin/settings");
  // Refresh the cached settings used by public pages (footer, contact page).
  revalidateTag(SETTINGS_CACHE_TAG);
  return { ok: true, message: "Business information saved." };
}

export async function saveSocialSettingsAction(
  input: SocialSettings,
): Promise<ActionResult> {
  const value: SocialSettings = {
    instagram: str(input.instagram, 300),
    linkedin: str(input.linkedin, 300),
    behance: str(input.behance, 300),
    twitter: str(input.twitter, 300),
    github: str(input.github, 300),
  };

  const { error } = await saveSettingsSection(getSupabaseRouteClient(), "social", value);
  if (error) return { ok: false, error };

  revalidatePath("/admin/settings");
  revalidateTag(SETTINGS_CACHE_TAG);
  return { ok: true, message: "Social links saved." };
}

export async function saveSeoSettingsAction(input: SeoSettings): Promise<ActionResult> {
  const value: SeoSettings = {
    defaultTitle: str(input.defaultTitle, 200),
    defaultDescription: str(input.defaultDescription, 320),
    gaId: str(input.gaId, 60),
    faviconUrl: str(input.faviconUrl, 300),
  };

  const { error } = await saveSettingsSection(getSupabaseRouteClient(), "seo", value);
  if (error) return { ok: false, error };

  revalidatePath("/admin/settings");
  revalidateTag(SETTINGS_CACHE_TAG);
  return { ok: true, message: "SEO defaults saved." };
}

export async function saveContactSettingsAction(
  input: ContactSettings,
): Promise<ActionResult> {
  const notificationEmail = str(input.notificationEmail, 200);
  if (notificationEmail && !EMAIL_REGEX.test(notificationEmail)) {
    return { ok: false, error: "Notification email is not valid." };
  }

  const value: ContactSettings = {
    notificationEmail,
    autoReply: str(input.autoReply, 2000),
    formActive: Boolean(input.formActive),
  };

  const { error } = await saveSettingsSection(getSupabaseRouteClient(), "contact", value);
  if (error) return { ok: false, error };

  revalidatePath("/admin/settings");
  revalidateTag(SETTINGS_CACHE_TAG);
  return { ok: true, message: "Contact form settings saved." };
}

/* ─── Account security ──────────────────────────────────────────────────── */

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  if (!currentPassword || !newPassword) {
    return { ok: false, error: "Both current and new passwords are required." };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  if (newPassword === currentPassword) {
    return { ok: false, error: "New password must differ from the current one." };
  }

  const supabase = getSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, error: "No active session." };
  }

  // Re-authenticate to verify the current password before changing it.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  return { ok: true, message: "Password updated." };
}

/**
 * Sign out of every session (global scope) and bounce to the login screen.
 */
export async function signOutAllSessionsAction() {
  const supabase = getSupabaseRouteClient();
  await supabase.auth.signOut({ scope: "global" });
  redirect("/admin/login");
}
