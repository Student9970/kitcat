import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: `Important disclaimers regarding the content on ${siteConfig.name}.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <Container size="prose" className="py-10">
      <Breadcrumb items={[{ name: "Disclaimer", url: "/disclaimer" }]} />
      <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-brand-600">
        <h1>Disclaimer</h1>
        <p className="text-muted">Last updated: {formatDate(new Date())}</p>

        <h2>General information</h2>
        <p>
          The information provided by {siteConfig.name} on {siteConfig.url} is for
          general informational purposes only. All information is provided in good
          faith; however, we make no representation or warranty of any kind regarding
          the accuracy, adequacy, validity, reliability, or completeness of any
          information on the site.
        </p>

        <h2>Not professional advice</h2>
        <p>
          The content on this site is not a substitute for professional advice. Always
          seek the guidance of a qualified professional with any questions you may have.
          Never disregard professional advice because of something you have read here.
        </p>

        <h2>Affiliate disclosure</h2>
        <p>
          This site may contain affiliate links. If you click an affiliate link and make
          a purchase, we may earn a commission at no additional cost to you. We only
          recommend products and services we believe will add value to our readers.
        </p>

        <h2>External links</h2>
        <p>
          This site may contain links to external websites that are not provided or
          maintained by us. We do not guarantee the accuracy, relevance, timeliness, or
          completeness of any information on these external websites.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this disclaimer? Reach out via our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </article>
    </Container>
  );
}
