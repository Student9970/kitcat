"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

import { useSearch } from "@/lib/use-search";
import { useSearchLoadingBar } from "@/hooks/use-search-loading-bar";
import { formatDate } from "@/lib/utils";

export function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const { results, ready, loading, total } = useSearch(query, 50);
  useSearchLoadingBar(loading, query);

  // Keep the URL in sync (shallow) as the user types.
  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      router.replace(`/search${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(id);
  }, [query, router]);

  return (
    <div>
      <div className="relative mb-8 max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${total || ""} articles…`}
          aria-label="Search articles"
          className="w-full rounded-full border border-brand-200/80 bg-card py-3.5 pl-12 pr-4 text-lg outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-brand-800/60 dark:focus:ring-brand-800/40"
        />
      </div>

      {!query.trim() ? (
        <p className="text-muted">Start typing to search across all articles.</p>
      ) : !ready ? (
        <p className="text-muted">Loading search index…</p>
      ) : results.length === 0 ? (
        <p className="text-muted">
          No results for “<span className="font-medium text-foreground">{query}</span>”. Try a different keyword.
        </p>
      ) : (
        <>
          <p className="mb-6 text-sm text-muted">
            {results.length} {results.length === 1 ? "result" : "results"} for “
            <span className="font-medium text-foreground">{query.trim()}</span>”
          </p>
          <ul className="divide-y divide-[var(--border)]">
            {results.map((r) => (
              <li key={r.slug} className="py-5">
                <Link href={`/blog/${r.slug}`} className="group block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {r.category}
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-bold transition-colors group-hover:text-brand-600">
                    {r.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-muted">{r.description}</p>
                  {r.publishDate && (
                    <time className="mt-2 block text-xs text-muted" dateTime={r.publishDate}>
                      {formatDate(r.publishDate)}
                    </time>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
