import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import MessagesInbox, { type MessageRowSummary } from "./MessagesInbox";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function AdminMessagesPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, name, email, company, service_type, budget, timeline, message, read, replied, archived, received_at",
    )
    .order("received_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load messages: ${error.message}`);
  }

  const messages: MessageRowSummary[] = data ?? [];

  return <MessagesInbox initialMessages={messages} />;
}
