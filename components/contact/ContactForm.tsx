"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Send,
} from "lucide-react";
import {
  BUDGET_OPTIONS,
  EMAIL_REGEX,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  type BudgetOption,
  type ContactPayload,
  type ServiceOption,
  type TimelineOption,
} from "@/lib/contact";

type Fields = {
  name: string;
  email: string;
  company: string;
  website: string;
  budget: BudgetOption | "";
  timeline: TimelineOption | "";
  description: string;
};

type Errors = Partial<Record<keyof Fields | "service", string>>;

const EMPTY_FIELDS: Fields = {
  name: "",
  email: "",
  company: "",
  website: "",
  budget: "",
  timeline: "",
  description: "",
};

const slideEase = [0.16, 1, 0.3, 1] as const;

export default function ContactForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState<ServiceOption | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateStep2(): boolean {
    const next: Errors = {};
    if (!fields.name.trim()) next.name = "Please tell us your name.";
    if (!fields.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(fields.email.trim()))
      next.email = "That doesn't look like a valid email.";
    if (!fields.budget) next.budget = "Pick a budget range.";
    if (!fields.timeline) next.timeline = "Pick a timeline.";
    if (!fields.description.trim())
      next.description = "Tell us a bit about your project.";
    else if (fields.description.trim().length < 20)
      next.description = "A few more details would help (20+ characters).";
    if (
      fields.website.trim() &&
      !/^https?:\/\/|^www\./i.test(fields.website.trim()) &&
      !/^[\w-]+\.[\w.-]+/i.test(fields.website.trim())
    ) {
      next.website = "Enter a valid URL.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function reset() {
    setStep(1);
    setService(null);
    setFields(EMPTY_FIELDS);
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  }

  async function submit() {
    if (!service) return;
    setStatus("submitting");
    setErrorMessage("");

    const payload: ContactPayload = {
      service,
      name: fields.name.trim(),
      email: fields.email.trim(),
      company: fields.company.trim() || undefined,
      website: fields.website.trim() || undefined,
      budget: fields.budget as BudgetOption,
      timeline: fields.timeline as TimelineOption,
      description: fields.description.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data: { error?: string } = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMessage(
        res.status === 429
          ? "You've sent a few messages already. Please try again in an hour."
          : data.error || "Something went wrong. Please try again.",
      );
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return <SuccessState onReset={reset} email={fields.email.trim()} />;
  }

  return (
    <div className="flex flex-col">
      <ProgressIndicator step={step} />

      <div className="relative mt-8 min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: slideEase }}
            >
              <StepHeading
                eyebrow="Step 1"
                title="What do you need help with?"
                subtitle="Pick the closest fit. You can tell us more in the next step."
              />
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {SERVICE_OPTIONS.map((option) => {
                  const isActive = service === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setService(option)}
                      aria-pressed={isActive}
                      className={`group relative flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-all ${
                        isActive
                          ? "border-accent-secondary bg-accent-secondary/10"
                          : "border-border bg-background/40 hover:border-text-secondary hover:bg-surface-2"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-accent-secondary"
                            : "text-text-primary"
                        }`}
                      >
                        {option}
                      </span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isActive
                            ? "border-accent-secondary bg-accent-secondary text-background"
                            : "border-border text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!service) {
                      setErrors({ service: "Pick a service to continue." });
                      return;
                    }
                    setStep(2);
                  }}
                  disabled={!service}
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              {errors.service && (
                <p className="mt-3 text-right text-xs text-accent-orange">
                  {errors.service}
                </p>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: slideEase }}
            >
              <StepHeading
                eyebrow="Step 2"
                title="Project details"
                subtitle="The more context you can share, the better our reply."
              />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="name"
                  required
                  value={fields.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={fields.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                  autoComplete="email"
                />
                <Input
                  label="Company / Business"
                  name="company"
                  value={fields.company}
                  onChange={(v) => update("company", v)}
                  autoComplete="organization"
                />
                <Input
                  label="Website URL"
                  name="website"
                  value={fields.website}
                  onChange={(v) => update("website", v)}
                  placeholder="https://yourbrand.com"
                  error={errors.website}
                  autoComplete="url"
                />
                <Select
                  label="Project Budget"
                  required
                  value={fields.budget}
                  onChange={(v) => update("budget", v as BudgetOption)}
                  options={[...BUDGET_OPTIONS]}
                  placeholder="Choose a range"
                  error={errors.budget}
                />
                <Select
                  label="Project Timeline"
                  required
                  value={fields.timeline}
                  onChange={(v) => update("timeline", v as TimelineOption)}
                  options={[...TIMELINE_OPTIONS]}
                  placeholder="When do you need it?"
                  error={errors.timeline}
                />
              </div>

              <Textarea
                label="Project Description"
                required
                value={fields.description}
                onChange={(v) => update("description", v)}
                placeholder="Tell us about your business, goals, and what you want to achieve with this project..."
                error={errors.description}
              />

              <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-accent-primary/90 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
                >
                  Review
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: slideEase }}
            >
              <StepHeading
                eyebrow="Step 3"
                title="Almost there — review your details."
                subtitle="Double-check, then send it our way."
              />

              <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                <SummaryRow label="Service" value={service ?? "—"} />
                <SummaryRow label="Name" value={fields.name} />
                <SummaryRow label="Email" value={fields.email} />
                {fields.company && (
                  <SummaryRow label="Company" value={fields.company} />
                )}
                {fields.website && (
                  <SummaryRow label="Website" value={fields.website} />
                )}
                <SummaryRow label="Budget" value={fields.budget || "—"} />
                <SummaryRow label="Timeline" value={fields.timeline || "—"} />
                <SummaryRow
                  label="Description"
                  value={fields.description}
                  multiline
                />
              </div>

              {status === "error" && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent-orange/30 bg-accent-orange/10 p-4 text-sm text-accent-orange">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={status === "submitting"}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "submitting"}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-secondary px-7 py-3.5 text-sm font-semibold text-background transition-all hover:opacity-90 hover:shadow-[0_0_40px_-10px_rgba(173,255,47,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-text-muted">
                By submitting this form you agree to our{" "}
                <a href="/privacy" className="underline hover:text-text-secondary">
                  privacy policy
                </a>
                . We&apos;ll never share your details, and we reply to every
                inquiry within 24 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProgressIndicator({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Project Type", "Project Details", "Confirm & Send"];
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-secondary">
          Step {step} of 3
        </span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-accent-secondary">
          {labels[step - 1]}
        </span>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          initial={false}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.55, ease: slideEase }}
          className="h-full rounded-full bg-accent-secondary"
        />
      </div>
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <span className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-accent-primary">
        {eyebrow}
      </span>
      <h3 className="mt-3 font-display text-2xl md:text-3xl font-semibold leading-[1.1] tracking-[-0.015em] text-text-primary">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
};

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  error,
  autoComplete,
}: InputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent-secondary">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background/40 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:bg-background ${
          error
            ? "border-accent-orange focus:border-accent-orange"
            : "border-border focus:border-accent-primary"
        }`}
      />
      {error && <span className="text-xs text-accent-orange">{error}</span>}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent-secondary">*</span>}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={`w-full appearance-none rounded-xl border bg-background/40 px-4 py-3 pr-10 text-sm transition-colors focus:outline-none focus:bg-background ${
            value ? "text-text-primary" : "text-text-muted"
          } ${
            error
              ? "border-accent-orange focus:border-accent-orange"
              : "border-border focus:border-accent-primary"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-background text-text-primary">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
          aria-hidden
        />
      </div>
      {error && <span className="text-xs text-accent-orange">{error}</span>}
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="mt-4 flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent-secondary">*</span>}
      </span>
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-background/40 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:bg-background ${
          error
            ? "border-accent-orange focus:border-accent-orange"
            : "border-border focus:border-accent-primary"
        }`}
      />
      {error && <span className="text-xs text-accent-orange">{error}</span>}
    </label>
  );
}

function SummaryRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border bg-background/40 px-5 py-4 last:border-b-0 sm:flex-row sm:gap-6">
      <div className="w-32 shrink-0 text-[11px] uppercase tracking-[0.18em] text-text-secondary">
        {label}
      </div>
      <div
        className={`min-w-0 text-sm text-text-primary ${
          multiline ? "whitespace-pre-wrap" : "truncate"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function SuccessState({
  onReset,
  email,
}: {
  onReset: () => void;
  email: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: slideEase }}
      className="flex flex-col items-center py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary"
      >
        <CheckCircle2 className="h-9 w-9" strokeWidth={1.5} />
      </motion.div>
      <h3 className="mt-8 font-display text-3xl md:text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary">
        Thank you!
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
        We&apos;ll be in touch within 24 hours{" "}
        {email ? (
          <>
            at <span className="text-text-primary">{email}</span>
          </>
        ) : (
          "shortly"
        )}{" "}
        with a strategic recommendation and next steps.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-surface-2"
      >
        Send another message
      </button>
    </motion.div>
  );
}
