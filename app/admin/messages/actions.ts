"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseRouteClient } from "@/lib/supabase/server";
import type { MessageUpdate } from "@/lib/supabase/types";
import type { MessageStatus } from "./status";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };

/** Build the column patch that puts a row into the requested status. */
function statusToUpdate(status: MessageStatus): MessageUpdate {
  const now = new Date().toISOString();
  switch (status) {
    case "unread":
      return { read: false, read_at: null, replied: false, replied_at: null, archived: false };
    case "read":
      return { read: true, read_at: now, replied: false, replied_at: null, archived: false };
    case "replied":
      return { read: true, read_at: now, replied: true, replied_at: now, archived: false };
    case "archived":
      return { archived: true };
  }
}

export async function setMessageStatusAction(
  id: string,
  status: MessageStatus,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing message id." };

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase
    .from("messages")
    .update(statusToUpdate(status))
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { ok: true, message: `Marked as ${status}.` };
}

/** Toggle the read flag without touching replied/archived. */
export async function setMessageReadAction(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing message id." };

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase
    .from("messages")
    .update({ read, read_at: read ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { ok: true, message: read ? "Marked as read." : "Marked as unread." };
}

/** Mark many messages read in one round trip (bulk action in the inbox). */
export async function bulkMarkReadAction(
  ids: string[],
): Promise<ActionResult<{ updated: number }>> {
  if (ids.length === 0) return { ok: false, error: "No messages selected." };

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase
    .from("messages")
    .update({ read: true, read_at: new Date().toISOString() })
    .in("id", ids);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return {
    ok: true,
    data: { updated: ids.length },
    message: `Marked ${ids.length} message${ids.length === 1 ? "" : "s"} as read.`,
  };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing message id." };

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { ok: true, message: "Message deleted." };
}

export async function bulkDeleteMessagesAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  if (ids.length === 0) return { ok: false, error: "No messages selected." };

  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("messages").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return {
    ok: true,
    data: { deleted: ids.length },
    message: `Deleted ${ids.length} message${ids.length === 1 ? "" : "s"}.`,
  };
}
