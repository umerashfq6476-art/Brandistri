"use client";

import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "./primitives";

interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}

/**
 * Small modal confirmation used before destructive actions.
 *
 * - Closes on Escape or backdrop click
 * - Focuses the confirm button by default so Enter triggers it
 * - `loading` keeps the dialog open with the confirm spinner running
 */
export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  loading,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !loading && onCancel()}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/60"
          >
            <div className="flex items-start gap-3">
              {destructive && (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
                  <AlertTriangle className="h-4 w-4" aria-hidden />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2
                  id="confirm-title"
                  className="font-display text-lg font-semibold tracking-tight"
                >
                  {title}
                </h2>
                {description && (
                  <div className="mt-1 text-sm text-text-secondary">
                    {description}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={destructive ? "danger" : "primary"}
                size="md"
                onClick={onConfirm}
                loading={loading}
                autoFocus
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
