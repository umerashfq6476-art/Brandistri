import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import ProjectForm from "../../ProjectForm";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load project: ${error.message}`);
  }
  if (!data) {
    notFound();
  }

  return <ProjectForm mode="edit" initial={data} />;
}
