"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How long does a typical brand project take?",
    answer:
      "Most identity projects ship in 4–6 weeks, full brand systems with web design land in 8–12 weeks, and ongoing engagements run month-to-month. We confirm the timeline before we start so you can plan launches with confidence.",
  },
  {
    question: "Do I need a brand strategy before identity design?",
    answer:
      "Yes — and we build it in. We never start visual work without first defining positioning, audience, and messaging. If you already have a strategy document, we'll review and refine it before moving into design.",
  },
  {
    question: "Can you work with my existing team or agency?",
    answer:
      "Absolutely. We regularly partner with in-house teams, product designers, and other agencies. We can lead the work, co-create, or hand off a clean system for your team to extend.",
  },
  {
    question: "What does the revision process look like?",
    answer:
      "Each package includes structured revision rounds. We share work in milestones, you give consolidated feedback, and we iterate together. We focus revisions on strategic decisions rather than personal preferences.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. We offer monthly retainers for brand support, content production, and continued design work. Premium packages include 6 months of post-launch support built in.",
  },
];

export default function ServicesFAQ() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-16 lg:grid-cols-12">
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
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            >
              Common questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="mt-5 max-w-md text-base leading-relaxed text-text-secondary"
            >
              Quick answers to the questions we hear most. Have something else
              in mind? Reach out — we&apos;re happy to walk through it.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.question} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors hover:bg-surface-2 sm:px-8 sm:py-7"
      >
        <span className="font-display text-lg sm:text-xl font-semibold text-text-primary">
          {faq.question}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
            open
              ? "border-accent-secondary bg-accent-secondary text-background rotate-45"
              : "border-border text-text-primary group-hover:border-accent-primary/50"
          }`}
        >
          <Plus className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-7 sm:px-8 sm:pb-8">
              <p className="max-w-3xl text-base leading-relaxed text-text-secondary">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
