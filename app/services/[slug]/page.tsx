import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SingleServiceHero from "@/components/services/SingleServiceHero";
import SingleServiceContent from "@/components/services/SingleServiceContent";
import RelatedServices from "@/components/services/RelatedServices";
import SingleServiceCTA from "@/components/services/SingleServiceCTA";
import { getActiveServices, getServiceBySlug } from "@/lib/supabase/helpers";
import { dbServiceToView } from "@/lib/data/adapters";

type Params = { slug: string };

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) {
    return { title: "Service Not Found" };
  }
  const summary = service.summary || service.description || undefined;
  return {
    title: service.title,
    description: summary,
    openGraph: {
      title: `${service.title} — Brandistri`,
      description: summary,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const row = await getServiceBySlug(params.slug);
  if (!row) notFound();

  const service = dbServiceToView(row);

  // Related = other active services (up to 3).
  const all = await getActiveServices();
  const related = all
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3)
    .map(dbServiceToView);

  return (
    <>
      <SingleServiceHero service={service} />
      <SingleServiceContent service={service} />
      <RelatedServices services={related} />
      <SingleServiceCTA service={service} />
    </>
  );
}
