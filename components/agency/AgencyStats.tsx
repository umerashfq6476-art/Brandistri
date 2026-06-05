"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Brands Built" },
  { value: "6", label: "Core Services" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "Global", label: "Client Base" },
];

export default function AgencyStats() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="group flex flex-col items-center justify-center bg-surface px-6 py-14 text-center transition-colors hover:bg-surface-2"
            >
              <div className="font-display text-5xl md:text-6xl font-semibold tracking-[-0.02em] text-text-primary transition-colors group-hover:text-accent-secondary">
                {stat.value}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-text-secondary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
