"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

interface NavbarProps {
  logoUrl?: string;
}

const links: NavLink[] = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/agency", label: "Agency" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isAdminRoute) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-background/30 backdrop-blur-md border-b border-transparent",
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Brandistri home">
            <BrandMark logoUrl={logoUrl} />
          </Link>

          <nav
            className="hidden md:flex items-center gap-9 text-sm"
            aria-label="Primary"
          >
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 transition-colors",
                    active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-px bg-accent-secondary"
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-primary/90"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="h-[72px]" aria-hidden />

      <AnimatePresence>
        {open && (
          <MobileMenu
            links={links}
            pathname={pathname}
            logoUrl={logoUrl}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function BrandMark({ logoUrl }: { logoUrl?: string }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt="Brandistri"
        className="h-8 w-auto max-w-[180px] object-contain"
      />
    );
  }
  return (
    <span className="font-display text-xl font-bold tracking-tight text-text-primary">
      BRANDISTRI<span className="text-accent-secondary">.</span>
    </span>
  );
}

function MobileMenu({
  links,
  pathname,
  logoUrl,
  onClose,
}: {
  links: NavLink[];
  pathname: string;
  logoUrl?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] bg-background md:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" onClick={onClose} aria-label="Brandistri home">
          <BrandMark logoUrl={logoUrl} />
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="container-x mt-8 flex flex-col gap-2" aria-label="Mobile primary">
        {links.map((link, i) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.08 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between border-b border-border py-5 font-display text-3xl",
                  active ? "text-text-primary" : "text-text-secondary",
                )}
              >
                <span>{link.label}</span>
                <ArrowUpRight
                  className={cn(
                    "h-6 w-6 transition-colors",
                    active ? "text-accent-secondary" : "text-text-muted",
                  )}
                />
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.08 + links.length * 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="container-x mt-10"
      >
        <Link
          href="/contact"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-4 text-base font-medium text-white"
        >
          Start a Project
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
