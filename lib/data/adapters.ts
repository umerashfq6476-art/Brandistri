/**
 * Adapters that map Supabase rows onto the view-model shapes the public-site
 * components already consume (`Project`, `Service`, pricing `Tier`). This keeps
 * the rich presentational components untouched while their data now comes
 * live from the database.
 */

import type { Project } from "./projects";
import type { Service } from "./services";
import type {
  PackageRow,
  ProjectRow,
  ServiceRow,
} from "@/lib/supabase/types";

/* ─── Projects ──────────────────────────────────────────────────────────── */

/** A CSS background-image value: a real cover photo if present, else a brand gradient. */
function coverImageCss(coverImage: string | null, accent: string): string {
  if (coverImage) return `url("${coverImage}")`;
  return `linear-gradient(135deg, ${accent} 0%, #1A1A1A 100%)`;
}

export function dbProjectToView(row: ProjectRow): Project {
  const accent = row.accent_color || "#6366F1";
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    year: row.year,
    duration: row.duration ?? "—",
    category: row.category,
    description: row.description || "",
    tags: row.tags ?? [],
    featured: row.featured,
    imageUrl: coverImageCss(row.cover_image, accent),
    color: accent,
    cover: row.cover_image ?? "",
    summary: row.description || "",
    story: row.solution || row.description || "",
    services: row.services ?? [],
    challenge: row.challenge || "",
    solution: row.solution || "",
    // The DB has no structured strategy points; the section still renders the
    // solution narrative above an (empty) grid.
    strategy: [],
    // Derive a small palette from the project's accent color over brand neutrals.
    palette: [
      { name: "Accent", hex: accent },
      { name: "Ink", hex: "#0A0A0A" },
      { name: "Surface", hex: "#111111" },
      { name: "Lime", hex: "#ADFF2F" },
    ],
    typography: { display: "Clash Display", body: "Satoshi" },
    results: row.results || "",
    metrics: (row.metrics ?? []).map((m) => ({
      value: m.value,
      label: m.label,
      description: m.description ?? "",
    })),
    testimonial: row.testimonial
      ? {
          quote: row.testimonial.quote,
          author: row.testimonial.author,
          role: row.testimonial.role,
        }
      : null,
    gallery: row.gallery_images ?? [],
  };
}

/* ─── Services ──────────────────────────────────────────────────────────── */

const SERVICE_ICON_NAMES: Service["iconName"][] = [
  "Layers",
  "Target",
  "Monitor",
  "Share2",
  "Video",
  "Briefcase",
];

function resolveIconName(icon: string | null): Service["iconName"] {
  if (icon && (SERVICE_ICON_NAMES as string[]).includes(icon)) {
    return icon as Service["iconName"];
  }
  return "Layers";
}

export function dbServiceToView(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    iconName: resolveIconName(row.icon),
    tagline: row.tagline || "",
    summary: row.summary || row.description || "",
    description: row.description || "",
    deliverables: row.deliverables ?? [],
    process: (row.process ?? []).map((p) => ({
      number: p.number,
      title: p.title,
      description: p.description,
    })),
    benefits: (row.benefits ?? []).map((b) => ({
      title: b.title,
      description: b.description,
    })),
    cta: "Get Started",
  };
}

/* ─── Pricing packages ──────────────────────────────────────────────────── */

export interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceLabel: string;
  includes: string[];
  cta: string;
  ctaUrl: string;
  popular: boolean;
}

function formatPrice(row: PackageRow): string {
  if (row.price_label) return row.price_label;
  if (row.price != null) {
    return `$${Number(row.price).toLocaleString()}`;
  }
  return "Custom";
}

const PERIOD_LABEL: Record<PackageRow["price_period"], string> = {
  "one-time": "Starting from",
  monthly: "Per month",
  yearly: "Per year",
  custom: "Custom scope",
};

export function dbPackageToTier(row: PackageRow): PricingTier {
  return {
    name: row.name,
    tagline: row.description || "",
    price: formatPrice(row),
    priceLabel: PERIOD_LABEL[row.price_period] ?? "Starting from",
    includes: row.features ?? [],
    cta: row.cta_label || "Get Started",
    ctaUrl: row.cta_url || "/contact",
    popular: row.popular,
  };
}
