import { getSupabaseServerClient } from "@/lib/supabase/server";
import ServicesManager, { type ServiceCardSummary } from "./ServicesManager";
import PackagesManager, { type PackageSummary } from "./PackagesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = getSupabaseServerClient();

  const [servicesRes, packagesRes] = await Promise.all([
    supabase
      .from("services")
      .select(
        "id, title, slug, tagline, starting_price, price_label, active, display_order",
      )
      .order("display_order", { ascending: true })
      .order("title", { ascending: true }),
    supabase
      .from("packages")
      .select(
        "id, name, description, price, price_label, price_period, features, popular, active, display_order",
      )
      .order("display_order", { ascending: true }),
  ]);

  if (servicesRes.error) {
    throw new Error(`Failed to load services: ${servicesRes.error.message}`);
  }
  if (packagesRes.error) {
    throw new Error(`Failed to load packages: ${packagesRes.error.message}`);
  }

  const services: ServiceCardSummary[] = servicesRes.data ?? [];
  const packages: PackageSummary[] = packagesRes.data ?? [];

  return (
    <div className="space-y-12">
      <ServicesManager initialServices={services} />
      <PackagesManager initialPackages={packages} />
    </div>
  );
}
