"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AgencyCTA() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-x section-padding">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-20 sm:px-12 sm:py-24 md:px-16 md:py-28">
          <Backdrop />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-accent-secondary"
            >
              <Sparkles className="h-3 w-3" />
              Work With Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-7 font-display text-4xl sm:text-6xl md:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-text-primary"
            >
              Want to work with us?
              <br />
              <span className="text-accent-secondary">
                Let&apos;s build a brand that grows.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mx-auto mt-7 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary"
            >
              Tell us where you are, where you want to go, and we&apos;ll come
              back with a clear path and a proposal — usually within 48 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-8 py-4 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.7)]"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/work"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-8 py-4 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
              >
                See our work
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent-primary/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-[360px] w-[600px] rounded-full bg-accent-secondary/10 blur-[140px]"
      />
    </>
  );
}
