"use client";

import { motion } from "framer-motion";

const words = ["Work", "That", "Builds", "Brands"];

export default function WorkHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <Backdrop />

      <div className="container-x relative flex min-h-[calc(100vh-72px)] flex-col justify-center pt-24 pb-24 md:pt-28 md:pb-32">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-primary/40 bg-accent-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
          Selected Work
        </motion.span>

        <h1 className="mt-8 max-w-5xl font-display text-6xl sm:text-7xl md:text-8xl lg:text-[112px] font-semibold leading-[0.96] tracking-[-0.025em] text-text-primary">
          {words.map((word, i) => (
            <span
              key={word}
              className="inline-block overflow-hidden align-bottom mr-[0.18em]"
            >
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15 + i * 0.1,
                }}
                className={`inline-block ${
                  word === "Brands" ? "text-accent-secondary" : ""
                }`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-text-secondary"
        >
          A collection of brand identities, websites, and digital experiences
          we&apos;ve crafted for businesses worldwide.
        </motion.p>
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
        className="pointer-events-none absolute -top-32 left-0 -z-10 h-[600px] w-[1000px] rounded-full bg-accent-primary/15 blur-[160px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.4 }}
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[420px] w-[700px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 hidden md:block select-none overflow-hidden"
      >
        <span className="font-display font-bold tracking-tighter text-[24vw] leading-none text-white/[0.025]">
          PORTFOLIO
        </span>
      </div>
    </>
  );
}
