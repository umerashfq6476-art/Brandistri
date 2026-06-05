"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, ExternalLink, LogOut, User } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { ADMIN_NAV } from "./AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  userEmail: string;
  unreadCount: number;
}

interface Crumb {
  label: string;
  href?: string;
}

export default function AdminHeader({ userEmail, unreadCount }: AdminHeaderProps) {
  const pathname = usePathname() ?? "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close avatar dropdown on outside click / Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const { title, crumbs } = derivePageMeta(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
        {/* Left: title + breadcrumbs */}
        <div className="min-w-0 flex-1">
          {crumbs.length > 1 && (
            <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
              {crumbs.map((crumb, i) => (
                <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-text-primary">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-text-secondary">{crumb.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden>/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="truncate font-display text-xl font-semibold tracking-tight md:text-2xl">
            {title}
          </h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
          >
            View Website
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>

          <Link
            href="/admin/messages"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} unread messages`
                : "Messages inbox"
            }
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
          >
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-accent-secondary px-1 text-[9px] font-bold text-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar + dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
            >
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-full bg-accent-primary/15 text-[10px] font-semibold text-accent-primary"
              >
                {initials(userEmail)}
              </span>
              <ChevronDown
                className={cn(
                  "hidden h-3.5 w-3.5 transition-transform sm:block",
                  menuOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/40"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">
                      Signed in as
                    </p>
                    <p className="mt-0.5 truncate text-sm text-text-primary">
                      {userEmail}
                    </p>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
                    role="menuitem"
                  >
                    <User className="h-4 w-4" aria-hidden />
                    Profile & settings
                  </Link>
                  <form action={signOutAction} className="border-t border-border">
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-secondary transition hover:bg-red-500/5 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" aria-hidden />
                      Sign out
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function derivePageMeta(pathname: string): { title: string; crumbs: Crumb[] } {
  // Exact match against the nav table first.
  const exact = ADMIN_NAV.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname === item.href,
  );
  if (exact) {
    return {
      title: exact.label,
      crumbs: [{ label: "Admin", href: "/admin" }, { label: exact.label }],
    };
  }

  // Find the nearest matching section so we can show a breadcrumb trail.
  const section = ADMIN_NAV.find(
    (item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`),
  );
  if (section) {
    const tail = pathname.slice(section.href.length + 1).split("/")[0] ?? "";
    const subLabel = humanize(tail);
    return {
      title: subLabel || section.label,
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: section.label, href: section.href },
        ...(subLabel ? [{ label: subLabel }] : []),
      ],
    };
  }

  return {
    title: "Admin",
    crumbs: [{ label: "Admin", href: "/admin" }],
  };
}

function humanize(value: string): string {
  if (!value) return "";
  if (value === "new") return "New";
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function initials(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (local.slice(0, 2) || "AD").toUpperCase();
}
