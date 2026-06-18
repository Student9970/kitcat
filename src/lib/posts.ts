import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

import type {
  Post,
  PostFrontmatter,
  PostStatus,
  PostSummary,
  Taxonomy,
  TocHeading,
} from "./types";
import { slugify } from "./utils";

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const POSTS_DIR = path.join(CONTENT_DIR, "posts");
export const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Extract ATX headings (## / ###) for the table of contents. */
function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  // Strip fenced code blocks so we don't pick up comments inside them.
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const lines = withoutCode.split("\n");
  for (const line of lines) {
    const match = /^(#{2,4})\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/[#*`_~]/g, "").trim();
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level });
  }
  return headings;
}

function normalizeFrontmatter(
  data: Record<string, unknown>,
  fallbackSlug: string
): PostFrontmatter {
  const tags = Array.isArray(data.tags)
    ? (data.tags as unknown[]).map((t) => String(t))
    : typeof data.tags === "string"
      ? (data.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const status: PostStatus = data.status === "published" ? "published" : "draft";

  return {
    title: String(data.title ?? "Untitled"),
    slug: String(data.slug ?? fallbackSlug),
    description: String(data.description ?? ""),
    category: String(data.category ?? "Uncategorized"),
    tags,
    featuredImage: String(data.featuredImage ?? ""),
    author: String(data.author ?? ""),
    publishDate: String(data.publishDate ?? new Date().toISOString().slice(0, 10)),
    updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
    status,
  };
}

function readPostFile(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fileSlug = path.basename(filePath).replace(/\.mdx?$/, "");
  const fm = normalizeFrontmatter(data, fileSlug);
  const stats = readingTime(content);

  return {
    ...fm,
    content,
    readingTime: stats.text,
    wordCount: stats.words,
    headings: extractHeadings(content),
    filePath,
  };
}

function readDir(dir: string): Post[] {
  ensureDir(dir);
  const files = fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
  return files.map((file) => readPostFile(path.join(dir, file)));
}

/**
 * All posts from /content/posts. In production only `published` posts are
 * returned. In development everything is returned (so drafts are previewable).
 */
export function getAllPosts(options?: { includeDrafts?: boolean }): Post[] {
  const includeDrafts =
    options?.includeDrafts ?? process.env.NODE_ENV === "development";

  const posts = readDir(POSTS_DIR)
    .filter((p) => (includeDrafts ? true : p.status === "published"))
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

  return posts;
}

/** Posts physically located in /content/drafts (dev admin use). */
export function getDraftFolderPosts(): Post[] {
  return readDir(DRAFTS_DIR);
}

export function toSummary(post: Post): PostSummary {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    category: post.category,
    tags: post.tags,
    featuredImage: post.featuredImage,
    author: post.author,
    publishDate: post.publishDate,
    updatedDate: post.updatedDate,
    readingTime: post.readingTime,
    status: post.status,
  };
}

export function getAllPostSummaries(options?: {
  includeDrafts?: boolean;
}): PostSummary[] {
  return getAllPosts(options).map(toSummary);
}

export function getPostBySlug(slug: string): Post | null {
  const all = getAllPosts({ includeDrafts: true });
  return all.find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** All published categories with post counts. */
export function getCategories(): Taxonomy[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts({ includeDrafts: false })) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryBySlug(slug: string): Taxonomy | null {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

export function getPostsByCategory(categorySlug: string): PostSummary[] {
  return getAllPostSummaries({ includeDrafts: false }).filter(
    (p) => slugify(p.category) === categorySlug
  );
}

/** All published tags with post counts. */
export function getTags(): Taxonomy[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts({ includeDrafts: false })) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function getTagBySlug(slug: string): Taxonomy | null {
  return getTags().find((t) => t.slug === slug) ?? null;
}

export function getPostsByTag(tagSlug: string): PostSummary[] {
  return getAllPostSummaries({ includeDrafts: false }).filter((p) =>
    p.tags.some((t) => slugify(t) === tagSlug)
  );
}

/** Related posts by shared category/tags, excluding the current post. */
export function getRelatedPosts(post: Post, limit = 3): PostSummary[] {
  const candidates = getAllPostSummaries({ includeDrafts: false }).filter(
    (p) => p.slug !== post.slug
  );

  const scored = candidates.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 3;
    score += p.tags.filter((t) => post.tags.includes(t)).length;
    return { post: p, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.publishDate).getTime() - new Date(a.post.publishDate).getTime())
    .slice(0, limit)
    .map((s) => s.post)
    .concat(
      // top up with most recent if not enough related
      candidates
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
    )
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, limit);
}

/** The single featured (most recent published) post for the hero. */
export function getFeaturedPost(): PostSummary | null {
  return getAllPostSummaries({ includeDrafts: false })[0] ?? null;
}
