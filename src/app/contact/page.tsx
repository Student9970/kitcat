import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container size="prose" className="py-10">
      <Breadcrumb items={[{ name: "Contact", url: "/contact" }]} />
      <PageHeader
        title="Get in touch"
        description="Questions, feedback, or partnership ideas? We'd love to hear from you."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-default bg-card p-5">
          <Mail className="mt-0.5 size-5 text-brand-600" />
          <div>
            <h3 className="font-semibold">Email us</h3>
            <p className="text-sm text-muted">We typically reply within 1–2 business days.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-default bg-card p-5">
          <MessageSquare className="mt-0.5 size-5 text-brand-600" />
          <div>
            <h3 className="font-semibold">Follow along</h3>
            <p className="text-sm text-muted">Connect with us on social media for daily tips.</p>
          </div>
        </div>
      </div>

      <ContactForm />
    </Container>
  );
}
