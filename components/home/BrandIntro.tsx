"use client";

import { motion } from "framer-motion";
import { Target, Palette, TrendingUp } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Strategy First",
    body: "Every decision starts with business thinking and brand purpose.",
  },
  {
    icon: Palette,
    title: "Premium Design",
    body: "Visual systems crafted for recognition, trust, and memorability.",
  },
  {
    icon: TrendingUp,
    title: "Growth Focused",
    body: "Brands designed to perform and scale across every digital platform.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

export default function BrandIntro() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Who We Are
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              We Are Not Just <br className="hidden sm:block" />
              <span className="text-text-secondary">a Design Agency</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary"
            >
              Brandistri is a strategic branding partner. We combine deep brand
              thinking, visual design, and digital execution to build brands that
              communicate clearly, look premium, and grow confidently across
              every platform.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <BrandVisual />
          </motion.div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                className="group relative rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent-primary/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary ring-1 ring-accent-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {p.body}
                </p>
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.35),0_0_60px_-20px_rgba(99,102,241,0.45)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BrandVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div className="absolute inset-0 rounded-[28px] border border-border bg-surface" />
      <div className="absolute inset-6 rounded-[20px] bg-gradient-to-br from-accent-primary/40 via-accent-primary/10 to-transparent" />
      <div className="absolute inset-6 rounded-[20px] border border-white/5" />

      <div className="absolute left-10 top-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background font-display text-xl font-semibold text-accent-secondary">
        B
      </div>

      <div className="absolute right-8 top-12 rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-text-secondary backdrop-blur">
        Studio · 2026
      </div>

      <div className="absolute inset-x-10 bottom-10 space-y-3">
        <div className="font-display text-2xl font-semibold text-text-primary">
          Brand Systems<br />Built to Scale.
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-primary" />
          <span className="h-2 w-2 rounded-full bg-accent-secondary" />
          <span className="h-2 w-2 rounded-full bg-accent-orange" />
          <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
            Palette
          </span>
        </div>
      </div>

      <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-3xl border border-accent-secondary/40 bg-accent-secondary/10 backdrop-blur-sm" />
    </div>
  );
}
