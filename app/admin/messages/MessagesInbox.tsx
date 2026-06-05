"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCheck,
  Circle,
  Inbox,
  Mail,
  MailOpen,
  Reply,
  Trash2,
} from "lucide-react";
import { Badge, Button, Select } from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import {
  bulkDeleteMessagesAction,
  bulkMarkReadAction,
  deleteMessageAction,
  setMessageReadAction,
  setMessageStatusAction,
} from "./actions";
import { deriveMessageStatus, type MessageStatus } from "./status";

export interface MessageRowSummary {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service_type: string | null;
  budget: string | null;
  timeline: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  archived: boolean;
  received_at: string;
}

type TabFilter = "all" | "unread" | "read" | "replied";
type SortKey = "newest" | "oldest";

const STATUS_TONE: Record<MessageStatus, "muted" | "warning" | "success" | "info"> = {
  unread: "warning",
  read: "muted",
  replied: "success",
  archived: "info",
};

const STATUS_LABEL: Record<MessageStatus, string> = {
  unread: "Unread",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

interface MessagesInboxProps {
  initialMessages: MessageRowSummary[];
}

export default function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [tab, setTab] = useState<TabFilter>("all");
  const [service, setService] = useState("all");
  const [budget, setBudget] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [pendingDelete, setPendingDelete] = useState<MessageRowSummary | null>(null);
  const [deleting, startDelete] = useTransition();
  const [, startQuick] = useTransition();

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read && !m.archived).length,
    [messages],
  );

  // Build the filter dropdown options from the data that actually exists.
  const serviceOptions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => m.service_type && set.add(m.service_type));
    return Array.from(set).sort();
  }, [messages]);

  const budgetOptions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => m.budget && set.add(m.budget));
    return Array.from(set).sort();
  }, [messages]);

  const tabCounts = useMemo(
    () => ({
      all: messages.length,
      unread: messages.filter((m) => !m.read && !m.archived).length,
      read: messages.filter((m) => m.read && !m.replied && !m.archived).length,
      replied: messages.filter((m) => m.replied).length,
    }),
    [messages],
  );

  const filtered = useMemo(() => {
    const list = messages.filter((m) => {
      const status = deriveMessageStatus(m);
      if (tab === "unread" && status !== "unread") return false;
      if (tab === "read" && status !== "read") return false;
      if (tab === "replied" && !m.replied) return false;
      if (service !== "all" && m.service_type !== service) return false;
      if (budget !== "all" && m.budget !== budget) return false;
      return true;
    });
    list.sort((a, b) =>
      sort === "oldest"
        ? +new Date(a.received_at) - +new Date(b.received_at)
        : +new Date(b.received_at) - +new Date(a.received_at),
    );
    return list;
  }, [messages, tab, service, budget, sort]);

  const visibleIds = filtered.map((m) => m.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  function toggleAllVisible() {
    const next = new Set(selected);
    if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
    else visibleIds.forEach((id) => next.add(id));
    setSelected(next);
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function applyLocal(id: string, patch: Partial<MessageRowSummary>) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function handleToggleRead(m: MessageRowSummary) {
    const nextRead = !m.read;
    applyLocal(m.id, { read: nextRead }); // optimistic
    startQuick(async () => {
      const res = await setMessageReadAction(m.id, nextRead);
      if (!res.ok) {
        applyLocal(m.id, { read: m.read });
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Updated.");
      router.refresh();
    });
  }

  function handleMarkReplied(m: MessageRowSummary) {
    applyLocal(m.id, { read: true, replied: true }); // optimistic
    startQuick(async () => {
      const res = await setMessageStatusAction(m.id, "replied");
      if (!res.ok) {
        applyLocal(m.id, { replied: m.replied, read: m.read });
        toast.error(res.error);
        return;
      }
      toast.success("Marked as replied.");
      router.refresh();
    });
  }

  function handleBulkMarkRead() {
    const ids = Array.from(selected);
    startQuick(async () => {
      const res = await bulkMarkReadAction(ids);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMessages((prev) =>
        prev.map((m) => (selected.has(m.id) ? { ...m, read: true } : m)),
      );
      setSelected(new Set());
      toast.success(res.message ?? "Updated.");
      router.refresh();
    });
  }

  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);
  function handleBulkDelete() {
    const ids = Array.from(selected);
    startDelete(async () => {
      const res = await bulkDeleteMessagesAction(ids);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMessages((prev) => prev.filter((m) => !selected.has(m.id)));
      setSelected(new Set());
      setPendingBulkDelete(false);
      toast.success(res.message ?? "Deleted.");
      router.refresh();
    });
  }

  function handleDelete(m: MessageRowSummary) {
    startDelete(async () => {
      const res = await deleteMessageAction(m.id);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(m.id);
        return next;
      });
      setPendingDelete(null);
      toast.success(res.message ?? "Deleted.");
      router.refresh();
    });
  }

  const TABS: Array<{ key: TabFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "read", label: "Read" },
    { key: "replied", label: "Replied" },
  ];

  return (
    <div className="space-y-6">
      {/* Title with unread count */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Inbox{" "}
            {unreadCount > 0 && (
              <span className="align-middle text-base font-medium text-accent-secondary">
                ({unreadCount} unread)
              </span>
            )}
          </h1>
          <p className="mt-0.5 text-xs text-text-muted">
            {messages.length} message{messages.length === 1 ? "" : "s"} total
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-border bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition",
                tab === t.key
                  ? "bg-background text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
              aria-pressed={tab === t.key}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] tabular-nums",
                  tab === t.key
                    ? "bg-accent-primary/15 text-accent-primary"
                    : "bg-background text-text-muted",
                )}
              >
                {tabCounts[t.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-label="Filter by service"
            className="h-9 py-0"
          >
            <option value="all">All services</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            aria-label="Filter by budget"
            className="h-9 py-0"
          >
            <option value="all">All budgets</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort messages"
            className="h-9 py-0"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </Select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-primary/40 bg-accent-primary/5 px-4 py-3">
          <p className="text-sm text-text-primary">
            <strong>{selected.size}</strong> selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkRead}
              leftIcon={<CheckCheck className="h-3.5 w-3.5" aria-hidden />}
            >
              Mark as read
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setPendingBulkDelete(true)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {messages.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="text-sm text-text-secondary">
            No messages match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-background text-[10px] uppercase tracking-[0.14em] text-text-muted">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      aria-label="Select all"
                      className="h-3.5 w-3.5 cursor-pointer accent-accent-primary"
                    />
                  </th>
                  <th className="w-6 px-2 py-3" aria-label="Status" />
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="w-1 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((m) => {
                  const status = deriveMessageStatus(m);
                  return (
                    <tr
                      key={m.id}
                      className={cn(
                        "transition",
                        selected.has(m.id) && "bg-accent-primary/5",
                        !m.read && !m.archived && "bg-accent-secondary/[0.03]",
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(m.id)}
                          onChange={() => toggleOne(m.id)}
                          aria-label={`Select message from ${m.name}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-accent-primary"
                        />
                      </td>
                      <td className="px-2 py-3">
                        {!m.read && !m.archived ? (
                          <span
                            aria-label="Unread"
                            className="block h-2 w-2 rounded-full bg-accent-secondary"
                          />
                        ) : (
                          <Circle className="h-2 w-2 text-text-muted" aria-hidden />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/messages/${m.id}`}
                          className={cn(
                            "block max-w-[260px] truncate hover:underline",
                            m.read ? "font-medium text-text-primary" : "font-semibold text-text-primary",
                          )}
                        >
                          {m.name}
                        </Link>
                        <p className="max-w-[260px] truncate text-xs text-text-muted">
                          {m.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {m.service_type ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {m.budget ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted">
                        {formatDistanceToNow(new Date(m.received_at), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleRead(m)}
                            aria-label={m.read ? "Mark as unread" : "Mark as read"}
                            title={m.read ? "Mark as unread" : "Mark as read"}
                            className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-accent-primary/40 hover:text-text-primary"
                          >
                            {m.read ? (
                              <Mail className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <MailOpen className="h-3.5 w-3.5" aria-hidden />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkReplied(m)}
                            aria-label="Mark as replied"
                            title="Mark as replied"
                            className={cn(
                              "grid h-7 w-7 place-items-center rounded-md border border-border bg-background hover:border-accent-secondary/50 hover:text-text-primary",
                              m.replied ? "text-accent-secondary" : "text-text-secondary",
                            )}
                          >
                            <Reply className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(m)}
                            aria-label="Delete message"
                            title="Delete"
                            className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background text-text-secondary hover:border-red-500/40 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        title="Delete this message?"
        description={
          pendingDelete
            ? `The message from ${pendingDelete.name} will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete message"
        loading={deleting}
      />
      <ConfirmDialog
        open={pendingBulkDelete}
        onCancel={() => setPendingBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selected.size} message${selected.size === 1 ? "" : "s"}?`}
        description="The selected messages will be permanently removed."
        confirmLabel="Delete messages"
        loading={deleting}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
        <Inbox className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
        No messages yet
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        Submissions from the public contact form will land here.
      </p>
    </div>
  );
}
