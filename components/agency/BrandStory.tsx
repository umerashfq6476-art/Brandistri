"use client";

import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Our Story
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              Why Brandistri Exists
            </motion.h2>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="space-y-6 text-lg leading-relaxed text-text-secondary"
            >
              <p>
                Most businesses have great products and services — but they
                struggle to communicate their value clearly. They look generic,
                inconsistent, and forgettable online.
              </p>
              <p className="text-text-primary">
                Brandistri was built to solve that problem.
              </p>
              <p>
                We combine brand strategy, visual design, and digital execution
                to build brands that are impossible to ignore. Not louder than
                competitors — clearer than them.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
              className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
            >
              {[
                { label: "Founded", value: "2022" },
                { label: "Approach", value: "Senior-only" },
                { label: "Reach", value: "Global" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col bg-surface p-6"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                    {item.label}
                  </span>
                  <span className="mt-3 font-display text-2xl font-semibold text-text-primary">
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
