export default function ServicesLoading() {
  return (
    <section className="container-x section-padding">
      <div className="h-3 w-24 animate-pulse rounded bg-surface-2" />
      <div className="mt-5 h-14 w-2/3 max-w-3xl animate-pulse rounded bg-surface-2" />
      <div className="mt-20 flex flex-col gap-px overflow-hidden rounded-3xl border border-border bg-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse bg-surface" />
        ))}
      </div>
    </section>
  );
}
