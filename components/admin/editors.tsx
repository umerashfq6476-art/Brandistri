"use client";

import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Plus, X } from "lucide-react";
import { slugify } from "@/lib/supabase/storage";
import type { ProcessStep, ProjectMetric, ServiceBenefit } from "@/lib/supabase/types";
import { Field, Input, Textarea } from "./ui/primitives";

/* ─── SlugField — auto-generates from a title, editable, with live preview ─ */

interface SlugFieldProps {
  title: string;
  slug: string;
  onSlugChange: (value: string) => void;
  basePath?: string;
  manuallyEdited: boolean;
  onManualEditChange: (next: boolean) => void;
  required?: boolean;
}

export function SlugField({
  title,
  slug,
  onSlugChange,
  basePath = "/blog/",
  manuallyEdited,
  onManualEditChange,
  required,
}: SlugFieldProps) {
  // Auto-derive slug from title unless the admin has touched it directly.
  useEffect(() => {
    if (manuallyEdited) return;
    const next = slugify(title || "");
    if (next !== slug) onSlugChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, manuallyEdited]);

  return (
    <Field
      label="Slug"
      hint={`Preview: ${basePath}${slug || "your-post-slug"}`}
      htmlFor="slug-input"
      required={required}
    >
      <Input
        id="slug-input"
        value={slug}
        onChange={(e) => {
          onManualEditChange(true);
          onSlugChange(slugify(e.target.value));
        }}
        placeholder="auto-generated-from-title"
      />
    </Field>
  );
}

/* ─── TagsInput — comma- or Enter-separated tag chips ───────────────────── */

interface TagsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagsInput({
  value,
  onChange,
  placeholder = "Type a tag and press Enter",
  maxTags = 20,
}: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function commit(raw: string) {
    const trimmed = raw.trim().replace(/,$/, "").trim();
    if (!trimmed) return;
    if (value.length >= maxTags) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
      setDraft("");
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-2 transition focus-within:border-accent-primary"
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-accent-primary/15 px-2.5 py-0.5 text-xs font-medium text-accent-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
            className="text-accent-primary/70 hover:text-accent-primary"
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(",")) {
            commit(v);
            setDraft("");
          } else {
            setDraft(v);
          }
        }}
        onBlur={() => {
          if (draft.trim()) {
            commit(draft);
            setDraft("");
          }
        }}
        onKeyDown={handleKey}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
      />
    </div>
  );
}

/* ─── DynamicListEditor — reorderable list of strings ───────────────────── */

interface DynamicListEditorProps {
  value: string[];
  onChange: (next: string[]) => void;
  itemLabel?: string;
  placeholder?: string;
  emptyMessage?: string;
}

export function DynamicListEditor({
  value,
  onChange,
  itemLabel = "item",
  placeholder = "Type and press Enter",
  emptyMessage,
}: DynamicListEditorProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function updateItem(index: number, next: string) {
    onChange(value.map((v, i) => (i === index ? next : v)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const next = Array.from(value);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && emptyMessage && (
        <p className="rounded-lg border border-dashed border-border bg-background px-4 py-3 text-xs text-text-muted">
          {emptyMessage}
        </p>
      )}

      {value.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dynamic-list">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {value.map((item, index) => (
                  <Draggable key={`${index}-${item}`} draggableId={`${index}-${item}`} index={index}>
                    {(prov, snapshot) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-2 ${snapshot.isDragging ? "ring-2 ring-accent-primary/40" : ""}`}
                      >
                        <span
                          {...prov.dragHandleProps}
                          className="grid h-7 w-7 shrink-0 cursor-grab place-items-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-secondary"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <Input
                          value={item}
                          onChange={(e) => updateItem(index, e.target.value)}
                          className="flex-1 border-transparent bg-transparent px-2 py-1.5"
                          aria-label={`Edit ${itemLabel}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          aria-label={`Remove ${itemLabel}`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-300"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addItem}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add
        </button>
      </div>
    </div>
  );
}

/* ─── ProcessStepsEditor — reorderable list of {number, title, description} ─ */

interface ProcessStepsEditorProps {
  value: ProcessStep[];
  onChange: (next: ProcessStep[]) => void;
}

export function ProcessStepsEditor({ value, onChange }: ProcessStepsEditorProps) {
  function update(index: number, patch: Partial<ProcessStep>) {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function add() {
    const nextNumber = String(value.length + 1).padStart(2, "0");
    onChange([
      ...value,
      { number: nextNumber, title: "", description: "" },
    ]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const next = Array.from(value);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed border-border bg-background px-4 py-3 text-xs text-text-muted">
          No process steps yet. Add the first one.
        </p>
      )}

      {value.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="process-steps">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {value.map((step, index) => (
                  <Draggable key={index} draggableId={`step-${index}`} index={index}>
                    {(prov, snapshot) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`rounded-xl border border-border bg-background p-3 ${snapshot.isDragging ? "ring-2 ring-accent-primary/40" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            {...prov.dragHandleProps}
                            className="grid h-7 w-7 shrink-0 cursor-grab place-items-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-secondary"
                          >
                            <GripVertical className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          <div className="grid w-[72px] shrink-0">
                            <Input
                              value={step.number}
                              onChange={(e) => update(index, { number: e.target.value })}
                              placeholder="01"
                              className="text-center"
                              aria-label="Step number"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={step.title}
                              onChange={(e) => update(index, { title: e.target.value })}
                              placeholder="Step title"
                              aria-label="Step title"
                            />
                            <Textarea
                              value={step.description}
                              onChange={(e) => update(index, { description: e.target.value })}
                              placeholder="What happens in this step?"
                              rows={2}
                              aria-label="Step description"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label="Remove step"
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-300"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add step
      </button>
    </div>
  );
}

/* ─── MetricsEditor — fixed-or-flexible list of result metrics ──────────── */

interface MetricsEditorProps {
  value: ProjectMetric[];
  onChange: (next: ProjectMetric[]) => void;
  maxItems?: number;
}

export function MetricsEditor({ value, onChange, maxItems = 6 }: MetricsEditorProps) {
  function update(index: number, patch: Partial<ProjectMetric>) {
    onChange(value.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function add() {
    if (value.length >= maxItems) return;
    onChange([...value, { value: "", label: "", description: "" }]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed border-border bg-background px-4 py-3 text-xs text-text-muted">
          Add up to {maxItems} result metrics shown on the case study page.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {value.map((metric, index) => (
          <div
            key={index}
            className="space-y-2 rounded-xl border border-border bg-background p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                Metric {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove metric"
                className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-300"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </div>
            <Input
              value={metric.value}
              onChange={(e) => update(index, { value: e.target.value })}
              placeholder="80%"
              aria-label="Metric value"
              className="font-display text-base"
            />
            <Input
              value={metric.label}
              onChange={(e) => update(index, { label: e.target.value })}
              placeholder="Brand Recognition"
              aria-label="Metric label"
            />
            <Textarea
              value={metric.description}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="Short context for this metric (optional)"
              rows={2}
              aria-label="Metric description"
            />
          </div>
        ))}
      </div>

      {value.length < maxItems && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add metric
        </button>
      )}
    </div>
  );
}

/* ─── BenefitsEditor — exactly three benefit cards with title + description ─ */

interface BenefitsEditorProps {
  value: ServiceBenefit[];
  onChange: (next: ServiceBenefit[]) => void;
}

export function BenefitsEditor({ value, onChange }: BenefitsEditorProps) {
  function update(index: number, patch: Partial<ServiceBenefit>) {
    onChange(value.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }
  function add() {
    onChange([...value, { title: "", description: "" }]);
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-3">
        {value.map((benefit, index) => (
          <div
            key={index}
            className="space-y-2 rounded-xl border border-border bg-background p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted">
                Benefit {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove benefit"
                className="grid h-6 w-6 place-items-center rounded-md text-text-muted hover:bg-red-500/10 hover:text-red-300"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </div>
            <Input
              value={benefit.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="Benefit title"
              aria-label="Benefit title"
            />
            <Textarea
              value={benefit.description}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="One or two sentences describing the benefit."
              rows={3}
              aria-label="Benefit description"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add benefit
      </button>
    </div>
  );
}
