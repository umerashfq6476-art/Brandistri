"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    body: "Understand your business, audience, and goals.",
  },
  {
    number: "02",
    title: "Research & Strategy",
    body: "Market analysis and positioning that drives every decision.",
  },
  {
    number: "03",
    title: "Creative Direction",
    body: "Mood, tone, and visual territory for the brand.",
  },
  {
    number: "04",
    title: "Design & Development",
    body: "Identity systems, websites, and assets crafted from scratch.",
  },
  {
    number: "05",
    title: "Delivery & Assets",
    body: "Brand guidelines and production-ready files for every channel.",
  },
  {
    number: "06",
    title: "Launch & Growth",
    body: "Roll out, measure, and scale your brand across platforms.",
  },
];

export default function ProcessPreview() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              How We Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              The Brandistri Method
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link
              href="/agency#process"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              See Full Process
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-14">
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0 md:[-ms-overflow-style:none] md:[scrollbar-width:none]">
            <div className="grid min-w-[1100px] grid-cols-6 gap-6 md:min-w-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.06,
                  }}
                  className="group relative rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent-primary/50 hover:bg-surface-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-semibold text-accent-primary transition-colors group-hover:text-accent-secondary">
                      {step.number}
                    </span>
                    <span className="h-px w-6 bg-border transition-colors group-hover:bg-accent-secondary" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {step.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
