"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  { label: "Brand Identity", href: "/services/brand-identity" },
  { label: "Brand Strategy", href: "/services/brand-strategy" },
  { label: "Web Design", href: "/services/web-design" },
  { label: "Social Media Branding", href: "/services/social-media-branding" },
  { label: "Video Editing", href: "/services/video-content" },
  { label: "Business Branding", href: "/services/business-branding" },
];

const company = [
  { label: "About", href: "/agency" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Process", href: "/agency#process" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/brandistri", Icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com/company/brandistri", Icon: Linkedin },
  { label: "Behance", href: "https://behance.net/brandistri", Icon: BehanceIcon },
  { label: "Twitter / X", href: "https://x.com/brandistri", Icon: Twitter },
];

export default function Footer({
  contactEmail = "mashab@brandistri.com",
}: {
  contactEmail?: string;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-background text-text-primary border-t border-border">
      <FooterCTA />

      <div className="container-x py-16 lg:py-20 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            BRANDISTRI<span className="text-accent-secondary">.</span>
          </Link>
          <p className="mt-4 text-sm text-text-secondary max-w-xs leading-relaxed">
            A strategic branding and creative studio helping businesses build modern,
            growth-focused brands.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Services" items={services} />
        <FooterColumn title="Company" items={company} />

        <div>
          <div className="font-display text-sm font-medium uppercase tracking-wider text-text-secondary">
            Contact
          </div>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-5 block text-lg font-medium text-text-primary hover:text-accent-secondary transition-colors"
          >
            {contactEmail}
          </a>
          <p className="mt-2 text-xs text-text-muted">
            We reply within 1 business day.
          </p>

          <div className="mt-6">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-text-muted">
          <span>&copy; 2025 Brandistri. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">·</span>
            <Link href="/terms" className="hover:text-text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCTA() {
  return (
    <section className="border-b border-border">
      <div className="container-x section-padding text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight text-balance"
        >
          Ready to Build <span className="text-accent-secondary">Your Brand?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-text-secondary"
        >
          Let&apos;s create something powerful together.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-7 py-4 text-base font-medium text-white transition-colors hover:bg-accent-primary/90"
          >
            Start a Project
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="font-display text-sm font-medium uppercase tracking-wider text-text-secondary">
        {title}
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-text-primary/90 hover:text-accent-secondary transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email for newsletter"
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-secondary"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "rounded-full bg-accent-secondary px-4 py-2.5 text-sm font-medium text-background transition-opacity",
            status === "loading" ? "opacity-60" : "hover:opacity-90",
          )}
        >
          {status === "loading" ? "..." : "Join"}
        </button>
      </div>
      {status === "ok" && (
        <p className="text-xs text-accent-secondary">You&apos;re on the list.</p>
      )}
      {status === "err" && (
        <p className="text-xs text-accent-orange">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zM6.391 11H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.39 8.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.283 8.061z" />
    </svg>
  );
}
