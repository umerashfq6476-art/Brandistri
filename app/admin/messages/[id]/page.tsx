import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Building2, Calendar, Mail } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/admin/ui/primitives";
import MessageDetail from "./MessageDetail";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Message",
};

export default async function MessageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getSupabaseServerClient();

  const { data: message, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load message: ${error.message}`);
  }
  if (!message) {
    notFound();
  }

  // Auto-mark as read on open. We use the (read-only-cookie) server client so
  // this is a plain DB write — the force-dynamic admin layout will recompute
  // the unread badge on the next navigation.
  if (!message.read) {
    await supabase
      .from("messages")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("id", message.id);
    message.read = true;
  }

  // Resolve previous / next ids by chronological order for in-page navigation.
  const { data: order } = await supabase
    .from("messages")
    .select("id")
    .order("received_at", { ascending: false });

  const ids = (order ?? []).map((r) => r.id);
  const index = ids.indexOf(message.id);
  const prevId = index > 0 ? ids[index - 1] : null; // newer
  const nextId = index >= 0 && index < ids.length - 1 ? ids[index + 1] : null; // older

  const tags = [
    message.service_type && { label: "Service", value: message.service_type },
    message.budget && { label: "Budget", value: message.budget },
    message.timeline && { label: "Timeline", value: message.timeline },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to inbox
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: message content */}
        <article className="lg:col-span-2 space-y-5 rounded-2xl border border-border bg-surface p-6 md:p-8">
          <header className="border-b border-border pb-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  {message.name}
                </h1>
                <a
                  href={`mailto:${message.email}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm text-accent-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {message.email}
                </a>
                {message.company && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <Building2 className="h-3.5 w-3.5" aria-hidden />
                    {message.company}
                  </p>
                )}
              </div>
              <Badge tone="muted">
                {message.source}
              </Badge>
            </div>

            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {format(new Date(message.received_at), "PPpp")}
            </p>
          </header>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                >
                  <span className="text-text-muted">{t.label}:</span>
                  <span className="text-text-primary">{t.value}</span>
                </span>
              ))}
            </div>
          )}

          <div className="whitespace-pre-wrap rounded-xl border border-border bg-background p-5 text-[15px] leading-relaxed text-text-primary/90">
            {message.message}
          </div>
        </article>

        {/* Right: actions panel */}
        <MessageDetail
          id={message.id}
          name={message.name}
          email={message.email}
          serviceType={message.service_type}
          status={{
            read: message.read,
            replied: message.replied,
            archived: message.archived,
          }}
          prevId={prevId}
          nextId={nextId}
        />
      </div>
    </div>
  );
}
