"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  redirectTo: string;
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Email and password are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (authError) {
      // Avoid exposing whether the email exists — generic message.
      const message =
        authError.message === "Invalid login credentials"
          ? "Wrong email or password. Try again."
          : authError.message;
      setError(message);
      setSubmitting(false);
      return;
    }

    // Full-page navigation (not a soft router.replace) so the auth cookies
    // just written by signInWithPassword are committed and sent with the
    // request. A soft navigation can race the cookie write, causing the
    // server-rendered admin layout to see no user and render its logged-out
    // branch — the sidebar/header go missing until a manual refresh.
    window.location.assign(redirectTo);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/40"
    >
      {/* Brand mark + Admin badge */}
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          BRANDISTRI<span className="text-accent-secondary">.</span>
        </Link>
        <span className="rounded-full border border-accent-primary/40 bg-accent-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-accent-primary">
          Admin
        </span>
      </div>

      <div className="mt-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Enter the admin credentials to access the dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
            Email
          </label>
          <div className="relative">
            <Mail
              aria-hidden
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="block w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 disabled:opacity-60"
              placeholder="you@brandistri.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-[0.14em] text-text-secondary">
            Password
          </label>
          <div className="relative">
            <Lock
              aria-hidden
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="block w-full rounded-xl border border-border bg-background pl-11 pr-12 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30 disabled:opacity-60"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={submitting}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-muted transition hover:text-text-primary hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary px-5 py-3 text-sm font-medium text-white transition",
            "hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-accent-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-text-muted">
        Trouble signing in? Contact your site administrator.
      </div>
    </motion.div>
  );
}
