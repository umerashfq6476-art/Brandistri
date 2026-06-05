import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import ServiceForm from "../../ServiceForm";

export const dynamic = "force-dynamic";

interface EditServicePageProps {
  params: { id: string };
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load service: ${error.message}`);
  }
  if (!data) {
    notFound();
  }

  return <ServiceForm mode="edit" initial={data} />;
}
