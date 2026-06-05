"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyOverview({ project }: { project: Project }) {
  const items = [
    { label: "Client", value: project.client },
    { label: "Services", value: project.tags.join(" · ") },
    { label: "Year / Duration", value: `${project.year} · ${project.duration}` },
  ];

  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="flex flex-col gap-2 bg-surface px-6 py-8 md:px-8"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
                {item.label}
              </span>
              <span className="font-display text-lg md:text-xl font-semibold text-text-primary">
                {item.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
