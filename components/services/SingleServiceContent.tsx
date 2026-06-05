"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/data/services";

export default function SingleServiceContent({ service }: { service: Service }) {
  return (
    <>
      <DeliverablesSection service={service} />
      <ProcessSection service={service} />
      <BenefitsSection service={service} />
    </>
  );
}

function DeliverablesSection({ service }: { service: Service }) {
  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Deliverables
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              What you get
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-5 max-w-sm text-base leading-relaxed text-text-secondary"
            >
              Every engagement ships a clearly defined set of assets and
              documentation, ready to use across your team.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((d, i) => (
                <motion.li
                  key={d}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.05,
                  }}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent-primary/40"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-secondary/15 text-accent-secondary transition-colors group-hover:bg-accent-secondary group-hover:text-background">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="font-display text-lg font-semibold leading-snug text-text-primary">
                    {d}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ service }: { service: Service }) {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
          >
            Our Process
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
          >
            How we run {service.title.toLowerCase()}.
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent-primary/30 hover:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-semibold leading-none text-accent-primary/40 transition-colors group-hover:text-accent-secondary">
                  {step.number}
                </span>
                {i < service.process.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold leading-tight text-text-primary">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ service }: { service: Service }) {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Why It Matters
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              Key benefits
            </motion.h2>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {service.benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent-secondary/40"
            >
              <span className="font-display text-5xl font-semibold leading-none text-accent-primary/30 transition-colors group-hover:text-accent-secondary">
                0{i + 1}
              </span>
              <h3 className="mt-8 font-display text-2xl font-semibold leading-tight text-text-primary">
                {benefit.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                {benefit.description}
              </p>
              <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
