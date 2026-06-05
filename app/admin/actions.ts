"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseRouteClient } from "@/lib/supabase/server";

/**
 * Sign the current admin out and bounce them to the login screen.
 *
 * Called from the sidebar's <form action={signOutAction}> button. Uses the
 * route-handler-style client because that's the only server context where
 * cookie writes (clearing the session) are honored.
 */
export async function signOutAction() {
  const supabase = getSupabaseRouteClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Mark a contact message as read.
 *
 * Server action invoked from the dashboard's "Mark as Read" button. We
 * revalidate /admin so the unread badge and recent-messages list update
 * immediately after the mutation.
 */
export async function markMessageAsReadAction(messageId: string) {
  if (!messageId) return;

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase
    .from("messages")
    .update({ read: true, read_at: new Date().toISOString() })
    .eq("id", messageId);

  if (error) {
    throw new Error(`[markMessageAsRead] ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

/**
 * Email + password sign-in. Returns { ok: false, error } on failure so the
 * login form can render the message inline; redirects on success.
 */
export async function signInAction(formData: FormData): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: error.message };
  }

  const safeRedirect = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safeRedirect);
}
