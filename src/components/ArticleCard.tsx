import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import type { PostSummary } from "@/lib/types";
import { cn, formatDate, slugify } from "@/lib/utils";

export function ArticleCard({
  post,
  className,
  priority = false,
}: {
  post: PostSummary;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-200/70 bg-card transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-cat-lg dark:border-brand-800/50",
        className
      )}
    >
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-brand-400 to-brand-700" />
        )}
        {post.status === "draft" && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
            Draft
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/category/${slugify(post.category)}`}
          className="text-xs font-semibold uppercase tracking-wider text-brand-600 hover:text-brand-700"
        >
          {post.category}
        </Link>

        <h3 className="mt-2 font-serif text-lg font-bold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{post.description}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}
