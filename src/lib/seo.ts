import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { analyticsConfig } from "@/config/features";
import type { Post } from "./types";
import { absoluteUrl } from "./utils";

interface PageSeoOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

/** Build a complete Next.js Metadata object for any page. */
export function buildMetadata(options: PageSeoOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "/",
    image = siteConfig.defaultOgImage,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    tags,
    noIndex = false,
  } = options;

  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const canonical = absoluteUrl(path, siteConfig.url);
  const ogImage = image.startsWith("http")
    ? image
    : absoluteUrl(image, siteConfig.url);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": absoluteUrl("/rss.xml", siteConfig.url),
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    authors: authors?.map((name) => ({ name })),
    keywords: tags,
    verification: analyticsConfig.gscVerification
      ? { google: analyticsConfig.gscVerification }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title ?? siteConfig.name }],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
    },
  };
}

/** Metadata helper specialised for a blog post. */
export function buildPostMetadata(post: Post): Metadata {
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    path: `/blog/${post.slug}`,
    image: post.featuredImage || siteConfig.defaultOgImage,
    type: "article",
    publishedTime: new Date(post.publishDate).toISOString(),
    modifiedTime: post.updatedDate
      ? new Date(post.updatedDate).toISOString()
      : undefined,
    authors: [post.author || siteConfig.author.name],
    tags: post.tags,
    noIndex: post.status !== "published",
  });
}
