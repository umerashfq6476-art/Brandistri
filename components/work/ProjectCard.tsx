"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: Math.min(index, 6) * 0.06,
      }}
      className="h-full"
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent-primary/40"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.05]"
            style={{ backgroundImage: project.imageUrl }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="absolute left-5 top-5 z-10">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-text-primary backdrop-blur"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.category}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
              {project.client} · {project.year}
            </div>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold leading-tight text-text-primary">
              {project.title}
            </h3>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {project.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent-secondary">
                  View Case Study
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-700 group-hover:w-full" />
      </Link>
    </motion.div>
  );
}
