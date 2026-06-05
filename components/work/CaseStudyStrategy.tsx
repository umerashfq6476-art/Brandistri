"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  LayoutGrid,
  Rocket,
  Wand2,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { Project, StrategyPoint } from "@/lib/data/projects";

const iconMap: Record<StrategyPoint["iconName"], LucideIcon> = {
  Compass,
  Sparkles,
  LayoutGrid,
  Rocket,
  Wand2,
  Eye,
};

export default function CaseStudyStrategy({ project }: { project: Project }) {
  return (
    <section className="relative border-b border-border bg-background">
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
              02 — The Move
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              Our Strategy
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-8"
          >
            <p className="text-lg md:text-xl leading-relaxed text-text-secondary">
              {project.solution}
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {project.strategy.map((point, i) => {
            const Icon = iconMap[point.iconName];
            return (
              <motion.article
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent-primary/40 hover:bg-surface-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition-colors group-hover:text-accent-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-xl font-semibold leading-none text-accent-primary/30 transition-colors group-hover:text-accent-secondary">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-xl font-semibold leading-tight text-text-primary">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {point.description}
                </p>
                <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-500 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
