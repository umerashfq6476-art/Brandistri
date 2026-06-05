"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type Project } from "@/lib/data/projects";

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 3);
  const [primary, second, third] = featured;

  if (featured.length === 0) return null;

  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Our Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              Work That Speaks
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface hover:border-text-primary"
            >
              See All Projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
          {primary && (
            <ProjectTile
              project={primary}
              className="lg:col-span-7 lg:row-span-2"
              size="large"
              index={0}
            />
          )}
          {second && (
            <ProjectTile
              project={second}
              className="lg:col-span-5"
              size="small"
              index={1}
            />
          )}
          {third && (
            <ProjectTile
              project={third}
              className="lg:col-span-5"
              size="small"
              index={2}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  className = "",
  size = "small",
  index = 0,
}: {
  project: Project;
  className?: string;
  size?: "large" | "small";
  index?: number;
}) {
  const aspect = size === "large" ? "aspect-[4/5] lg:aspect-auto" : "aspect-[16/10]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1 + index * 0.08,
      }}
      className={className}
    >
      <Link
        href={`/work/${project.slug}`}
        className={`group relative block h-full overflow-hidden rounded-2xl border border-border bg-surface ${aspect}`}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ backgroundImage: project.imageUrl }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-text-primary backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
              {project.client} · {project.year}
            </div>
            <h3
              className={`mt-2 font-display font-semibold leading-tight text-text-primary ${
                size === "large" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
              {project.description}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white">
            View Project
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
