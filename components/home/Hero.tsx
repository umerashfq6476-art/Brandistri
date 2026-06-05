"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Marquee from "@/components/home/Marquee";

const headline = [
  ["We", "Build", "Brands"],
  ["That", "Look", "Powerful"],
  ["&", "Grow", "Digitally"],
];

const proofPoints = ["50+ Brands Built", "100% Client Satisfaction", "Global Clients"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <BackgroundDecor />

      <div className="container-x relative flex min-h-[calc(100vh-72px)] flex-col justify-center pt-16 pb-20 md:pt-24 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center md:justify-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/40 bg-accent-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
            Strategic Branding Studio
          </span>
        </motion.div>

        <h1 className="mt-8 text-center md:text-left font-display font-semibold leading-[0.95] tracking-[-0.02em] text-text-primary text-[14vw] sm:text-7xl md:text-8xl lg:text-[100px]">
          {headline.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.map((word, wordIdx) => {
                const delay = 0.15 + (lineIdx * line.length + wordIdx) * 0.08;
                const isAccent =
                  (lineIdx === 1 && word === "Powerful") ||
                  (lineIdx === 2 && word === "Digitally");
                return (
                  <span
                    key={`${lineIdx}-${wordIdx}`}
                    className="inline-block overflow-hidden align-bottom"
                  >
                    <motion.span
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                        delay,
                      }}
                      className={`inline-block pr-[0.22em] ${
                        isAccent ? "text-accent-secondary" : ""
                      }`}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
          className="mt-8 max-w-2xl text-center md:text-left text-base md:text-lg leading-relaxed text-text-secondary mx-auto md:mx-0"
        >
          Brandistri creates strategic brand identities, websites, digital content,
          and visual experiences that help businesses stand out and scale confidently.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="mt-10 flex flex-col items-center md:items-start sm:flex-row gap-4"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-7 py-4 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
          >
            Start Your Brand
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-4 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface"
          >
            View Our Work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.35 }}
          className="mt-14 flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-sm text-text-secondary"
        >
          {proofPoints.map((point, i) => (
            <div key={point} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="hidden sm:inline-block h-1 w-1 rounded-full bg-text-muted" />
              )}
              <span className="font-medium text-text-primary">{point}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <Marquee />
    </section>
  );
}

function BackgroundDecor() {
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
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-accent-primary/10 blur-[140px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="pointer-events-none absolute bottom-0 right-[-10%] -z-10 h-[420px] w-[700px] rounded-full bg-accent-secondary/10 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-0 right-0 -z-10 hidden md:block select-none overflow-hidden text-center"
      >
        <span className="font-display font-bold tracking-tighter text-[28vw] leading-none text-white/[0.025]">
          BRANDISTRI
        </span>
      </div>
    </>
  );
}
