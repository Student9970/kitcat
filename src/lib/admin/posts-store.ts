import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import type { PostFrontmatter, PostStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const DRAFTS_DIR = path.join(ROOT, "content", "drafts");
const SEARCH_INDEX = path.join(ROOT, "public", "search-index.json");

function ensureDirs() {
  for (const dir of [POSTS_DIR, DRAFTS_DIR, path.dirname(SEARCH_INDEX)]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

export interface AdminPost extends PostFrontmatter {
  content: string;
  readingTime: string;
  wordCount: number;
  /** "posts" or "drafts" — which folder the file lives in. */
  location: "posts" | "drafts";
  fileName: string;
}

export interface PostInput {
  title: string;
  slug?: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
  content: string;
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((t) => String(t));
  if (typeof value === "string")
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function readFolder(dir: string, location: "posts" | "drafts"): AdminPost[] {
  ensureDirs();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((fileName) => {
      const raw = fs.readFileSync(path.join(dir, fileName), "utf8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      const fallbackSlug = fileName.replace(/\.mdx?$/, "");
      return {
        title: String(data.title ?? "Untitled"),
        slug: String(data.slug ?? fallbackSlug),
        description: String(data.description ?? ""),
        category: String(data.category ?? "Uncategorized"),
        tags: normalizeTags(data.tags),
        featuredImage: String(data.featuredImage ?? ""),
        author: String(data.author ?? ""),
        publishDate: String(data.publishDate ?? ""),
        updatedDate: data.updatedDate ? String(data.updatedDate) : undefined,
        seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
        seoDescription: data.seoDescription ? String(data.seoDescription) : undefined,
        status: (data.status === "published" ? "published" : "draft") as PostStatus,
        content,
        readingTime: stats.text,
        wordCount: stats.words,
        location,
        fileName,
      };
    });
}

export function listAllPosts(): AdminPost[] {
  return [...readFolder(POSTS_DIR, "posts"), ...readFolder(DRAFTS_DIR, "drafts")].sort(
    (a, b) => (b.publishDate > a.publishDate ? 1 : -1)
  );
}

export function getPostBySlug(slug: string): AdminPost | null {
  return listAllPosts().find((p) => p.slug === slug) ?? null;
}

function frontmatterObject(input: PostInput): PostFrontmatter {
  // Insertion order controls the YAML key order in the saved file.
  return {
    title: input.title,
    slug: input.slug || slugify(input.title),
    description: input.description,
    category: input.category,
    tags: input.tags,
    featuredImage: input.featuredImage,
    author: input.author,
    publishDate: input.publishDate,
    ...(input.updatedDate ? { updatedDate: input.updatedDate } : {}),
    ...(input.seoTitle ? { seoTitle: input.seoTitle } : {}),
    ...(input.seoDescription ? { seoDescription: input.seoDescription } : {}),
    status: input.status,
  };
}

function writeMdx(dir: string, fileName: string, input: PostInput) {
  ensureDirs();
  const file = matter.stringify(`\n${input.content.trim()}\n`, frontmatterObject(input));
  fs.writeFileSync(path.join(dir, fileName), file, "utf8");
  regenerateSearchIndex();
}

export class SlugConflictError extends Error {}

export function createPost(input: PostInput): AdminPost {
  const slug = input.slug || slugify(input.title);
  const fileName = `${slug}.mdx`;
  if (fs.existsSync(path.join(POSTS_DIR, fileName))) {
    throw new SlugConflictError(`A post with slug "${slug}" already exists.`);
  }
  writeMdx(POSTS_DIR, fileName, { ...input, slug });
  return getPostBySlug(slug)!;
}

export function updatePost(originalSlug: string, input: PostInput): AdminPost {
  const existing = getPostBySlug(originalSlug);
  if (!existing) throw new Error(`Post "${originalSlug}" not found.`);

  const dir = existing.location === "drafts" ? DRAFTS_DIR : POSTS_DIR;
  const newSlug = input.slug || slugify(input.title);
  const newFileName = `${newSlug}.mdx`;

  // Always set updatedDate when editing.
  const payload: PostInput = {
    ...input,
    slug: newSlug,
    updatedDate: new Date().toISOString().slice(0, 10),
  };

  // Remove the old file if the slug/filename changed.
  const oldPath = path.join(dir, existing.fileName);
  if (existing.fileName !== newFileName && fs.existsSync(oldPath)) {
    fs.rmSync(oldPath);
  }
  writeMdx(dir, newFileName, payload);
  return getPostBySlug(newSlug)!;
}

export function deletePost(slug: string): void {
  const existing = getPostBySlug(slug);
  if (!existing) return;
  const dir = existing.location === "drafts" ? DRAFTS_DIR : POSTS_DIR;
  const filePath = path.join(dir, existing.fileName);
  if (fs.existsSync(filePath)) fs.rmSync(filePath);
  regenerateSearchIndex();
}

/** Move a file from /content/drafts into /content/posts (keeps its status). */
export function promoteDraftFile(slug: string): AdminPost {
  const existing = getPostBySlug(slug);
  if (!existing || existing.location !== "drafts") {
    throw new Error("Draft-folder post not found.");
  }
  const from = path.join(DRAFTS_DIR, existing.fileName);
  const to = path.join(POSTS_DIR, existing.fileName);
  fs.renameSync(from, to);
  regenerateSearchIndex();
  return getPostBySlug(slug)!;
}

function stripMdx(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*`_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Rebuild public/search-index.json from published posts. */
export function regenerateSearchIndex(): void {
  ensureDirs();
  const index = readFolder(POSTS_DIR, "posts")
    .filter((p) => p.status === "published")
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      tags: p.tags,
      featuredImage: p.featuredImage,
      publishDate: p.publishDate,
      content: stripMdx(p.content).slice(0, 2000),
    }));
  fs.writeFileSync(SEARCH_INDEX, JSON.stringify(index), "utf8");
}

export function listCategories(): string[] {
  const set = new Set<string>();
  for (const p of listAllPosts()) set.add(p.category);
  return Array.from(set).sort();
}

export function listTags(): string[] {
  const set = new Set<string>();
  for (const p of listAllPosts()) for (const t of p.tags) set.add(t);
  return Array.from(set).sort();
}
