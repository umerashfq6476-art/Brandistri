import Link from "next/link";
import Section from "@/components/shared/Section";

export default function ProjectNotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text-primary">
          Case study not found
        </h1>
        <p className="mt-4 text-text-secondary">
          This project may have been unpublished or moved. Explore the rest of
          our portfolio instead.
        </p>
        <Link
          href="/work"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-primary/90"
        >
          View all work
        </Link>
      </div>
    </Section>
  );
}
