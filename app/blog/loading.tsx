import Section from "@/components/shared/Section";

export default function BlogLoading() {
  return (
    <Section>
      <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
      <div className="mt-4 h-12 w-2/3 max-w-xl animate-pulse rounded bg-surface-2" />
      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-surface-2" />
        ))}
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-[16/10] animate-pulse bg-surface-2" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-32 animate-pulse rounded bg-surface-2" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
