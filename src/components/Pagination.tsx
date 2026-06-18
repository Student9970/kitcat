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

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-default hover:bg-card"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-10 items-center justify-center rounded-lg border border-default opacity-40">
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
              "inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium",
              p === currentPage
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-default hover:bg-card"
            )}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-default hover:bg-card"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="inline-flex size-10 items-center justify-center rounded-lg border border-default opacity-40">
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
