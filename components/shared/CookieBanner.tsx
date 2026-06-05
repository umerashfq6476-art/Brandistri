"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "brandistri:cookie-consent";

type Consent = "accepted" | "declined";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const id = window.setTimeout(() => setVisible(true), 600);
        return () => window.clearTimeout(id);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function record(value: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore — banner just won't suppress next time
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/95 p-5 backdrop-blur-md shadow-xl sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary">
                <Cookie className="h-4 w-4" />
              </span>
              <div className="text-sm leading-relaxed text-text-secondary">
                We use cookies to understand how visitors use the site and to
                improve your experience.{" "}
                <Link
                  href="/privacy"
                  className="text-text-primary underline-offset-4 hover:underline"
                >
                  Privacy policy
                </Link>
                .
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => record("declined")}
                className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => record("accepted")}
                className="inline-flex items-center justify-center rounded-full bg-accent-secondary px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
