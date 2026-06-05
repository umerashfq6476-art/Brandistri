"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { PricingTier } from "@/lib/data/adapters";

type Tier = PricingTier;

export default function PricingTiers({ packages }: { packages: PricingTier[] }) {
  if (packages.length === 0) return null;
  const tiers = packages;
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
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
          >
            Packages built to scale with you.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-text-secondary"
          >
            Transparent starting points for every stage of growth. Custom scopes
            and timelines available for every package.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={`relative flex flex-col rounded-3xl border p-8 transition-colors ${
        tier.popular
          ? "border-accent-primary/50 bg-gradient-to-b from-accent-primary/10 to-surface lg:scale-[1.02]"
          : "border-border bg-surface hover:border-accent-primary/30"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-background">
          <Sparkles className="h-3 w-3" />
          Most Popular
        </span>
      )}

      <div className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">
        {tier.name}
      </div>
      <h3 className="mt-3 font-display text-2xl font-semibold text-text-primary">
        {tier.tagline}
      </h3>

      <div className="mt-8 flex items-baseline gap-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
          {tier.priceLabel}
        </span>
      </div>
      <div className="mt-1 font-display text-5xl font-semibold tracking-[-0.02em] text-text-primary">
        {tier.price}
      </div>

      <ul className="mt-8 space-y-3 border-t border-border pt-6">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                tier.popular
                  ? "bg-accent-secondary/20 text-accent-secondary"
                  : "bg-accent-primary/15 text-accent-primary"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-text-primary/90 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={tier.ctaUrl}
        className={`group mt-10 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all ${
          tier.popular
            ? "bg-accent-primary text-white hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.7)]"
            : "border border-border text-text-primary hover:bg-surface-2 hover:border-text-primary"
        }`}
      >
        {tier.cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
