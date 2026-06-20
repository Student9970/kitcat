"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";

import { useSearch } from "@/lib/use-search";
import { useSearchLoadingBar } from "@/hooks/use-search-loading-bar";
import { useLoadingBar } from "@/components/loading/LoadingBarProvider";
import { cn } from "@/lib/utils";

/**
 * Header search box with an instant-results dropdown.
 * Enter (or "View all results") navigates to the full /search page.
 */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { start } = useLoadingBar();
  const { results, ready, loading } = useSearch(query, 6);
  useSearchLoadingBar(loading, query);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    start();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-full border border-brand-200/80 bg-card py-2 pl-9 pr-9 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-brand-800/60 dark:focus:ring-brand-800/40"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {open && query.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-brand-200/80 bg-card shadow-cat-lg dark:border-brand-800/60">
          {!ready ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 transition-colors hover:bg-brand-500/10"
                  >
                    <span className="block text-sm font-medium">{r.title}</span>
                    <span className="block text-xs text-muted">{r.category}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-default">
                <button
                  onClick={submit}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-brand-600 hover:bg-brand-500/10"
                >
                  View all results for “{query.trim()}”
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
