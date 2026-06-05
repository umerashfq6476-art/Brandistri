"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyChallenge({ project }: { project: Project }) {
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
              01 — The Brief
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              The Challenge
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-8"
          >
            <p className="text-xl md:text-2xl leading-relaxed text-text-primary/90">
              {project.challenge}
            </p>
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-sm text-text-secondary">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span>{project.summary}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
