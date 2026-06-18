import { siteConfig } from "@/config/site";
import type { Post } from "./types";
import { absoluteUrl } from "./utils";

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: siteConfig.organization.logo,
    sameAs: siteConfig.organization.sameAs,
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** BlogPosting + Article share most fields; we emit BlogPosting. */
export function blogPostingSchema(post: Post): Json {
  const url = absoluteUrl(`/blog/${post.slug}`, siteConfig.url);
  const image = post.featuredImage
    ? absoluteUrl(post.featuredImage, siteConfig.url)
    : absoluteUrl(siteConfig.defaultOgImage, siteConfig.url);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.seoDescription || post.description,
    image,
    datePublished: new Date(post.publishDate).toISOString(),
    dateModified: new Date(post.updatedDate || post.publishDate).toISOString(),
    author: {
      "@type": "Person",
      name: post.author || siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.organization.logo,
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    url,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url, siteConfig.url),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Pull a simple FAQ list out of an MDX body. Any `## FAQ` (or `## ...FAQ...`)
 * section is parsed: each `### Question` becomes a Q, the following text the A.
 */
export function extractFaqFromContent(content: string): FaqItem[] {
  const faqHeadingIndex = content.search(/^##\s+.*FAQ.*$/im);
  if (faqHeadingIndex === -1) return [];

  const afterFaq = content.slice(faqHeadingIndex);
  // Stop at the next H2 so we only parse within the FAQ section.
  const nextH2 = afterFaq.slice(3).search(/^##\s+/m);
  const section = nextH2 === -1 ? afterFaq : afterFaq.slice(0, nextH2 + 3);

  const items: FaqItem[] = [];
  // Split the section on H3 markers; each chunk is "Question\nAnswer...".
  const chunks = section.split(/^###\s+/m).slice(1);
  for (const chunk of chunks) {
    const newline = chunk.indexOf("\n");
    const question = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
    const answer = (newline === -1 ? "" : chunk.slice(newline + 1))
      .replace(/[#>*`_~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (question && answer) items.push({ question, answer });
  }
  return items;
}
