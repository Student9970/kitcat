import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsletterSection } from "@/components/NewsletterSection";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Learn more about ${siteConfig.name} and our mission.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container size="prose" className="py-10">
      <Breadcrumb items={[{ name: "About", url: "/about" }]} />

      <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-brand-600">
        <h1>About {siteConfig.name}</h1>
        <p className="lead text-xl text-muted">{siteConfig.description}</p>

        <h2>Our mission</h2>
        <p>
          {siteConfig.name} exists to make expert knowledge approachable. We believe
          everyone deserves clear, trustworthy, and practical information — without the
          jargon or the fluff.
        </p>

        <h2>What we do</h2>
        <p>
          We research thoroughly, test hands-on where possible, and write guides that
          respect your time. Every recommendation is made with our readers&apos; best
          interests at heart.
        </p>

        <h2>Editorial standards</h2>
        <ul>
          <li>We cite reputable sources and update articles as things change.</li>
          <li>We clearly disclose any affiliate relationships.</li>
          <li>We never accept payment for positive coverage.</li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Have a question, correction, or partnership idea? We&apos;d love to hear from
          you on our <a href="/contact">contact page</a>.
        </p>
      </article>

      <div className="mt-12">
        <NewsletterSection />
      </div>
    </Container>
  );
}
