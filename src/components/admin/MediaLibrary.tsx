"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Check, ImageIcon, Loader2 } from "lucide-react";

import { api, type UploadedImage } from "@/lib/admin/client";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary({
  selectable = false,
  selectedUrl,
  onSelect,
}: {
  selectable?: boolean;
  selectedUrl?: string;
  onSelect?: (url: string) => void;
}) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      setImages(await api.listImages());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial load of uploaded images on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        await api.uploadImage(file);
      }
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.deleteImage(name);
    await refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFiles(e.dataTransfer.files);
          }}
          className="flex-1 rounded-xl border-2 border-dashed border-default p-4 text-center text-sm text-muted"
        >
          Drag &amp; drop images here, or
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="ml-1 font-semibold text-brand-600 hover:underline"
          >
            browse
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">Loading images…</p>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-default py-10 text-muted">
          <ImageIcon className="size-8" />
          <p className="text-sm">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => {
            const isSelected = selectedUrl === img.url;
            return (
              <div
                key={img.name}
                className={`group relative overflow-hidden rounded-xl border ${
                  isSelected ? "border-brand-600 ring-2 ring-brand-600" : "border-default"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="aspect-square w-full bg-white object-contain"
                />
                <div className="p-2">
                  <p className="truncate text-xs font-medium" title={img.name}>
                    {img.name}
                  </p>
                  <p className="text-[10px] text-muted">{formatSize(img.size)}</p>
                </div>

                <div className="absolute inset-x-0 top-0 flex justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {selectable && (
                    <button
                      type="button"
                      onClick={() => onSelect?.(img.url)}
                      className="rounded-md bg-brand-600 px-2 py-1 text-[11px] font-semibold text-white"
                    >
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(img.name)}
                    className="ml-auto rounded-md bg-red-500 p-1 text-white"
                    aria-label={`Delete ${img.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {isSelected && (
                  <span className="absolute bottom-2 right-2 rounded-full bg-brand-600 p-1 text-white">
                    <Check className="size-3.5" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
