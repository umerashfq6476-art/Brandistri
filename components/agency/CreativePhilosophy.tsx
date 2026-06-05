"use client";

import { motion } from "framer-motion";

const philosophies = [
  {
    number: "01",
    title: "Strategy Before Design",
    body: "We never pick up a design tool before understanding your business, your audience, and your goals. Strategy is the upstream work that makes every creative decision cheaper, faster, and stronger.",
  },
  {
    number: "02",
    title: "Purpose Before Aesthetics",
    body: "Beautiful brands that don't communicate or convert are decoration. We build brands with purpose — designed to be understood at a glance and to move customers forward.",
  },
  {
    number: "03",
    title: "Growth Before Awards",
    body: "We measure success by client results — not design awards. Your growth is our portfolio. The brands we build are designed to win in the market first, in the gallery second.",
  },
];

export default function CreativePhilosophy() {
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
            Creative Philosophy
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
          >
            How We Think
          </motion.h2>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-3">
          {philosophies.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="group relative flex flex-col border-t border-border pt-8"
            >
              <span className="font-display text-6xl md:text-7xl font-semibold leading-none text-accent-primary/40 transition-colors group-hover:text-accent-secondary">
                {p.number}
              </span>
              <h3 className="mt-7 font-display text-2xl md:text-3xl font-semibold leading-tight tracking-[-0.01em] text-text-primary">
                {p.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
