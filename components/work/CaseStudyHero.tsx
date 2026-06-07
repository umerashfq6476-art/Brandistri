"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Backdrop color={project.color} />

      <div className="container-x relative pt-28 pb-12 md:pt-32 md:pb-16">
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-secondary"
        >
          <Link href="/" className="hover:text-text-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/work" className="hover:text-text-primary">
            Work
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-accent-secondary">{project.category}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-10 flex items-center gap-3"
        >
          <span
            className="inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
            {project.category} · Case Study
          </span>
        </motion.div>

        <h1 className="mt-6 max-w-5xl font-display text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-semibold leading-[0.98] tracking-[-0.025em] text-text-primary">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="block"
          >
            {project.title}
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container-x relative pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: project.imageUrl }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 md:p-12">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
                Client
              </div>
              <div className="mt-1 font-display text-xl md:text-2xl font-semibold text-text-primary">
                {project.client}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
                Year
              </div>
              <div className="mt-1 font-display text-xl md:text-2xl font-semibold text-text-primary">
                {project.year}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Backdrop({ color }: { color: string }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute -top-32 left-0 -z-10 h-[520px] w-[900px] rounded-full blur-[160px]"
        style={{ backgroundColor: color }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[380px] w-[640px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
    </>
  );
}
