import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Static-export friendly pagination. `basePath` is the route prefix, e.g.
 * "/blog" produces "/blog", "/blog/page/2", "/blog/page/3" ...
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (page: number) =>
    page === 1 ? `${basePath}` : `${basePath}/page/${page}`;

  const pages: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btnBase =
    "inline-flex size-10 items-center justify-center rounded-full border border-brand-200/80 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-cat dark:border-brand-800/60 dark:hover:bg-brand-950/50";

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={btnBase} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(btnBase, "opacity-40")}>
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-all",
              p === currentPage
                ? "border-brand-500 bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-cat"
                : "border-brand-200/80 hover:border-brand-300 hover:bg-brand-50 dark:border-brand-800/60 dark:hover:bg-brand-950/50"
            )}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={btnBase} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(btnBase, "opacity-40")}>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
