import { getSupabaseServerClient } from "@/lib/supabase/server";
import PostsManager, { type PostRowSummary } from "./PostsManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, excerpt, cover_image, category, published, featured, created_at, published_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load posts: ${error.message}`);
  }

  const posts: PostRowSummary[] = data ?? [];

  return <PostsManager initialPosts={posts} />;
}
