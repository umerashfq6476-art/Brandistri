"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

/**
 * Admin route error boundary.
 *
 * Catches failures from the dashboard's (and other admin pages') server-side
 * Supabase queries so a dropped connection or RLS error renders a recoverable
 * panel instead of Next.js's default error screen. `reset()` re-runs the
 * failed Server Component render.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the server/console logs for debugging.
    console.error("[admin] route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </div>

        <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We couldn&apos;t load this data. This is usually a temporary
          connection issue — try again in a moment.
        </p>

        {error?.digest && (
          <p className="mt-3 text-[11px] text-text-muted">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          >
            <RotateCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
