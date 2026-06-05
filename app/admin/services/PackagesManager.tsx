"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Package, PlusCircle, Save, Star, Trash2 } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
  Toggle,
} from "@/components/admin/ui/primitives";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { DynamicListEditor } from "@/components/admin/editors";
import type { PricePeriod } from "@/lib/supabase/types";
import {
  createPackageAction,
  deletePackageAction,
  updatePackageAction,
  type PackageFormPayload,
} from "./actions";

export interface PackageSummary {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  price_period: PricePeriod;
  features: string[];
  popular: boolean;
  active: boolean;
  display_order: number;
}

const PERIODS: PricePeriod[] = ["one-time", "monthly", "yearly", "custom"];

/** A package in the editor — either a saved row or an unsaved draft (id null). */
interface EditablePackage extends Omit<PackageSummary, "id" | "display_order"> {
  id: string | null;
  localKey: string;
}

function toEditable(pkg: PackageSummary): EditablePackage {
  return {
    id: pkg.id,
    localKey: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    price_label: pkg.price_label,
    price_period: pkg.price_period,
    features: pkg.features,
    popular: pkg.popular,
    active: pkg.active,
  };
}

function emptyDraft(): EditablePackage {
  return {
    id: null,
    localKey: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    description: "",
    price: null,
    price_label: "",
    price_period: "one-time",
    features: [],
    popular: false,
    active: true,
  };
}

interface PackagesManagerProps {
  initialPackages: PackageSummary[];
}

export default function PackagesManager({ initialPackages }: PackagesManagerProps) {
  const [packages, setPackages] = useState<EditablePackage[]>(
    initialPackages.map(toEditable),
  );

  function addDraft() {
    setPackages((prev) => [...prev, emptyDraft()]);
  }

  function removeFromList(localKey: string) {
    setPackages((prev) => prev.filter((p) => p.localKey !== localKey));
  }

  function replaceInList(localKey: string, next: EditablePackage) {
    setPackages((prev) => prev.map((p) => (p.localKey === localKey ? next : p)));
  }

  return (
    <section className="space-y-5 border-t border-border pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Pricing packages
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Manage the tiers shown on the pricing section (e.g. Starter, Growth,
            Premium).
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={addDraft}
          leftIcon={<PlusCircle className="h-4 w-4" aria-hidden />}
        >
          Add package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
            <Package className="h-5 w-5" aria-hidden />
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            No pricing packages yet.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={addDraft}
            className="mt-4"
            leftIcon={<PlusCircle className="h-4 w-4" aria-hidden />}
          >
            Add your first package
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.localKey}
              initial={pkg}
              onSaved={(saved) => replaceInList(pkg.localKey, saved)}
              onRemoved={() => removeFromList(pkg.localKey)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Individual package card ───────────────────────────────────────────── */

interface PackageCardProps {
  initial: EditablePackage;
  onSaved: (next: EditablePackage) => void;
  onRemoved: () => void;
}

function PackageCard({ initial, onSaved, onRemoved }: PackageCardProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<EditablePackage>(initial);
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isNew = draft.id === null;

  function set<K extends keyof EditablePackage>(
    key: K,
    value: EditablePackage[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    const payload: PackageFormPayload = {
      id: draft.id ?? undefined,
      name: draft.name,
      description: draft.description,
      price: draft.price,
      price_label: draft.price_label,
      price_period: draft.price_period,
      features: draft.features,
      popular: draft.popular,
      active: draft.active,
    };

    startSave(async () => {
      if (isNew) {
        const res = await createPackageAction(payload);
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success(res.message ?? "Package created.");
        const savedId = res.data?.id;
        if (savedId) {
          onSaved({ ...draft, id: savedId, localKey: savedId });
        }
        router.refresh();
        return;
      }

      const res = await updatePackageAction(payload);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Package saved.");
      router.refresh();
    });
  }

  function remove() {
    // Unsaved draft → just drop it from the list, no server call.
    if (isNew) {
      setConfirmDelete(false);
      onRemoved();
      return;
    }
    startDelete(async () => {
      const res = await deletePackageAction(draft.id as string);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success(res.message ?? "Package deleted.");
      setConfirmDelete(false);
      onRemoved();
      router.refresh();
    });
  }

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-surface p-5 ${
        draft.popular ? "border-accent-primary/50" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
          <Package className="h-3.5 w-3.5" aria-hidden />
          {isNew ? "New package" : "Package"}
        </span>
        {draft.popular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-accent-primary">
            <Star className="h-2.5 w-2.5" aria-hidden /> Popular
          </span>
        )}
      </div>

      <Field label="Name" required>
        <Input
          value={draft.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Starter"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price" hint="Numeric, leave blank for custom.">
          <Input
            type="number"
            min={0}
            value={draft.price ?? ""}
            onChange={(e) =>
              set("price", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="1500"
          />
        </Field>
        <Field label="Period">
          <Select
            value={draft.price_period}
            onChange={(e) => set("price_period", e.target.value as PricePeriod)}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Price label" hint="Overrides the number, e.g. “Let’s talk”.">
        <Input
          value={draft.price_label ?? ""}
          onChange={(e) => set("price_label", e.target.value || null)}
          placeholder="Custom"
        />
      </Field>

      <Field label="Description">
        <Textarea
          value={draft.description ?? ""}
          onChange={(e) => set("description", e.target.value || null)}
          placeholder="Who this tier is for."
          rows={2}
        />
      </Field>

      <Field label="Features" hint="Add, edit, reorder, or remove items.">
        <DynamicListEditor
          value={draft.features}
          onChange={(f) => set("features", f)}
          itemLabel="feature"
          placeholder="Add a feature…"
          emptyMessage="No features listed yet."
        />
      </Field>

      <Toggle
        checked={draft.popular}
        onChange={(v) => set("popular", v)}
        label="Popular"
        description="Highlight this tier as recommended."
      />
      <Toggle
        checked={draft.active}
        onChange={(v) => set("active", v)}
        label={draft.active ? "Active" : "Inactive"}
        description="Only active packages show on the public site."
      />

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
        <Button
          variant="danger"
          size="sm"
          onClick={() => setConfirmDelete(true)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={save}
          loading={saving}
          leftIcon={<Save className="h-3.5 w-3.5" aria-hidden />}
        >
          {isNew ? "Create" : "Save"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Delete this package?"
        description={
          isNew
            ? "This unsaved package will be discarded."
            : `“${draft.name || "Untitled"}” will be permanently removed.`
        }
        confirmLabel="Delete package"
        loading={deleting}
      />
    </div>
  );
}
