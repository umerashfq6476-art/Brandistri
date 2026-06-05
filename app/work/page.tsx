import type { Metadata } from "next";
import WorkHero from "@/components/work/WorkHero";
import WorkExplorer from "@/components/work/WorkExplorer";
import WorkStats from "@/components/work/WorkStats";
import WorkCTA from "@/components/work/WorkCTA";
import { getPublishedProjects } from "@/lib/supabase/helpers";
import { dbProjectToView } from "@/lib/data/adapters";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected brand identities, websites, social systems, and films from Brandistri.",
};

// Incrementally regenerate every 60s; admin publishes also revalidate on demand.
export const revalidate = 60;

export default async function WorkPage() {
  const { projects } = await getPublishedProjects({ pageSize: 100 });
  const views = projects.map(dbProjectToView);

  return (
    <>
      <WorkHero />
      <WorkExplorer projects={views} />
      <WorkStats />
      <WorkCTA />
    </>
  );
}
