import Link from "next/link";
import { Cat, ArrowUpRight } from "lucide-react";

import type { Taxonomy } from "@/lib/types";

export function CategoryCard({ category }: { category: Taxonomy }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex items-center justify-between rounded-3xl border border-brand-200/70 bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-cat-lg dark:border-brand-800/50"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-lavender-100 text-brand-600 dark:from-brand-900/60 dark:to-brand-950/40 dark:text-brand-300">
          <Cat className="size-6" />
        </span>
        <div>
          <h3 className="font-serif font-bold transition-colors group-hover:text-brand-600">
            {category.name}
          </h3>
          <p className="text-sm text-muted">
            {category.count} {category.count === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>
      <ArrowUpRight className="size-5 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
    </Link>
  );
}
