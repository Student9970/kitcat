"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Save, Send, ImageIcon, Wand2, Loader2, X, BookOpen } from "lucide-react";

import {
  api,
  estimateReadingTime,
  slugify,
  type AdminPost,
  type PostInput,
} from "@/lib/admin/client";
import { MediaLibrary } from "./MediaLibrary";
import { MdxCheatsheet } from "./MdxCheatsheet";

const today = () => new Date().toISOString().slice(0, 10);

function fieldClass() {
  return "w-full rounded-lg border border-default bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-brand-500";
}

export function PostEditor({
  post,
  categories,
  tags,
  onSaved,
  onCancel,
}: {
  post?: AdminPost | null;
  categories: string[];
  tags: string[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(post?.description ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tagsValue, setTagsValue] = useState((post?.tags ?? []).join(", "));
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [publishDate, setPublishDate] = useState(post?.publishDate || today());
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState(post?.status ?? "draft");

  const [showMedia, setShowMedia] = useState(false);
  const [showMdxGuide, setShowMdxGuide] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const insertAtRef = useRef({ start: 0, end: 0 });

  const computedSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title]
  );

  const reading = useMemo(() => estimateReadingTime(content), [content]);

  function autoFillMeta() {
    if (!seoTitle) setSeoTitle(title);
    if (!seoDescription) setSeoDescription(description);
    if (!slugTouched) setSlug(slugify(title));
  }

  function openMdxGuide() {
    const el = contentRef.current;
    insertAtRef.current = el
      ? { start: el.selectionStart, end: el.selectionEnd }
      : { start: content.length, end: content.length };
    setShowMdxGuide(true);
  }

  function insertSnippet(code: string) {
    const { start, end } = insertAtRef.current;
    const needsLeadingNewline = start > 0 && content[start - 1] !== "\n";
    const needsTrailingNewline = end < content.length && content[end] !== "\n";
    const text = `${needsLeadingNewline ? "\n\n" : ""}${code}${needsTrailingNewline ? "\n\n" : ""}`;
    const next = content.slice(0, start) + text + content.slice(end);
    const cursor = start + text.length;

    setContent(next);
    insertAtRef.current = { start: cursor, end: cursor };

    requestAnimationFrame(() => {
      const el = contentRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });

    setShowMdxGuide(false);
  }

  async function save(publish: boolean) {
    setError("");
    if (!title.trim()) return setError("Title is required.");
    setSaving(true);

    const input: PostInput = {
      title: title.trim(),
      slug: computedSlug || slugify(title),
      description: description.trim(),
      category: category.trim() || "Uncategorized",
      tags: tagsValue.split(",").map((t) => t.trim()).filter(Boolean),
      featuredImage: featuredImage.trim(),
      author: author.trim(),
      publishDate: publishDate || today(),
      seoTitle: (seoTitle || title).trim(),
      seoDescription: (seoDescription || description).trim(),
      status: publish ? "published" : status,
      content,
    };

    try {
      if (isEdit && post) {
        await api.updatePost(post.slug, input);
      } else {
        await api.createPost(input);
      }
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to posts
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-default px-4 py-2 text-sm font-semibold hover:bg-card disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save {status === "published" ? "" : "draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            <Send className="size-4" /> Publish
          </button>
        </div>
      </div>

      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit post" : "New post"}
      </h1>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={autoFillMeta}
              placeholder="Your amazing post title"
              className={fieldClass()}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              value={computedSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={fieldClass()}
            />
            <p className="mt-1 text-xs text-muted">Auto-generated from the title. Edit to override.</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="A short summary used in listings and meta tags."
              className={fieldClass()}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium">Content (MDX)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openMdxGuide}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                >
                  <BookOpen className="size-3.5" /> MDX guide
                </button>
                <span className="text-xs text-muted">{reading}</span>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onSelect={(e) => {
                insertAtRef.current = {
                  start: e.currentTarget.selectionStart,
                  end: e.currentTarget.selectionEnd,
                };
              }}
              rows={22}
              placeholder="Write your post in Markdown / MDX…"
              className={`${fieldClass()} font-mono leading-relaxed`}
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-default p-4">
            <h3 className="mb-3 text-sm font-semibold">Publish</h3>
            <label className="mb-1 block text-xs font-medium text-muted">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className={fieldClass()}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <label className="mb-1 mt-3 block text-xs font-medium text-muted">Publish date</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className={fieldClass()}
            />
          </div>

          <div className="rounded-xl border border-default p-4">
            <h3 className="mb-3 text-sm font-semibold">Featured image</h3>
            {featuredImage ? (
              <div className="relative mb-2 overflow-hidden rounded-lg border border-default">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt="" className="aspect-video w-full object-cover" />
                <button
                  onClick={() => setFeaturedImage("")}
                  className="absolute right-1.5 top-1.5 rounded-md bg-red-500 p-1 text-white"
                  aria-label="Remove featured image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="mb-2 flex aspect-video items-center justify-center rounded-lg border border-dashed border-default text-muted">
                <ImageIcon className="size-6" />
              </div>
            )}
            <input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="/uploads/your-image.jpg"
              className={fieldClass()}
            />
            <button
              onClick={() => setShowMedia(true)}
              className="mt-2 w-full rounded-lg border border-default py-2 text-sm font-medium hover:bg-card"
            >
              Choose from media library
            </button>
          </div>

          <div className="rounded-xl border border-default p-4">
            <h3 className="mb-3 text-sm font-semibold">Organization</h3>
            <label className="mb-1 block text-xs font-medium text-muted">Category</label>
            <input
              list="admin-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass()}
            />
            <datalist id="admin-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <label className="mb-1 mt-3 block text-xs font-medium text-muted">
              Tags (comma separated)
            </label>
            <input
              value={tagsValue}
              onChange={(e) => setTagsValue(e.target.value)}
              placeholder="tag one, tag two"
              className={fieldClass()}
            />
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.slice(0, 12).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      const set = new Set(
                        tagsValue.split(",").map((x) => x.trim()).filter(Boolean)
                      );
                      set.add(t);
                      setTagsValue(Array.from(set).join(", "));
                    }}
                    className="rounded-full border border-default px-2 py-0.5 text-xs text-muted hover:border-brand-500"
                  >
                    +{t}
                  </button>
                ))}
              </div>
            )}

            <label className="mb-1 mt-3 block text-xs font-medium text-muted">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={fieldClass()}
            />
          </div>

          <div className="rounded-xl border border-default p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">SEO</h3>
              <button
                type="button"
                onClick={autoFillMeta}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
              >
                <Wand2 className="size-3.5" /> Auto-fill
              </button>
            </div>
            <label className="mb-1 block text-xs font-medium text-muted">SEO title</label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title}
              className={fieldClass()}
            />
            <label className="mb-1 mt-3 block text-xs font-medium text-muted">
              SEO description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              placeholder={description}
              className={fieldClass()}
            />
          </div>
        </aside>
      </div>

      {showMdxGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">MDX writing guide</h2>
              <button onClick={() => setShowMdxGuide(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <MdxCheatsheet onInsert={insertSnippet} />
          </div>
        </div>
      )}

      {showMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Select featured image</h2>
              <button onClick={() => setShowMedia(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <MediaLibrary
              selectable
              selectedUrl={featuredImage}
              onSelect={(url) => {
                setFeaturedImage(url);
                setShowMedia(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
