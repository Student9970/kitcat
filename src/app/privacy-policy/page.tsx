import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <Container size="prose" className="py-10">
      <Breadcrumb items={[{ name: "Privacy Policy", url: "/privacy-policy" }]} />
      <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-a:text-brand-600">
        <h1>Privacy Policy</h1>
        <p className="text-muted">Last updated: {formatDate(new Date())}</p>

        <p>
          This Privacy Policy describes how {siteConfig.name} (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares information
          when you visit {siteConfig.url}.
        </p>

        <h2>Information we collect</h2>
        <p>
          We may collect anonymous usage data through analytics tools to understand how
          visitors use our site. This may include your browser type, device, pages
          visited, and time spent on the site.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies and similar technologies to improve your browsing experience
          and analyze traffic. You can disable cookies in your browser settings.
        </p>

        <h2>Third-party services</h2>
        <p>
          We may use third-party services such as Google Analytics and advertising
          networks. These services may collect information sent by your browser as part
          of a web page request. Their use of this information is governed by their own
          privacy policies.
        </p>

        <h2>Advertising</h2>
        <p>
          Third-party vendors, including Google, may use cookies to serve ads based on
          your prior visits to this and other websites. You can opt out of personalized
          advertising via your ad settings.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, or
          delete your personal information. Contact us to exercise these rights.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on
          this page with an updated revision date.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please reach out via our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </article>
    </Container>
  );
}
