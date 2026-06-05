"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseRouteClient } from "@/lib/supabase/server";
import { generateUniqueSlug, slugify } from "@/lib/supabase/helpers";
import type {
  PackageInsert,
  PackageUpdate,
  PricePeriod,
  ProcessStep,
  ServiceBenefit,
  ServiceInsert,
  ServiceUpdate,
} from "@/lib/supabase/types";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };

/* ═══════════════════════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════════════════════ */

export interface ServiceFormPayload {
  id?: string;
  title: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  description: string;
  price_label: string | null;
  starting_price: number | null;
  deliverables: string[];
  process: ProcessStep[];
  benefits: ServiceBenefit[];
  active: boolean;
}

function cleanProcess(steps: ProcessStep[]): ProcessStep[] {
  return (steps ?? [])
    .map((s) => ({
      number: (s.number ?? "").trim(),
      title: (s.title ?? "").trim(),
      description: (s.description ?? "").trim(),
    }))
    .filter((s) => s.title || s.description);
}

function cleanBenefits(benefits: ServiceBenefit[]): ServiceBenefit[] {
  return (benefits ?? [])
    .map((b) => ({
      title: (b.title ?? "").trim(),
      description: (b.description ?? "").trim(),
    }))
    .filter((b) => b.title || b.description);
}

function cleanDeliverables(items: string[]): string[] {
  return (items ?? []).map((i) => i.trim()).filter(Boolean);
}

function validateService(payload: ServiceFormPayload): string | null {
  if (!payload.title.trim()) return "Service title is required.";
  if (!payload.description.trim()) return "A description is required.";
  if (
    payload.starting_price !== null &&
    (Number.isNaN(payload.starting_price) || payload.starting_price < 0)
  ) {
    return "Starting price must be a positive number.";
  }
  return null;
}

export async function createServiceAction(
  payload: ServiceFormPayload,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const error = validateService(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const desiredSlug = payload.slug.trim() || slugify(payload.title);
  const slug = await generateUniqueSlug(desiredSlug, { table: "services" });

  // New services drop to the end of the display order.
  const { data: last } = await supabase
    .from("services")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.display_order ?? -1) + 1;

  const insert: ServiceInsert = {
    slug,
    title: payload.title.trim(),
    tagline: payload.tagline?.trim() || null,
    summary: payload.summary?.trim() || null,
    description: payload.description.trim(),
    price_label: payload.price_label?.trim() || null,
    starting_price: payload.starting_price,
    deliverables: cleanDeliverables(payload.deliverables),
    process: cleanProcess(payload.process),
    benefits: cleanBenefits(payload.benefits),
    active: payload.active,
    display_order: nextOrder,
  };

  const { data, error: insertError } = await supabase
    .from("services")
    .insert(insert)
    .select("id, slug")
    .single();

  if (insertError || !data) {
    return { ok: false, error: insertError?.message ?? "Failed to create service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/services");
  return {
    ok: true,
    data: { id: data.id, slug: data.slug },
    message: "Service created.",
  };
}

export async function updateServiceAction(
  payload: ServiceFormPayload,
): Promise<ActionResult<{ slug: string }>> {
  if (!payload.id) return { ok: false, error: "Missing service id." };
  const error = validateService(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const existing = await supabase
    .from("services")
    .select("slug")
    .eq("id", payload.id)
    .maybeSingle();

  if (existing.error || !existing.data) {
    return { ok: false, error: "Service not found." };
  }

  const normalizedSlug = slugify(payload.slug || payload.title);
  const slug =
    normalizedSlug === existing.data.slug
      ? existing.data.slug
      : await generateUniqueSlug(normalizedSlug, {
          table: "services",
          ignoreId: payload.id,
        });

  const update: ServiceUpdate = {
    slug,
    title: payload.title.trim(),
    tagline: payload.tagline?.trim() || null,
    summary: payload.summary?.trim() || null,
    description: payload.description.trim(),
    price_label: payload.price_label?.trim() || null,
    starting_price: payload.starting_price,
    deliverables: cleanDeliverables(payload.deliverables),
    process: cleanProcess(payload.process),
    benefits: cleanBenefits(payload.benefits),
    active: payload.active,
  };

  const { error: updateError } = await supabase
    .from("services")
    .update(update)
    .eq("id", payload.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${payload.id}/edit`);
  revalidatePath("/admin");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/services");

  return { ok: true, data: { slug }, message: "Service saved." };
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing service id." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/services");
  return { ok: true, message: "Service deleted." };
}

/**
 * Persist a new display order for services. Receives the ids in their desired
 * order and writes display_order = index for each. Called after drag-and-drop
 * reordering on the services list.
 */
export async function reorderServicesAction(
  orderedIds: string[],
): Promise<ActionResult> {
  if (orderedIds.length === 0) return { ok: true };
  const supabase = getSupabaseRouteClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("services").update({ display_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { ok: false, error: failed.error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, message: "Order updated." };
}

/* ═══════════════════════════════════════════════════════════════════════
   PACKAGES (pricing tiers)
   ═══════════════════════════════════════════════════════════════════════ */

export interface PackageFormPayload {
  id?: string;
  name: string;
  description: string | null;
  price: number | null;
  price_label: string | null;
  price_period: PricePeriod;
  features: string[];
  popular: boolean;
  active: boolean;
}

function validatePackage(payload: PackageFormPayload): string | null {
  if (!payload.name.trim()) return "Package name is required.";
  if (
    payload.price !== null &&
    (Number.isNaN(payload.price) || payload.price < 0)
  ) {
    return "Price must be a positive number.";
  }
  return null;
}

export async function createPackageAction(
  payload: PackageFormPayload,
): Promise<ActionResult<{ id: string }>> {
  const error = validatePackage(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const { data: last } = await supabase
    .from("packages")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.display_order ?? -1) + 1;

  const insert: PackageInsert = {
    name: payload.name.trim(),
    description: payload.description?.trim() || null,
    price: payload.price,
    price_label: payload.price_label?.trim() || null,
    price_period: payload.price_period,
    features: payload.features.map((f) => f.trim()).filter(Boolean),
    popular: payload.popular,
    active: payload.active,
    display_order: nextOrder,
  };

  const { data, error: insertError } = await supabase
    .from("packages")
    .insert(insert)
    .select("id")
    .single();

  if (insertError || !data) {
    return { ok: false, error: insertError?.message ?? "Failed to create package." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, data: { id: data.id }, message: "Package created." };
}

export async function updatePackageAction(
  payload: PackageFormPayload,
): Promise<ActionResult> {
  if (!payload.id) return { ok: false, error: "Missing package id." };
  const error = validatePackage(payload);
  if (error) return { ok: false, error };

  const supabase = getSupabaseRouteClient();

  const update: PackageUpdate = {
    name: payload.name.trim(),
    description: payload.description?.trim() || null,
    price: payload.price,
    price_label: payload.price_label?.trim() || null,
    price_period: payload.price_period,
    features: payload.features.map((f) => f.trim()).filter(Boolean),
    popular: payload.popular,
    active: payload.active,
  };

  const { error: updateError } = await supabase
    .from("packages")
    .update(update)
    .eq("id", payload.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, message: "Package saved." };
}

export async function deletePackageAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing package id." };
  const supabase = getSupabaseRouteClient();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true, message: "Package deleted." };
}
