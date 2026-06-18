"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse, { type FuseResult } from "fuse.js";

export interface SearchDoc {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  publishDate: string;
  content: string;
}

let cachedIndex: SearchDoc[] | null = null;
let inflight: Promise<SearchDoc[]> | null = null;

async function loadIndex(): Promise<SearchDoc[]> {
  if (cachedIndex) return cachedIndex;
  if (inflight) return inflight;
  inflight = fetch("/search-index.json")
    .then((res) => (res.ok ? res.json() : []))
    .then((data: SearchDoc[]) => {
      cachedIndex = data;
      return data;
    })
    .catch(() => []);
  return inflight;
}

const fuseOptions = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.25 },
    { name: "category", weight: 0.15 },
    { name: "description", weight: 0.1 },
    { name: "content", weight: 0.1 },
  ],
};

export function useSearch(query: string, limit = 10) {
  const [docs, setDocs] = useState<SearchDoc[]>(cachedIndex ?? []);
  const [ready, setReady] = useState<boolean>(!!cachedIndex);

  useEffect(() => {
    let active = true;
    loadIndex().then((data) => {
      if (!active) return;
      setDocs(data);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const fuse = useMemo(() => {
    if (!docs.length) return null;
    return new Fuse(docs, fuseOptions);
  }, [docs]);

  const results: SearchDoc[] = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    if (!fuse) return [];
    return fuse
      .search(q)
      .slice(0, limit)
      .map((r: FuseResult<SearchDoc>) => r.item);
  }, [query, fuse, limit]);

  return { results, ready, total: docs.length };
}
