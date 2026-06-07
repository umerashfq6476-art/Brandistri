"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";

export default function CaseStudyDesign({ project }: { project: Project }) {
  const gallery = project.gallery ?? [];
  // A mockup tile shows a real gallery image if one exists at that slot,
  // otherwise it falls back to a brand-tinted gradient.
  const tileBackground = (i: number, fallback: string) =>
    gallery[i] ? `url("${gallery[i]}")` : fallback;

  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
          >
            03 — The Craft
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
          >
            Design Direction
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="article-body mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg"
            // Authored in the trusted admin Tiptap editor.
            dangerouslySetInnerHTML={{ __html: project.story }}
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-2xl border border-border bg-surface p-7 md:p-8"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
              Color Palette
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.palette.map((swatch, i) => (
                <motion.div
                  key={swatch.hex}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.06,
                  }}
                  className="group overflow-hidden rounded-xl border border-border bg-background/40"
                >
                  <div
                    className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-xs font-medium text-text-primary">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                      {swatch.hex}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 rounded-2xl border border-border bg-surface p-7 md:p-8"
          >
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
              Typography
            </div>
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-border bg-background/40 p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  Display
                </div>
                <div className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-text-primary">
                  Aa
                </div>
                <div className="mt-2 text-sm text-text-primary/80">
                  {project.typography.display}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  Body
                </div>
                <div className="mt-3 text-4xl font-medium text-text-primary">
                  Aa
                </div>
                <div className="mt-2 text-sm text-text-primary/80">
                  {project.typography.body}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                style={{
                  backgroundImage: tileBackground(
                    i,
                    i === 0
                      ? project.imageUrl
                      : i === 1
                      ? `linear-gradient(135deg, ${project.color} 0%, #1A1A1A 100%)`
                      : `linear-gradient(160deg, #111111 0%, ${project.color} 120%)`,
                  ),
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  Mockup {i + 1} of 3
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: gallery[3]
                ? `url("${gallery[3]}")`
                : `linear-gradient(120deg, ${project.color} 0%, #0A0A0A 60%, ${project.color}33 100%)`,
            }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                Hero Composition
              </div>
              <div className="mt-2 font-display text-2xl md:text-3xl font-semibold text-text-primary">
                {project.title}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
