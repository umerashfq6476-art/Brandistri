"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Mail,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  Mail,
  Sparkles,
};

export interface StatCardProps {
  label: string;
  value: number | string;
  /** Small label above the number, e.g. "Total". */
  prefix?: string;
  /** Detail line shown beneath the value, e.g. "12 published · 3 drafts". */
  detail?: string;
  icon: keyof typeof iconMap;
  /** Highlights the card with the accent color — used for unread messages. */
  accent?: boolean;
  /** Stagger order for the entrance animation. */
  index?: number;
  /** When provided, the whole card becomes a link. */
  href?: string;
}

export function StatCard({
  label,
  value,
  prefix,
  detail,
  icon,
  accent = false,
  index = 0,
  href,
}: StatCardProps) {
  const Icon = iconMap[icon];

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-surface p-5 transition",
        accent
          ? "border-accent-secondary/40 hover:border-accent-secondary/70"
          : "border-border hover:border-accent-primary/40",
        href && "cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {prefix && (
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">
              {prefix}
            </p>
          )}
          <p className="mt-1 text-sm text-text-secondary">{label}</p>
          <p
            className={cn(
              "mt-3 font-display text-4xl font-semibold leading-none tracking-tight",
              accent ? "text-accent-secondary" : "text-text-primary",
            )}
          >
            {value}
          </p>
          {detail && (
            <p className="mt-3 text-xs text-text-muted">{detail}</p>
          )}
        </div>

        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
            accent
              ? "border-accent-secondary/40 bg-accent-secondary/10 text-accent-secondary"
              : "border-border bg-background text-text-secondary",
          )}
          aria-hidden
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
        </div>
      </div>

      {/* Subtle accent glow on hover */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          accent ? "bg-accent-secondary/20" : "bg-accent-primary/20",
        )}
      />
    </motion.div>
  );

  if (href) {
    // We deliberately don't import Link here to keep this component cheap —
    // the dashboard wraps cards in <Link> when needed.
    return inner;
  }
  return inner;
}
