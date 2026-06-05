import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import SettingsManager from "./SettingsManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const supabase = getSupabaseServerClient();

  const [settings, userResult] = await Promise.all([
    getSiteSettings(supabase),
    supabase.auth.getUser(),
  ]);

  const user = userResult.data.user;
  const lastSignIn = user?.last_sign_in_at ?? null;

  return (
    <SettingsManager
      initialSettings={settings}
      adminEmail={user?.email ?? "—"}
      lastSignIn={lastSignIn}
    />
  );
}
