import Link from "next/link";
import { ArrowRight, Briefcase, Compass, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: { index: false, follow: false },
};

const suggestions = [
  {
    href: "/work",
    label: "See selected work",
    description: "Brand identities, websites, films.",
    icon: Briefcase,
  },
  {
    href: "/services",
    label: "Explore services",
    description: "Six disciplines, one cohesive system.",
    icon: Compass,
  },
  {
    href: "/contact",
    label: "Start a conversation",
    description: "We reply within 24 hours.",
    icon: MessageSquare,
  },
];

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Backdrop />

      <div className="container-x relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/40 bg-accent-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
          Error 404
        </span>

        <h1 className="mt-8 font-display text-7xl sm:text-8xl md:text-[140px] font-semibold leading-[0.95] tracking-[-0.03em] text-text-primary">
          <span className="block text-accent-secondary">404</span>
          <span className="mt-2 block text-3xl sm:text-4xl md:text-5xl">
            Page Not Found
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary">
          The page you&apos;re looking for may have moved, been renamed, or
          never existed. Try one of these instead.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
          >
            Back to Home
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
          >
            Report a broken link
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {suggestions.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5 text-left transition-colors hover:border-accent-secondary/50 hover:bg-surface-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition-colors group-hover:text-accent-secondary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-base font-semibold text-text-primary">
                  {label}
                </div>
                <div className="mt-1 text-xs text-text-secondary">
                  {description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-primary/15 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[400px] w-[680px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
    </>
  );
}
