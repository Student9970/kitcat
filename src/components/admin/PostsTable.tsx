"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  FileUp,
  Eye,
  FileText,
} from "lucide-react";

import { api, type AdminPost } from "@/lib/admin/client";

type Filter = "all" | "published" | "draft";

export function PostsTable({
  posts,
  onEdit,
  onChanged,
}: {
  posts: AdminPost[];
  onEdit: (post: AdminPost) => void;
  onChanged: () => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter === "published" && p.status !== "published") return false;
      if (filter === "draft" && p.status !== "draft") return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, filter]);

  async function remove(post: AdminPost) {
    if (!confirm(`Delete "${post.title}"? This permanently removes the MDX file.`)) return;
    await api.deletePost(post.slug);
    onChanged();
  }

  async function promote(post: AdminPost) {
    await api.promoteDraft(post.slug);
    onChanged();
  }

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts]
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-default p-1 text-sm">
          {(["all", "published", "draft"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 font-medium capitalize ${
                filter === f ? "bg-brand-600 text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {f} <span className="opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-lg border border-default bg-[var(--background)] py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-default">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-default bg-card text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  <FileText className="mx-auto mb-2 size-7" />
                  No posts found.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={`${post.location}/${post.fileName}`} className="hover:bg-card">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-muted">
                      /{post.slug}
                      {post.location === "drafts" && (
                        <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                          drafts folder
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{post.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-500/15 text-green-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{post.publishDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview"
                        className="rounded-md p-1.5 text-muted hover:bg-brand-500/10 hover:text-brand-600"
                      >
                        {post.status === "published" ? (
                          <ExternalLink className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </a>
                      {post.location === "drafts" && (
                        <button
                          onClick={() => promote(post)}
                          title="Move to /content/posts"
                          className="rounded-md p-1.5 text-muted hover:bg-brand-500/10 hover:text-brand-600"
                        >
                          <FileUp className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(post)}
                        title="Edit"
                        className="rounded-md p-1.5 text-muted hover:bg-brand-500/10 hover:text-brand-600"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => remove(post)}
                        title="Delete"
                        className="rounded-md p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
