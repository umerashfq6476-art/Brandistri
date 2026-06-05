"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Reply, Trash2 } from "lucide-react";
import { Button, Field, Select } from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteMessageAction, setMessageStatusAction } from "../actions";
import { deriveMessageStatus, type MessageStatus } from "../status";

interface MessageDetailProps {
  id: string;
  name: string;
  email: string;
  serviceType: string | null;
  status: { read: boolean; replied: boolean; archived: boolean };
  prevId: string | null;
  nextId: string | null;
}

export default function MessageDetail({
  id,
  name,
  email,
  serviceType,
  status: initialStatus,
  prevId,
  nextId,
}: MessageDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState<MessageStatus>(
    deriveMessageStatus(initialStatus),
  );
  const [, startUpdate] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mailtoSubject = encodeURIComponent(
    `Re: Your ${serviceType ?? "project"} inquiry — Brandistri`,
  );
  const mailtoBody = encodeURIComponent(`Hi ${name.split(" ")[0]},\n\n`);
  const mailto = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  function changeStatus(next: MessageStatus) {
    const prev = status;
    setStatus(next); // optimistic
    startUpdate(async () => {
      const res = await setMessageStatusAction(id, next);
      if (!res.ok) {
        setStatus(prev);
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Status updated.");
      router.refresh();
    });
  }

  function handleDelete() {
    startDelete(async () => {
      const res = await deleteMessageAction(id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Message deleted.");
      router.push("/admin/messages");
      router.refresh();
    });
  }

  return (
    <aside className="space-y-4">
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <Field label="Status" htmlFor="status-select">
          <Select
            id="status-select"
            value={status}
            onChange={(e) => changeStatus(e.target.value as MessageStatus)}
          >
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>

        <a
          href={mailto}
          onClick={() => {
            if (status !== "replied" && status !== "archived") {
              changeStatus("replied");
            }
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-primary/90"
        >
          <Reply className="h-4 w-4" aria-hidden />
          Quick reply
        </a>

        <Button
          variant="danger"
          fullWidth
          onClick={() => setConfirmOpen(true)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
        >
          Delete message
        </Button>
      </div>

      {/* Prev / next navigation */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-surface p-2">
        <NavButton href={prevId ? `/admin/messages/${prevId}` : null} direction="prev" />
        <span className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Navigate
        </span>
        <NavButton href={nextId ? `/admin/messages/${nextId}` : null} direction="next" />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this message?"
        description={`The message from ${name} will be permanently removed.`}
        confirmLabel="Delete message"
        loading={deleting}
      />
    </aside>
  );
}

function NavButton({
  href,
  direction,
}: {
  href: string | null;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Newer message" : "Older message";
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const content = (
    <>
      {direction === "prev" && <Icon className="h-4 w-4" aria-hidden />}
      {direction === "prev" ? "Newer" : "Older"}
      {direction === "next" && <Icon className="h-4 w-4" aria-hidden />}
    </>
  );
  if (!href) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-text-muted opacity-50">
        {content}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
    >
      {content}
    </Link>
  );
}
