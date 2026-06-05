import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminToaster from "@/components/admin/AdminToaster";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Admin · Brandistri",
    template: "%s · Brandistri Admin",
  },
  robots: { index: false, follow: false },
};

// Always render fresh — admin data shouldn't be cached.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * No session → render children unwrapped.
   *
   * Middleware already redirects unauthenticated requests on protected
   * paths to /admin/login, so in practice this branch only fires for the
   * login page itself. Rendering children alone keeps the login screen
   * fullscreen with no admin chrome leaking around it.
   */
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {children}
        <AdminToaster />
      </div>
    );
  }

  // Authenticated → load the unread badge once and pass it to both the
  // sidebar and the header so the count stays in sync.
  const { count: unreadCountRaw } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false)
    .eq("archived", false);

  const unreadCount = unreadCountRaw ?? 0;
  const userEmail = user.email ?? "admin";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <AdminSidebar userEmail={userEmail} unreadCount={unreadCount} />

      <div className="lg:pl-[260px]">
        <AdminHeader userEmail={userEmail} unreadCount={unreadCount} />

        <main className="px-5 py-8 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
      </div>

      <AdminToaster />
    </div>
  );
}
