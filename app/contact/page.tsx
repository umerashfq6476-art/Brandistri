import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import ContactFAQ from "@/components/contact/ContactFAQ";
import { getCachedSiteSettings } from "@/lib/settings-server";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start your brand project with Brandistri. Tell us about your goals — we respond to every inquiry within 24 hours.",
};

export default async function ContactPage() {
  const settings = await getCachedSiteSettings();

  return (
    <>
      <ContactHero />
      <ContactSection contactEmail={settings.business.contactEmail} />
      <ContactFAQ />
    </>
  );
}
