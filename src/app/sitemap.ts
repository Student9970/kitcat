import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import {
  getAllPostSummaries,
  getCategories,
  getTags,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostSummaries({ includeDrafts: false });
  const categories = getCategories();
  const tags = getTags();

  const staticPages = [
    "/",
    "/blog",
    "/categories",
    "/about",
    "/contact",
    "/privacy-policy",
    "/disclaimer",
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: absoluteUrl(path, siteConfig.url),
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/blog" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const post of posts) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`, siteConfig.url),
      lastModified: new Date(post.updatedDate || post.publishDate),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  for (const cat of categories) {
    entries.push({
      url: absoluteUrl(`/category/${cat.slug}`, siteConfig.url),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const tag of tags) {
    entries.push({
      url: absoluteUrl(`/tag/${tag.slug}`, siteConfig.url),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  return entries;
}
