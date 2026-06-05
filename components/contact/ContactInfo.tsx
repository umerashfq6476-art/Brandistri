"use client";

import { motion } from "framer-motion";
import { Mail, Clock, Calendar, Instagram, Linkedin, Twitter } from "lucide-react";

type ContactDetail = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
};

const staticDetails: ContactDetail[] = [
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
  },
  {
    icon: Calendar,
    label: "Working hours",
    value: "Mon–Fri, 9am–6pm",
  },
];

const steps = [
  { num: "01", title: "We review your brief" },
  { num: "02", title: "Schedule a strategy call" },
  { num: "03", title: "Receive your proposal" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/brandistri", Icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/brandistri", Icon: Linkedin },
  { label: "Behance", href: "https://behance.net/brandistri", Icon: BehanceIcon },
  { label: "Twitter / X", href: "https://x.com/brandistri", Icon: Twitter },
];

export default function ContactInfo({
  contactEmail = "hello@brandistri.com",
}: {
  contactEmail?: string;
}) {
  const contactDetails: ContactDetail[] = [
    {
      icon: Mail,
      label: "Email",
      value: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    ...staticDetails,
  ];

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-secondary">
          Get in touch
        </span>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-text-primary">
          Start a Conversation
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
          Whether you have a clear brief or a half-formed idea, send it over.
          We reply to every inquiry with a real human read — not a templated
          discovery form.
        </p>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border"
      >
        {contactDetails.map((detail) => {
          const Icon = detail.icon;
          const body = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                  {detail.label}
                </div>
                <div className="mt-1 truncate font-display text-base font-semibold text-text-primary">
                  {detail.value}
                </div>
              </div>
            </>
          );

          return (
            <li key={detail.label} className="bg-surface">
              {detail.href ? (
                <a
                  href={detail.href}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                >
                  {body}
                </a>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4">{body}</div>
              )}
            </li>
          );
        })}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="rounded-2xl border border-border bg-surface p-6 md:p-7"
      >
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
          What happens next
        </div>
        <ol className="mt-5 space-y-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.num}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.25 + i * 0.08,
              }}
              className="flex items-start gap-4"
            >
              <span className="font-display text-2xl font-semibold leading-none text-accent-primary/40">
                {step.num}
              </span>
              <span className="pt-0.5 text-sm font-medium text-text-primary">
                {step.title}
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
          Follow the studio
        </div>
        <div className="mt-4 flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zM6.391 11H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.39 8.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.283 8.061z" />
    </svg>
  );
}
