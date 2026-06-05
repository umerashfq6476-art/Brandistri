"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

const skills = [
  "Brand Strategy",
  "Visual Identity",
  "Web Design",
  "Creative Direction",
];

export default function FounderSection() {
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
            The Team
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
          >
            The people behind the brands.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary"
          >
            A senior-led studio. Every client gets direct access to the founder
            and the team actually doing the work.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-16 grid gap-10 overflow-hidden rounded-3xl border border-border bg-surface lg:grid-cols-12"
        >
          <div className="relative lg:col-span-5">
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent-primary/30 via-surface-2 to-accent-secondary/10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[10rem] font-semibold leading-none tracking-tighter text-white/15">
                  B
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                  Founder
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent-secondary">
                  2022 — Present
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-8 sm:p-12 lg:col-span-7 lg:py-14">
            <div className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">
              Founder & Creative Director
            </div>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-[-0.02em] text-text-primary">
              The Brandistri Founder
            </h3>

            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary">
              Strategic brand thinker with expertise in visual identity, web
              design, and digital brand growth. Leads every engagement from
              first conversation through final delivery, with a focus on work
              that ships and brands that perform.
            </p>

            <div className="mt-8">
              <div className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                Areas of focus
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-text-primary/90 transition-colors hover:border-accent-primary/50 hover:text-accent-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_30px_-8px_rgba(99,102,241,0.6)]"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="mailto:mashab@brandistri.com"
                aria-label="Email the founder"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
