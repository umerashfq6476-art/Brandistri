"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { serviceIcons, type Service } from "@/lib/data/services";

export default function SingleServiceHero({ service }: { service: Service }) {
  const Icon = serviceIcons[service.iconName];

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Backdrop />

      <div className="container-x relative pt-28 pb-20 md:pt-32 md:pb-28">
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-secondary"
        >
          <Link href="/" className="hover:text-text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/services" className="hover:text-text-primary">
            Services
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent-secondary">{service.title}</span>
        </motion.nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-primary/30 bg-accent-primary/10 text-accent-primary"
            >
              <Icon className="h-7 w-7" />
            </motion.div>

            <h1 className="mt-8 font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold leading-[1.02] tracking-[-0.025em] text-text-primary">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="block"
              >
                {service.title}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="mt-6 max-w-2xl text-xl md:text-2xl font-medium text-accent-secondary"
            >
              {service.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-text-secondary"
            >
              {service.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
              >
                {service.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface"
              >
                All services
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7">
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">
                Quick details
              </div>
              <dl className="mt-5 space-y-4">
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-text-secondary">Typical timeline</dt>
                  <dd className="font-display text-base font-semibold text-text-primary">
                    4–8 weeks
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-text-secondary">Deliverables</dt>
                  <dd className="font-display text-base font-semibold text-text-primary">
                    {service.deliverables.length}+
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-b border-border pb-3">
                  <dt className="text-sm text-text-secondary">Process steps</dt>
                  <dd className="font-display text-base font-semibold text-text-primary">
                    {service.process.length}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-text-secondary">Engagement</dt>
                  <dd className="font-display text-base font-semibold text-accent-secondary">
                    Senior-led
                  </dd>
                </div>
              </dl>
            </div>
          </motion.aside>
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
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-primary/15 blur-[140px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="pointer-events-none absolute top-40 right-0 -z-10 h-[380px] w-[640px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
    </>
  );
}
