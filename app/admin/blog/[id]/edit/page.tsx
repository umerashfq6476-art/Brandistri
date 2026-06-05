import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PostForm from "../../PostForm";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load post: ${error.message}`);
  }
  if (!data) {
    notFound();
  }

  return <PostForm mode="edit" initial={data} />;
}
