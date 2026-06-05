import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection({
  contactEmail,
}: {
  contactEmail?: string;
}) {
  return (
    <section className="relative border-y border-border bg-background">
      <div className="container-x section-padding">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <ContactInfo contactEmail={contactEmail} />
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
