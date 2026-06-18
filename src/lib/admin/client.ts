"use client";

import type { PostStatus } from "@/lib/types";

export interface AdminPost {
  title: string;
  slug: string;
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
  readingTime: string;
  wordCount: number;
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
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
  content: string;
}

export interface UploadedImage {
  name: string;
  url: string;
  size: number;
  modified: string;
}

const PASSWORD_KEY = "admin_password";

export const auth = {
  get: () => (typeof window === "undefined" ? "" : sessionStorage.getItem(PASSWORD_KEY) ?? ""),
  set: (pw: string) => sessionStorage.setItem(PASSWORD_KEY, pw),
  clear: () => sessionStorage.removeItem(PASSWORD_KEY),
};

function headers(extra?: Record<string, string>) {
  return { "x-admin-password": auth.get(), ...extra };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async login(password: string): Promise<boolean> {
    const res = await fetch("/api/admin/auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  },

  async listPosts(): Promise<AdminPost[]> {
    const data = await handle<{ posts: AdminPost[] }>(
      await fetch("/api/admin/posts/", { headers: headers() })
    );
    return data.posts;
  },

  async getPost(slug: string): Promise<AdminPost> {
    const data = await handle<{ post: AdminPost }>(
      await fetch(`/api/admin/posts/${slug}/`, { headers: headers() })
    );
    return data.post;
  },

  async createPost(input: PostInput): Promise<AdminPost> {
    const data = await handle<{ post: AdminPost }>(
      await fetch("/api/admin/posts/", {
        method: "POST",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(input),
      })
    );
    return data.post;
  },

  async updatePost(slug: string, input: PostInput): Promise<AdminPost> {
    const data = await handle<{ post: AdminPost }>(
      await fetch(`/api/admin/posts/${slug}/`, {
        method: "PUT",
        headers: headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(input),
      })
    );
    return data.post;
  },

  async deletePost(slug: string): Promise<void> {
    await handle(
      await fetch(`/api/admin/posts/${slug}/`, { method: "DELETE", headers: headers() })
    );
  },

  async promoteDraft(slug: string): Promise<void> {
    await handle(
      await fetch(`/api/admin/posts/${slug}/`, { method: "PATCH", headers: headers() })
    );
  },

  async taxonomy(): Promise<{ categories: string[]; tags: string[] }> {
    return handle(await fetch("/api/admin/taxonomy/", { headers: headers() }));
  },

  async listImages(): Promise<UploadedImage[]> {
    const data = await handle<{ images: UploadedImage[] }>(
      await fetch("/api/admin/upload/", { headers: headers() })
    );
    return data.images;
  },

  async uploadImage(file: File): Promise<UploadedImage> {
    const form = new FormData();
    form.append("file", file);
    const data = await handle<{ image: UploadedImage }>(
      await fetch("/api/admin/upload/", { method: "POST", headers: headers(), body: form })
    );
    return data.image;
  },

  async deleteImage(name: string): Promise<void> {
    await handle(
      await fetch(`/api/admin/upload/?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: headers(),
      })
    );
  },
};

/** Slugify mirrors src/lib/utils slugify for live previews in the editor. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 225));
  return `${minutes} min read (${words} words)`;
}
