"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyNext({ next }: { next: Project }) {
  return (
    <section className="relative border-b border-border bg-background">
      <Link href={`/work/${next.slug}`} className="group block">
        <div className="container-x py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-accent-secondary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
            Next Project
          </motion.div>

          <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                {next.category} · {next.client}
              </div>
              <h2 className="mt-3 max-w-3xl font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-[-0.025em] text-text-primary transition-colors group-hover:text-accent-secondary">
                {next.title}
              </h2>
              <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary">
                {next.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-text-primary transition-all group-hover:border-text-primary group-hover:bg-surface-2"
            >
              View Case Study
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative mt-14 aspect-[16/7] overflow-hidden rounded-3xl border border-border"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ backgroundImage: next.imageUrl }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-text-primary backdrop-blur">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: next.color }}
                />
                {next.category}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                {next.year}
              </span>
            </div>
          </motion.div>
        </div>
      </Link>
    </section>
  );
}
