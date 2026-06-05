import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import {
  getActiveServices,
  getPublishedPosts,
  getPublishedProjects,
} from "@/lib/supabase/helpers";

// Revalidate the sitemap hourly so newly published content is discoverable.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static, always-present routes ──────────────────────────────────────────
  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/agency"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  // ── Dynamic content ─────────────────────────────────────────────────────────
  // Each block degrades to an empty list on any read failure (missing env, DB
  // hiccup) so the sitemap — and the build — never break over content.
  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const { projects } = await getPublishedProjects({ pageSize: 100 });
    for (const p of projects) {
      dynamicEntries.push({
        url: absoluteUrl(`/work/${p.slug}`),
        lastModified: new Date(p.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (err) {
    console.error("[sitemap] failed to load projects", err);
  }

  try {
    const services = await getActiveServices();
    for (const s of services) {
      dynamicEntries.push({
        url: absoluteUrl(`/services/${s.slug}`),
        lastModified: new Date(s.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (err) {
    console.error("[sitemap] failed to load services", err);
  }

  try {
    const { posts } = await getPublishedPosts({ pageSize: 100 });
    for (const post of posts) {
      dynamicEntries.push({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: new Date(post.updated_at),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch (err) {
    console.error("[sitemap] failed to load posts", err);
  }

  return [...staticEntries, ...dynamicEntries];
}
