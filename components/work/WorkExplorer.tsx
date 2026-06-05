"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import ProjectCard from "./ProjectCard";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/lib/data/projects";

export default function WorkExplorer({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory>("All Projects");

  const counts = useMemo(() => {
    const map = new Map<ProjectCategory, number>();
    map.set("All Projects", projects.length);
    for (const c of projectCategories) {
      if (c === "All Projects") continue;
      map.set(c, projects.filter((p) => p.category === c).length);
    }
    return map;
  }, [projects]);

  const filtered = useMemo(() => {
    if (active === "All Projects") return projects;
    return projects.filter((p) => p.category === active);
  }, [active, projects]);

  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x section-padding">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Explore
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              Browse by discipline.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-text-secondary"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-accent-secondary" />
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          </motion.div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {projectCategories.map((category, i) => {
            const isActive = active === category;
            return (
              <motion.button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2 + i * 0.04,
                }}
                className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-accent-secondary bg-accent-secondary text-background"
                    : "border-border bg-surface text-text-primary hover:border-text-primary hover:bg-surface-2"
                }`}
                aria-pressed={isActive}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                    isActive
                      ? "bg-background/15 text-background"
                      : "bg-background/60 text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {counts.get(category) ?? 0}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-14 rounded-2xl border border-border bg-surface p-12 text-center text-text-secondary">
            No projects in this category yet — check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
