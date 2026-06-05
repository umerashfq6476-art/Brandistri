"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ServicesHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Backdrop />

      <div className="container-x relative flex min-h-[calc(100vh-72px)] flex-col justify-center pt-24 pb-24 md:pt-28 md:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
          What We Offer
        </motion.span>

        <h1 className="mt-8 max-w-5xl font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-semibold leading-[1.02] tracking-[-0.02em] text-text-primary">
          {["Complete", "Brand", "Building", "Services"].map((word, i) => (
            <span key={word} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 + i * 0.08,
                }}
                className={`inline-block ${i === 3 ? "text-accent-secondary" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-text-secondary"
        >
          From brand strategy to digital experience — everything your brand
          needs to look premium and grow confidently.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-text-secondary"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ChevronDown className="h-4 w-4 text-accent-secondary" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

function Backdrop() {
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
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute -top-32 left-1/3 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-primary/15 blur-[140px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[380px] w-[640px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 hidden md:block select-none overflow-hidden"
      >
        <span className="font-display font-bold tracking-tighter text-[24vw] leading-none text-white/[0.025]">
          SERVICES
        </span>
      </div>
    </>
  );
}
