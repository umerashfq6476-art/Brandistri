"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How long does a branding project take?",
    a: "Brand identity projects typically take 2–4 weeks. Web design projects take 4–8 weeks depending on scope.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with clients globally. All communication is handled remotely via email and video calls.",
  },
  {
    q: "What information do you need to start?",
    a: "We need your business overview, target audience, goals, and any existing brand assets.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes. All packages include revision rounds. Premium packages include unlimited revisions.",
  },
  {
    q: "Can I see your process before starting?",
    a: "Absolutely. Visit our Process page to see exactly how we work from discovery to launch.",
  },
];

export default function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary"
            >
              Common questions.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-5 max-w-sm text-base leading-relaxed text-text-secondary"
            >
              Quick answers to what we get asked most. Anything else, send it
              over in the form above — we&apos;ll get back to you.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <ul className="overflow-hidden rounded-2xl border border-border bg-surface">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <motion.li
                    key={faq.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.05,
                    }}
                    className="border-b border-border last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors hover:bg-surface-2"
                    >
                      <span className="font-display text-lg md:text-xl font-semibold leading-tight text-text-primary">
                        {faq.q}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isOpen
                            ? "border-accent-secondary bg-accent-secondary text-background"
                            : "border-border text-text-secondary group-hover:border-text-secondary group-hover:text-text-primary"
                        }`}
                      >
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex"
                        >
                          <Plus className="h-4 w-4" strokeWidth={2.4} />
                        </motion.span>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-base leading-relaxed text-text-secondary">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
