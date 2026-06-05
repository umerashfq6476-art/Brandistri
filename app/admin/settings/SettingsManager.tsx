"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  Building2,
  Globe,
  Save,
  Search,
  ShieldCheck,
  MailCheck,
} from "lucide-react";
import { Button, Field, Input, Textarea, Toggle } from "@/components/admin/ui/primitives";
import LogoUploader from "@/components/admin/LogoUploader";
import {
  changePasswordAction,
  saveBusinessSettingsAction,
  saveContactSettingsAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction,
  signOutAllSessionsAction,
} from "./actions";
import type { SiteSettings } from "@/lib/settings";

interface SettingsManagerProps {
  initialSettings: SiteSettings;
  adminEmail: string;
  lastSignIn: string | null;
}

export default function SettingsManager({
  initialSettings,
  adminEmail,
  lastSignIn,
}: SettingsManagerProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <BusinessSection initial={initialSettings.business} />
      <SocialSection initial={initialSettings.social} />
      <SeoSection initial={initialSettings.seo} />
      <ContactSection initial={initialSettings.contact} />
      <SecuritySection adminEmail={adminEmail} lastSignIn={lastSignIn} />
    </div>
  );
}

/* ─── Shared section shell ──────────────────────────────────────────────── */

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-background text-accent-primary">
          {icon}
        </span>
        <div>
          <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function SaveBar({ loading }: { loading: boolean }) {
  return (
    <div className="flex justify-end pt-1">
      <Button type="submit" loading={loading} leftIcon={<Save className="h-3.5 w-3.5" aria-hidden />}>
        Save changes
      </Button>
    </div>
  );
}

/* ─── 1. Business information ───────────────────────────────────────────── */

function BusinessSection({ initial }: { initial: SiteSettings["business"] }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveBusinessSettingsAction(form);
      if (!res.ok) return void toast.error(res.error);
      toast.success(res.message ?? "Saved.");
      router.refresh();
    });
  }

  return (
    <SectionCard
      icon={<Building2 className="h-4 w-4" aria-hidden />}
      title="Business Information"
      description="Core details used across the site and emails."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Logo"
          hint="Shown in the site navigation. Leave empty to use the text wordmark."
        >
          <LogoUploader
            value={form.logoUrl || null}
            onChange={(url) => setForm({ ...form, logoUrl: url ?? "" })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Agency name" required htmlFor="biz-name">
            <Input
              id="biz-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Contact email" required htmlFor="biz-email">
            <Input
              id="biz-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Tagline" htmlFor="biz-tagline">
          <Input
            id="biz-tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="biz-phone">
            <Input
              id="biz-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Optional"
            />
          </Field>
          <Field label="Business address" htmlFor="biz-address">
            <Input
              id="biz-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Optional"
            />
          </Field>
        </div>
        <Toggle
          label="Open to new projects"
          description="Show an availability badge on the public site."
          checked={form.available}
          onChange={(v) => setForm({ ...form, available: v })}
        />
        <SaveBar loading={saving} />
      </form>
    </SectionCard>
  );
}

/* ─── 2. Social media links ─────────────────────────────────────────────── */

function SocialSection({ initial }: { initial: SiteSettings["social"] }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveSocialSettingsAction(form);
      if (!res.ok) return void toast.error(res.error);
      toast.success(res.message ?? "Saved.");
      router.refresh();
    });
  }

  const fields: Array<{ key: keyof SiteSettings["social"]; label: string; placeholder: string }> = [
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/…" },
    { key: "behance", label: "Behance", placeholder: "https://behance.net/…" },
    { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/…" },
    { key: "github", label: "GitHub", placeholder: "https://github.com/…" },
  ];

  return (
    <SectionCard
      icon={<Globe className="h-4 w-4" aria-hidden />}
      title="Social Media Links"
      description="Profile URLs linked in the footer."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.key} label={f.label} htmlFor={`social-${f.key}`}>
              <Input
                id={`social-${f.key}`}
                type="url"
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            </Field>
          ))}
        </div>
        <SaveBar loading={saving} />
      </form>
    </SectionCard>
  );
}

/* ─── 3. SEO defaults ───────────────────────────────────────────────────── */

function SeoSection({ initial }: { initial: SiteSettings["seo"] }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveSeoSettingsAction(form);
      if (!res.ok) return void toast.error(res.error);
      toast.success(res.message ?? "Saved.");
      router.refresh();
    });
  }

  return (
    <SectionCard
      icon={<Search className="h-4 w-4" aria-hidden />}
      title="SEO Defaults"
      description="Fallback metadata for pages without their own."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Default meta title"
          htmlFor="seo-title"
          trailing={`${form.defaultTitle.length} / 60`}
          hint="Use %s as a placeholder for the page title if desired."
        >
          <Input
            id="seo-title"
            value={form.defaultTitle}
            onChange={(e) => setForm({ ...form, defaultTitle: e.target.value })}
          />
        </Field>
        <Field
          label="Default meta description"
          htmlFor="seo-desc"
          trailing={`${form.defaultDescription.length} / 160`}
        >
          <Textarea
            id="seo-desc"
            rows={3}
            value={form.defaultDescription}
            onChange={(e) => setForm({ ...form, defaultDescription: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Google Analytics ID" htmlFor="seo-ga">
            <Input
              id="seo-ga"
              value={form.gaId}
              onChange={(e) => setForm({ ...form, gaId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </Field>
          <Field label="Favicon URL" htmlFor="seo-favicon">
            <Input
              id="seo-favicon"
              type="url"
              value={form.faviconUrl}
              onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
              placeholder="https://…/favicon.ico"
            />
          </Field>
        </div>
        <SaveBar loading={saving} />
      </form>
    </SectionCard>
  );
}

/* ─── 4. Contact form settings ──────────────────────────────────────────── */

function ContactSection({ initial }: { initial: SiteSettings["contact"] }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveContactSettingsAction(form);
      if (!res.ok) return void toast.error(res.error);
      toast.success(res.message ?? "Saved.");
      router.refresh();
    });
  }

  return (
    <SectionCard
      icon={<MailCheck className="h-4 w-4" aria-hidden />}
      title="Contact Form Settings"
      description="Control submissions and notifications."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Notification email"
          htmlFor="contact-notify"
          hint="Where new submissions are emailed. Defaults to the contact email."
        >
          <Input
            id="contact-notify"
            type="email"
            value={form.notificationEmail}
            onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
          />
        </Field>
        <Field label="Auto-reply message" htmlFor="contact-reply">
          <Textarea
            id="contact-reply"
            rows={4}
            value={form.autoReply}
            onChange={(e) => setForm({ ...form, autoReply: e.target.value })}
          />
        </Field>
        <Toggle
          label="Contact form active"
          description="Turn off to stop accepting new submissions."
          checked={form.formActive}
          onChange={(v) => setForm({ ...form, formActive: v })}
        />
        <SaveBar loading={saving} />
      </form>
    </SectionCard>
  );
}

/* ─── 5. Account security ───────────────────────────────────────────────── */

function SecuritySection({
  adminEmail,
  lastSignIn,
}: {
  adminEmail: string;
  lastSignIn: string | null;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    start(async () => {
      const res = await changePasswordAction(current, next);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success(res.message ?? "Password updated.");
      setCurrent("");
      setNext("");
      setConfirm("");
    });
  }

  return (
    <SectionCard
      icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
      title="Account Security"
      description="Manage your admin credentials and sessions."
    >
      <dl className="space-y-2 rounded-xl border border-border bg-background p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-muted">Admin email</dt>
          <dd className="truncate text-text-primary">{adminEmail}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-text-muted">Last sign-in</dt>
          <dd className="text-text-primary">
            {lastSignIn ? format(new Date(lastSignIn), "PPpp") : "—"}
          </dd>
        </div>
      </dl>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Current password" htmlFor="pw-current" required>
          <Input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New password" htmlFor="pw-new" required>
            <Input
              id="pw-new"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </Field>
          <Field label="Confirm new password" htmlFor="pw-confirm" required error={error ?? undefined}>
            <Input
              id="pw-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={saving} leftIcon={<Save className="h-3.5 w-3.5" aria-hidden />}>
            Update password
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-xs text-text-muted">
          Sign out everywhere if you suspect your session was compromised.
        </p>
        <form action={signOutAllSessionsAction}>
          <Button type="submit" variant="danger" size="sm">
            Sign out all sessions
          </Button>
        </form>
      </div>
    </SectionCard>
  );
}
