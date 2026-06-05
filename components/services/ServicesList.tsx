"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { serviceIcons, type Service } from "@/lib/data/services";

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x section-padding">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
        >
          Our Services
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-5 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
        >
          Six services. One cohesive brand system.
        </motion.h2>

        <div className="mt-20 flex flex-col gap-px overflow-hidden rounded-3xl border border-border bg-border">
          {services.map((service, i) => (
            <ServiceRow key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const Icon = serviceIcons[service.iconName];
  const isReversed = index % 2 === 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-surface transition-colors hover:bg-surface-2"
    >
      <div
        className={`grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:p-16 ${
          isReversed ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition-colors group-hover:border-accent-primary/50 group-hover:text-accent-secondary">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
              0{index + 1} — Service
            </span>
          </div>

          <h3 className="mt-7 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary">
            {service.title}
          </h3>
          <p className="mt-4 text-base text-accent-secondary/90 font-medium">
            {service.tagline}
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
            {service.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/services/${service.slug}`}
              className="group/btn inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_30px_-8px_rgba(99,102,241,0.6)]"
            >
              {service.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
            <Link
              href={`/services/${service.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-primary/80 hover:text-text-primary"
            >
              View details
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
            What you get
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {service.deliverables.map((deliverable, di) => (
              <motion.li
                key={deliverable}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: di * 0.04,
                }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-accent-primary/30"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-secondary/15 text-accent-secondary">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm leading-relaxed text-text-primary/90">
                  {deliverable}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-700 group-hover:w-full" />
    </motion.article>
  );
}
