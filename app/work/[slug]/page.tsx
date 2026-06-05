import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyHero from "@/components/work/CaseStudyHero";
import CaseStudyOverview from "@/components/work/CaseStudyOverview";
import CaseStudyChallenge from "@/components/work/CaseStudyChallenge";
import CaseStudyStrategy from "@/components/work/CaseStudyStrategy";
import CaseStudyDesign from "@/components/work/CaseStudyDesign";
import CaseStudyResults from "@/components/work/CaseStudyResults";
import CaseStudyNext from "@/components/work/CaseStudyNext";
import CaseStudyCTA from "@/components/work/CaseStudyCTA";
import { getProjectBySlug, getPublishedProjects } from "@/lib/supabase/helpers";
import { dbProjectToView } from "@/lib/data/adapters";

type Params = { slug: string };

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Case study" };
  return {
    title: project.title,
    description: project.description || `${project.title} — a Brandistri case study.`,
    openGraph: {
      title: `${project.title} — Brandistri`,
      description: project.description || undefined,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const row = await getProjectBySlug(params.slug);
  if (!row) notFound();

  const project = dbProjectToView(row);

  // Determine the "next project" by published display order.
  const { projects } = await getPublishedProjects({ pageSize: 100 });
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const nextRow =
    idx >= 0 && projects.length > 1
      ? projects[(idx + 1) % projects.length]
      : null;
  const next = nextRow && nextRow.slug !== project.slug ? dbProjectToView(nextRow) : null;

  return (
    <article>
      <CaseStudyHero project={project} />
      <CaseStudyOverview project={project} />
      <CaseStudyChallenge project={project} />
      <CaseStudyStrategy project={project} />
      <CaseStudyDesign project={project} />
      <CaseStudyResults project={project} />
      {next && <CaseStudyNext next={next} />}
      <CaseStudyCTA />
    </article>
  );
}
