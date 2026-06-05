"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Button ─────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-primary/90 border border-transparent",
  secondary:
    "bg-accent-secondary text-black hover:bg-accent-secondary/90 border border-transparent",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent",
  outline:
    "bg-surface text-text-primary hover:border-accent-primary/40 border border-border",
  danger:
    "bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

/* ─── Field wrapper (label + helper + error) ─────────────────────────────── */

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  /** Optional content rendered in the top-right corner of the field — e.g. a character counter. */
  trailing?: ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
  trailing,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || trailing) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <label
              htmlFor={htmlFor}
              className="text-xs font-medium uppercase tracking-[0.14em] text-text-secondary"
            >
              {label}
              {required && <span className="ml-1 text-red-400">*</span>}
            </label>
          )}
          {trailing && (
            <span className="text-[10px] text-text-muted">{trailing}</span>
          )}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/* ─── Input / Textarea / Select ───────────────────────────────────────── */

const inputBase =
  "block w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(inputBase, className)} {...rest} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(inputBase, "min-h-[88px] resize-y", className)}
      {...rest}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...rest }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        inputBase,
        "appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-9",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5'/%3E%3C/svg%3E\")",
      }}
      {...rest}
    >
      {children}
    </select>
  );
});

/* ─── Toggle ─────────────────────────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
}: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3.5 py-3 transition",
        disabled
          ? "opacity-60"
          : "cursor-pointer hover:border-accent-primary/30",
      )}
    >
      <div className="min-w-0">
        {label && (
          <p className="text-sm font-medium text-text-primary">{label}</p>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-text-muted">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition",
          checked ? "bg-accent-primary" : "bg-surface-2",
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition",
            checked ? "translate-x-[18px]" : "translate-x-1",
          )}
        />
      </button>
    </label>
  );
}

/* ─── Badge ─────────────────────────────────────────────────────────────── */

interface BadgeProps {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "info" | "muted";
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-surface-2 border-border text-text-secondary",
  success: "bg-accent-secondary/15 border-accent-secondary/40 text-accent-secondary",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  info: "bg-accent-primary/15 border-accent-primary/40 text-accent-primary",
  muted: "bg-background border-border text-text-muted",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
