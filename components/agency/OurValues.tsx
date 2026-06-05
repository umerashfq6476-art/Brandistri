"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Compass,
  Shapes,
  Sparkles,
  Eye,
  Globe2,
  type LucideIcon,
} from "lucide-react";

type Value = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const values: Value[] = [
  {
    icon: Lightbulb,
    title: "Creativity with Purpose",
    body: "Bold ideas, but grounded. Every creative choice serves a business outcome — never decoration for its own sake.",
  },
  {
    icon: Compass,
    title: "Strategy Before Design",
    body: "We think before we make. Positioning, audience, and message lead — design follows with conviction.",
  },
  {
    icon: Shapes,
    title: "Consistency in Everything",
    body: "Systems beat one-off wins. We build brands that hold their shape across teams, time, and platforms.",
  },
  {
    icon: Sparkles,
    title: "Innovation Always",
    body: "We stay sharp on tools, mediums, and craft so our clients get future-ready work, not yesterday's playbook.",
  },
  {
    icon: Eye,
    title: "Clarity Over Complexity",
    body: "If it can be simpler, we make it simpler. Clarity is the most underrated advantage in modern brands.",
  },
  {
    icon: Globe2,
    title: "Digital Excellence",
    body: "Beautiful is the baseline. Performance, accessibility, and conversion are how we measure done.",
  },
];

export default function OurValues() {
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
              Our Values
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              How we work — every day, every project.
            </motion.h2>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <ValueCard key={value.title} value={value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ value, index }: { value: Value; index: number }) {
  const Icon = value.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: (index % 3) * 0.06 + Math.floor(index / 3) * 0.04,
      }}
      className="group relative bg-surface p-8 transition-colors hover:bg-surface-2"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition-colors group-hover:border-accent-secondary/50 group-hover:text-accent-secondary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="mt-6 text-[11px] uppercase tracking-[0.2em] text-text-secondary">
        Value 0{index + 1}
      </div>
      <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-text-primary">
        {value.title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
        {value.body}
      </p>

      <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}
