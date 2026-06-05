"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { markMessageAsReadAction } from "@/app/admin/actions";

interface MarkAsReadButtonProps {
  messageId: string;
}

/**
 * Small inline action used in the recent-messages list. Wraps a server
 * action in a transition so the row stays interactive during the round
 * trip and we get a free pending state.
 */
export default function MarkAsReadButton({ messageId }: MarkAsReadButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markMessageAsReadAction(messageId);
        })
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-text-secondary transition hover:border-accent-secondary/50 hover:text-text-primary disabled:cursor-wait disabled:opacity-60"
      aria-label="Mark message as read"
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
      ) : (
        <Check className="h-3 w-3" aria-hidden />
      )}
      Mark read
    </button>
  );
}
