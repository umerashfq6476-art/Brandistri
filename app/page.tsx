import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import ServicesOverview from "@/components/home/ServicesOverview";
import FeaturedWork from "@/components/home/FeaturedWork";
import WhyUs from "@/components/home/WhyUs";
import ProcessPreview from "@/components/home/ProcessPreview";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { getPublishedProjects } from "@/lib/supabase/helpers";
import { dbProjectToView } from "@/lib/data/adapters";

export const revalidate = 60;

export default async function HomePage() {
  const { projects } = await getPublishedProjects({ featured: true, pageSize: 3 });
  const featured = projects.map(dbProjectToView);

  return (
    <>
      <Hero />
      <BrandIntro />
      <ServicesOverview />
      <FeaturedWork projects={featured} />
      <WhyUs />
      <ProcessPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
