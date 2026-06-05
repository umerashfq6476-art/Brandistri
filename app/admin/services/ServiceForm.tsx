"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, Eye, Save, Trash2 } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Textarea,
  Toggle,
} from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import {
  SlugField,
  DynamicListEditor,
  ProcessStepsEditor,
  BenefitsEditor,
} from "@/components/admin/editors";
import type { ServiceRow } from "@/lib/supabase/types";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
  type ServiceFormPayload,
} from "./actions";

interface ServiceFormProps {
  mode: "new" | "edit";
  initial?: ServiceRow;
}

type FormState = Omit<ServiceFormPayload, "id">;

const EMPTY_INITIAL: FormState = {
  title: "",
  slug: "",
  tagline: null,
  summary: null,
  description: "",
  price_label: null,
  starting_price: null,
  deliverables: [],
  process: [],
  benefits: [],
  active: true,
};

export default function ServiceForm({ mode, initial }: ServiceFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, startDelete] = useTransition();

  const [state, setState] = useState<FormState>(() => {
    if (!initial) return EMPTY_INITIAL;
    return {
      title: initial.title,
      slug: initial.slug,
      tagline: initial.tagline,
      summary: initial.summary,
      description: initial.description,
      price_label: initial.price_label,
      starting_price: initial.starting_price,
      deliverables: initial.deliverables,
      process: initial.process,
      benefits: initial.benefits,
      active: initial.active,
    };
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function submit() {
    if (!state.title.trim()) {
      toast.error("Service title is required.");
      return;
    }
    if (!state.description.trim()) {
      toast.error("A description is required.");
      return;
    }

    startTransition(async () => {
      const payload: ServiceFormPayload = { ...state, id: initial?.id };

      if (mode === "new") {
        const result = await createServiceAction(payload);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message ?? "Saved.");
        if (result.data?.id) {
          router.replace(`/admin/services/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
        return;
      }

      const result = await updateServiceAction(payload);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved.");
      if (result.data?.slug && result.data.slug !== state.slug) {
        set("slug", result.data.slug);
      }
      router.refresh();
    });
  }

  function handleDelete() {
    if (!initial?.id) return;
    startDelete(async () => {
      const result = await deleteServiceAction(initial.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Deleted.");
      router.replace("/admin/services");
    });
  }

  const previewHref = initial ? `/services/${state.slug}` : null;

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All services
          </Link>
          <span className="text-xs text-text-muted">·</span>
          <h1 className="font-display text-lg font-semibold tracking-tight">
            {mode === "new" ? "New service" : "Edit service"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {previewHref && (
            <Link
              href={previewHref}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Preview
              <ExternalLink className="h-3 w-3" aria-hidden />
            </Link>
          )}
          {mode === "edit" && (
            <Button
              variant="danger"
              size="md"
              onClick={() => setPendingDelete(true)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
            >
              Delete
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={submit}
            loading={pending}
            leftIcon={<Save className="h-3.5 w-3.5" aria-hidden />}
          >
            Save service
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main column */}
        <div className="space-y-5">
          <FormSection title="Basics">
            <Field label="Title" required>
              <Input
                value={state.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Brand Identity"
                className="font-display text-lg"
                autoFocus
              />
            </Field>

            <SlugField
              title={state.title}
              slug={state.slug}
              onSlugChange={(s) => set("slug", s)}
              basePath="/services/"
              manuallyEdited={slugManuallyEdited}
              onManualEditChange={setSlugManuallyEdited}
              required
            />

            <Field label="Tagline" hint="Short line shown under the title.">
              <Input
                value={state.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value || null)}
                placeholder="Identities that stick."
              />
            </Field>

            <Field label="Summary" hint="One-sentence overview used in cards.">
              <Textarea
                value={state.summary ?? ""}
                onChange={(e) => set("summary", e.target.value || null)}
                placeholder="A concise overview of the offering."
                rows={2}
              />
            </Field>

            <Field label="Full description" required>
              <Textarea
                value={state.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the service in detail."
                rows={6}
              />
            </Field>
          </FormSection>

          <FormSection
            title="Deliverables"
            subtitle="What the client receives. Add, edit, reorder, or remove items — changes reflect on the public site."
          >
            <DynamicListEditor
              value={state.deliverables}
              onChange={(d) => set("deliverables", d)}
              itemLabel="deliverable"
              placeholder="Add a deliverable…"
              emptyMessage="No deliverables yet. Add the first one."
            />
          </FormSection>

          <FormSection
            title="Process steps"
            subtitle="The stages of how this service is delivered. Drag to reorder."
          >
            <ProcessStepsEditor
              value={state.process}
              onChange={(p) => set("process", p)}
            />
          </FormSection>

          <FormSection
            title="Benefits"
            subtitle="Benefit cards shown on the service page (title + description each)."
          >
            <BenefitsEditor
              value={state.benefits}
              onChange={(b) => set("benefits", b)}
            />
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <FormSection title="Visibility">
            <Toggle
              checked={state.active}
              onChange={(v) => set("active", v)}
              label={state.active ? "Active" : "Inactive"}
              description="Only active services appear on the public site."
            />
          </FormSection>

          <FormSection title="Pricing">
            <Field
              label="Starting price"
              hint="Numeric value, leave blank if quoted."
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">$</span>
                <Input
                  type="number"
                  min={0}
                  value={state.starting_price ?? ""}
                  onChange={(e) =>
                    set(
                      "starting_price",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="4500"
                />
              </div>
            </Field>
            <Field
              label="Price label"
              hint="Display override, e.g. “from $4,500”."
            >
              <Input
                value={state.price_label ?? ""}
                onChange={(e) => set("price_label", e.target.value || null)}
                placeholder="from $4,500"
              />
            </Field>
          </FormSection>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete}
        onCancel={() => setPendingDelete(false)}
        onConfirm={handleDelete}
        title="Delete this service?"
        description="This action cannot be undone."
        confirmLabel="Delete service"
        loading={deleting}
      />
    </div>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-display text-sm font-semibold tracking-tight text-text-primary">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
