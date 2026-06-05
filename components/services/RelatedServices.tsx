"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { serviceIcons, type Service } from "@/lib/data/services";

export default function RelatedServices({
  services,
}: {
  services: Service[];
}) {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              Related Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              Explore more from the studio.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
            >
              All services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.iconName];
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent-primary/40 hover:bg-surface-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary transition-colors group-hover:border-accent-secondary/50 group-hover:text-accent-secondary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-7 font-display text-2xl font-semibold leading-tight text-text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                    {service.summary}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary transition-colors group-hover:text-accent-secondary">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  <div className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent-secondary transition-all duration-500 group-hover:w-full" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
