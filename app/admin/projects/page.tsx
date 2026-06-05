import { getSupabaseServerClient } from "@/lib/supabase/server";
import ProjectsManager, { type ProjectRowSummary } from "./ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsListPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, client, category, cover_image, accent_color, featured, published, year, created_at",
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  const projects: ProjectRowSummary[] = data ?? [];

  return <ProjectsManager initialProjects={projects} />;
}
