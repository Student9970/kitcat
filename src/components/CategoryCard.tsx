import Link from "next/link";
import { Folder, ArrowUpRight } from "lucide-react";

import type { Taxonomy } from "@/lib/types";

export function CategoryCard({ category }: { category: Taxonomy }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex items-center justify-between rounded-2xl border border-default bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
          <Folder className="size-6" />
        </span>
        <div>
          <h3 className="font-bold group-hover:text-brand-600">{category.name}</h3>
          <p className="text-sm text-muted">
            {category.count} {category.count === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>
      <ArrowUpRight className="size-5 text-muted transition-colors group-hover:text-brand-600" />
    </Link>
  );
}
