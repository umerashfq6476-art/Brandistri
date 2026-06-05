"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Edit3, GripVertical, PlusCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/admin/ui/primitives";
import { reorderServicesAction } from "./actions";

export interface ServiceCardSummary {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  starting_price: number | null;
  price_label: string | null;
  active: boolean;
  display_order: number;
}

interface ServicesManagerProps {
  initialServices: ServiceCardSummary[];
}

function priceText(service: ServiceCardSummary): string {
  if (service.price_label) return service.price_label;
  if (service.starting_price != null) {
    return `from $${service.starting_price.toLocaleString()}`;
  }
  return "Price on request";
}

export default function ServicesManager({ initialServices }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [, startReorder] = useTransition();

  function onDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }
    const next = Array.from(services);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);

    // Optimistic: show the new order immediately, then persist.
    const previous = services;
    setServices(next);

    startReorder(async () => {
      const res = await reorderServicesAction(next.map((s) => s.id));
      if (!res.ok) {
        toast.error(res.error);
        setServices(previous); // roll back on failure
        return;
      }
      toast.success("Display order updated.");
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Services
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Drag the cards to set the order they appear on the public site.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <EmptyState />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="services-grid">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {services.map((service, index) => (
                  <Draggable
                    key={service.id}
                    draggableId={service.id}
                    index={index}
                  >
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`flex flex-col rounded-2xl border bg-surface p-5 transition ${
                          snapshot.isDragging
                            ? "border-accent-primary/60 ring-2 ring-accent-primary/30"
                            : "border-border hover:border-accent-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-background text-accent-primary">
                            <Sparkles className="h-4 w-4" aria-hidden />
                          </div>
                          <span
                            {...prov.dragHandleProps}
                            className="grid h-8 w-8 cursor-grab place-items-center rounded-md text-text-muted transition hover:bg-surface-2 hover:text-text-secondary"
                            aria-label="Drag to reorder"
                          >
                            <GripVertical className="h-4 w-4" aria-hidden />
                          </span>
                        </div>

                        <div className="mt-4 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-semibold tracking-tight">
                              {service.title}
                            </h3>
                            {!service.active && (
                              <Badge tone="muted">Inactive</Badge>
                            )}
                          </div>
                          {service.tagline && (
                            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                              {service.tagline}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                          <p className="text-sm font-medium text-accent-secondary">
                            {priceText(service)}
                          </p>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
                          >
                            <Edit3 className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </Link>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-text-muted">
        <Sparkles className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        No services yet
      </h3>
      <p className="mt-1 text-sm text-text-muted">
        Create your service offerings to populate the services page.
      </p>
      <Link
        href="/admin/services/new"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-primary/90"
      >
        <PlusCircle className="h-4 w-4" aria-hidden />
        Create your first service
      </Link>
    </div>
  );
}
