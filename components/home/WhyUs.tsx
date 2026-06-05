"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    number: "01",
    title: "Strategy Before Design",
    body: "We think before we create. Every design decision is backed by brand strategy and business goals.",
  },
  {
    number: "02",
    title: "Full Brand Ecosystem",
    body: "From logo to website to content — we handle the complete brand journey under one studio.",
  },
  {
    number: "03",
    title: "Modern & Premium Output",
    body: "No templates. No shortcuts. Every project is crafted from scratch with premium standards.",
  },
  {
    number: "04",
    title: "Growth-Oriented Thinking",
    body: "We build brands that don't just look good — they perform, convert, and grow.",
  },
];

const stats = [
  { value: "50+", label: "Projects" },
  { value: "3+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction" },
  { value: "Global", label: "Clients" },
];

export default function WhyUs() {
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
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
          >
            Why Businesses Choose Brandistri
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: (i % 2) * 0.08 + Math.floor(i / 2) * 0.06,
              }}
              className="group relative flex gap-6 border-t border-border pt-8"
            >
              <span className="font-display text-5xl md:text-6xl font-semibold leading-none text-accent-primary/40 transition-colors group-hover:text-accent-secondary">
                {reason.number}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight text-text-primary">
                  {reason.title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
                  {reason.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-surface px-6 py-10 text-center"
            >
              <div className="font-display text-4xl md:text-5xl font-semibold text-text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
