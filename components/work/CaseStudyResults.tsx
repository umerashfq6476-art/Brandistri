"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyResults({ project }: { project: Project }) {
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
              04 — The Outcome
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              The Results
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-md text-sm md:text-base leading-relaxed text-text-secondary"
          >
            {project.results}
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {project.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent-secondary/40 hover:bg-surface-2"
            >
              <div className="font-display text-5xl md:text-6xl font-semibold leading-none tracking-[-0.02em] text-text-primary transition-colors group-hover:text-accent-secondary">
                {metric.value}
              </div>
              <div className="mt-5 text-[11px] uppercase tracking-[0.22em] text-text-secondary">
                {metric.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {metric.description}
              </p>
              <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        {project.testimonial && project.testimonial.quote && (
        <motion.figure
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-[320px] w-[700px] -translate-x-1/2 rounded-full blur-[140px] opacity-30"
            style={{ backgroundColor: project.color }}
          />
          <Quote
            className="h-10 w-10 text-accent-secondary"
            strokeWidth={1.5}
            aria-hidden
          />
          <blockquote className="mt-6 max-w-3xl font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-[1.2] tracking-[-0.015em] text-text-primary">
            &ldquo;{project.testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <div
              className="h-12 w-12 shrink-0 rounded-full border border-border"
              style={{
                backgroundImage: `linear-gradient(135deg, ${project.color} 0%, #1A1A1A 100%)`,
              }}
              aria-hidden
            />
            <div>
              <div className="font-display text-base font-semibold text-text-primary">
                {project.testimonial.author}
              </div>
              <div className="text-sm text-text-secondary">
                {project.testimonial.role}
              </div>
            </div>
          </figcaption>
        </motion.figure>
        )}
      </div>
    </section>
  );
}
