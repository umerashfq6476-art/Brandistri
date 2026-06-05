export const SERVICE_OPTIONS = [
  "Brand Identity",
  "Brand Strategy",
  "Web Design",
  "Social Media Branding",
  "Video Content",
  "Business Branding",
  "Full Brand Package",
  "Not Sure Yet",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const BUDGET_OPTIONS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not Sure",
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1–2 Weeks",
  "1 Month",
  "Flexible",
] as const;

export type TimelineOption = (typeof TIMELINE_OPTIONS)[number];

export type ContactPayload = {
  service: ServiceOption;
  name: string;
  email: string;
  company?: string;
  website?: string;
  budget: BudgetOption;
  timeline: TimelineOption;
  description: string;
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Strip ASCII control characters (keep tab \x09, LF \x0A, CR \x0D), then trim + cap length.
export function sanitize(input: unknown, max = 2000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, max);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
