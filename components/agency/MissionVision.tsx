"use client";

import { motion } from "framer-motion";
import { Compass, Telescope } from "lucide-react";

const cards = [
  {
    icon: Compass,
    label: "Mission",
    title: "What drives us",
    body: "To help businesses build impactful, strategic, and visually powerful brands that create recognition, trust, and digital growth.",
    accent: "primary" as const,
  },
  {
    icon: Telescope,
    label: "Vision",
    title: "Where we're going",
    body: "To become a leading global branding studio that transforms businesses into recognizable, modern, and influential brands.",
    accent: "secondary" as const,
  },
];

export default function MissionVision() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
        >
          Mission & Vision
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-5 max-w-3xl font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
        >
          The compass behind the craft.
        </motion.h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isPrimary = card.accent === "primary";
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                className={`group relative overflow-hidden rounded-3xl border p-8 sm:p-10 transition-colors ${
                  isPrimary
                    ? "border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-surface to-surface hover:border-accent-primary/60"
                    : "border-accent-secondary/30 bg-gradient-to-br from-accent-secondary/[0.08] via-surface to-surface hover:border-accent-secondary/60"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    isPrimary
                      ? "border border-accent-primary/30 bg-accent-primary/15 text-accent-primary"
                      : "border border-accent-secondary/30 bg-accent-secondary/15 text-accent-secondary"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-text-secondary">
                  {card.label}
                </div>
                <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-[-0.01em] text-text-primary">
                  {card.title}
                </h3>
                <p className="mt-5 max-w-md text-base sm:text-lg leading-relaxed text-text-secondary">
                  {card.body}
                </p>

                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] ${
                    isPrimary
                      ? "bg-accent-primary/20"
                      : "bg-accent-secondary/15"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
