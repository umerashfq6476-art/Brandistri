"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
  description?: string;
}

const iconMap = {
  LayoutDashboard,
  FileText,
  Briefcase,
  Sparkles,
  Mail,
  Settings,
} as const;

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin",          label: "Dashboard",   icon: "LayoutDashboard", description: "Overview & stats" },
  { href: "/admin/blog",     label: "Blog Posts",  icon: "FileText",        description: "Manage articles" },
  { href: "/admin/projects", label: "Projects",    icon: "Briefcase",       description: "Portfolio work" },
  { href: "/admin/services", label: "Services",    icon: "Sparkles",        description: "Offerings & pricing" },
  { href: "/admin/messages", label: "Messages",    icon: "Mail",            description: "Contact inbox" },
  { href: "/admin/settings", label: "Settings",    icon: "Settings",        description: "Site configuration" },
];

interface AdminSidebarProps {
  userEmail: string;
  unreadCount: number;
}

export default function AdminSidebar({ userEmail, unreadCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — only visible below lg */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="font-display text-lg font-bold tracking-tight">
          BRANDISTRI<span className="text-accent-secondary">.</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-md border border-border p-2 text-text-secondary hover:text-text-primary"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop sidebar — fixed 260px */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[260px] lg:flex-col lg:border-r lg:border-border lg:bg-surface">
        <SidebarBody
          pathname={pathname ?? ""}
          userEmail={userEmail}
          unreadCount={unreadCount}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-border bg-surface lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-lg font-bold tracking-tight"
                >
                  BRANDISTRI<span className="text-accent-secondary">.</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-2 text-text-secondary hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarBody
                pathname={pathname ?? ""}
                userEmail={userEmail}
                unreadCount={unreadCount}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarBodyProps {
  pathname: string;
  userEmail: string;
  unreadCount: number;
  onNavigate?: () => void;
}

function SidebarBody({ pathname, userEmail, unreadCount, onNavigate }: SidebarBodyProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand block */}
      <div className="hidden lg:flex items-center justify-between px-6 py-6">
        <Link href="/admin" className="font-display text-xl font-bold tracking-tight">
          BRANDISTRI<span className="text-accent-secondary">.</span>
        </Link>
        <span className="rounded-full border border-accent-primary/40 bg-accent-primary/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-accent-primary">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 lg:py-2">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
          Workspace
        </p>
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = iconMap[item.icon];
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const showUnread = item.href === "/admin/messages" && unreadCount > 0;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                    active
                      ? "bg-accent-primary/10 text-text-primary"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition",
                        active ? "text-accent-primary" : "text-text-muted group-hover:text-text-primary",
                      )}
                      aria-hidden
                    />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {showUnread && (
                    <span
                      aria-label={`${unreadCount} unread`}
                      className="min-w-[20px] rounded-full bg-accent-secondary px-1.5 text-center text-[10px] font-semibold text-black"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Account block */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full bg-accent-primary/15 text-sm font-medium text-accent-primary"
          >
            {initials(userEmail)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-text-muted">Signed in</p>
            <p className="truncate text-sm text-text-primary">{userEmail}</p>
          </div>
        </div>
        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function initials(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (local.slice(0, 2) || "AD").toUpperCase();
}
