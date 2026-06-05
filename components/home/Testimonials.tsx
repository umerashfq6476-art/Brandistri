"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Brandistri rebuilt our identity from the ground up. The new system is sharper, more confident, and finally feels like the company we're actually becoming.",
    name: "Amara Okafor",
    role: "Founder, Lumen Energy",
    initials: "AO",
    accent: "#6366F1",
  },
  {
    quote:
      "They treat strategy and design as one conversation. We left with a brand that doesn't just look good — it answers real positioning questions our team had been ducking.",
    name: "Daniel Reyes",
    role: "CMO, Atlas Finance",
    initials: "DR",
    accent: "#ADFF2F",
  },
  {
    quote:
      "Premium work, no nonsense. Brandistri shipped a launch site and brand system that our investors and customers both noticed inside the first week.",
    name: "Priya Shah",
    role: "CEO, Verdant Skin",
    initials: "PS",
    accent: "#FF6B35",
  },
];

export default function Testimonials() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
          >
            Client Results
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent-primary/40"
            >
              <Quote
                aria-hidden
                className="absolute right-7 top-7 h-10 w-10 text-accent-primary/15"
              />

              <div className="flex items-center gap-1 text-accent-secondary">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote className="mt-6 flex-1 text-base leading-relaxed text-text-primary">
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-semibold text-background"
                  style={{ backgroundColor: t.accent }}
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    {t.name}
                  </div>
                  <div className="text-xs text-text-secondary">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
