import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import PricingTiers from "@/components/services/PricingTiers";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import ServicesCTA from "@/components/services/ServicesCTA";
import { getActivePackages, getActiveServices } from "@/lib/supabase/helpers";
import { dbPackageToTier, dbServiceToView } from "@/lib/data/adapters";

export const metadata: Metadata = {
  title: "Services — Brand Strategy, Identity & Web",
  description:
    "Complete brand building services — from strategy and identity to web design, social branding, and video content. Built for businesses ready to grow.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const [services, packages] = await Promise.all([
    getActiveServices(),
    getActivePackages(),
  ]);

  return (
    <>
      <ServicesHero />
      <ServicesList services={services.map(dbServiceToView)} />
      <PricingTiers packages={packages.map(dbPackageToTier)} />
      <ServicesFAQ />
      <ServicesCTA />
    </>
  );
}
