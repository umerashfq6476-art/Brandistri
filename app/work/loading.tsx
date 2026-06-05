export default function WorkLoading() {
  return (
    <section className="container-x section-padding">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
      <div className="mt-5 h-14 w-2/3 max-w-2xl animate-pulse rounded bg-surface-2" />
      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-surface-2" />
        ))}
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-2xl border border-border bg-surface"
          />
        ))}
      </div>
    </section>
  );
}
