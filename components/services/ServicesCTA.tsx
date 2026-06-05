"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

export default function ServicesCTA() {
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
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
              Free Consultation
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-7 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              Not sure which service <br className="hidden md:block" />
              <span className="text-accent-secondary">you need?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary"
            >
              Book a free 30-minute brand consultation. We&apos;ll review your
              goals, audit your current presence, and recommend the right path
              forward.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/contact?type=consultation"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-8 py-4 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.7)]"
              >
                <Calendar className="h-4 w-4" />
                Book Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-8 py-4 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
              >
                Send us a brief
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
