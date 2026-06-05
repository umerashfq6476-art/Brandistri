import type { Metadata } from "next";
import AgencyHero from "@/components/agency/AgencyHero";
import BrandStory from "@/components/agency/BrandStory";
import MissionVision from "@/components/agency/MissionVision";
import OurValues from "@/components/agency/OurValues";
import AgencyStats from "@/components/agency/AgencyStats";
import CreativePhilosophy from "@/components/agency/CreativePhilosophy";
import FounderSection from "@/components/agency/FounderSection";
import AgencyCTA from "@/components/agency/AgencyCTA";

export const metadata: Metadata = {
  title: "Agency — A Strategic Branding Studio",
  description:
    "Brandistri is a strategic branding studio built for businesses that want to stand out, communicate clearly, and grow with purpose.",
};

export default function AgencyPage() {
  return (
    <>
      <AgencyHero />
      <BrandStory />
      <MissionVision />
      <OurValues />
      <AgencyStats />
      <CreativePhilosophy />
      <FounderSection />
      <AgencyCTA />
    </>
  );
}
