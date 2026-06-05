/**
 * Dashboard loading skeleton.
 *
 * Rendered by Next.js as the Suspense fallback while the dashboard's
 * server-side Supabase queries resolve. The shapes mirror app/admin/page.tsx
 * so the layout doesn't shift when real data swaps in.
 *
 * Pure CSS (Tailwind `animate-pulse`) — no client JS — so it streams
 * instantly before hydration.
 */
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading dashboard…</span>

      {/* Stats row */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <Shimmer className="h-2.5 w-16" />
                  <Shimmer className="h-3.5 w-24" />
                  <Shimmer className="h-9 w-20" />
                  <Shimmer className="h-2.5 w-28" />
                </div>
                <Shimmer className="h-10 w-10 shrink-0 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Messages + quick actions */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface lg:col-span-2">
          <PanelHeader />
          <ul className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Shimmer className="h-3.5 w-40" />
                  <Shimmer className="h-2.5 w-28" />
                </div>
                <Shimmer className="h-2.5 w-16 shrink-0" />
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-2xl border border-border bg-surface">
          <PanelHeader />
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </aside>
      </section>

      {/* Recent activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="rounded-2xl border border-border bg-surface">
            <PanelHeader />
            <ul className="divide-y divide-border">
              {Array.from({ length: col === 0 ? 5 : 3 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Shimmer className="h-3.5 w-48" />
                    <Shimmer className="h-2.5 w-32" />
                  </div>
                  <Shimmer className="h-2.5 w-10 shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

function PanelHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="space-y-2">
        <Shimmer className="h-4 w-36" />
        <Shimmer className="h-2.5 w-24" />
      </div>
      <Shimmer className="h-6 w-20 rounded-full" />
    </div>
  );
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface-2 ${className}`}
      aria-hidden
    />
  );
}
