import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

import type { PostSummary } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";

export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-brand-200/70 bg-card shadow-cat-lg transition-all hover:border-brand-300 dark:border-brand-800/50">
      <div className="grid lg:grid-cols-2">
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]"
        >
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-brand-300 via-brand-400 to-lavender-200" />
          )}
        </Link>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-cat">
              Featured
            </span>
            <Link
              href={`/category/${slugify(post.category)}`}
              className="text-xs font-semibold uppercase tracking-wider text-brand-600 hover:text-brand-700"
            >
              {post.category}
            </Link>
          </div>

          <h2 className="mt-4 font-serif text-2xl font-bold leading-tight md:text-4xl">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand-600">
              {post.title}
            </Link>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{post.description}</p>

          <div className="mt-6 flex items-center gap-4 text-sm text-muted">
            <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
            <span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" />
              {post.readingTime}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white shadow-cat transition-all hover:gap-3 hover:from-brand-600 hover:to-brand-700 hover:shadow-cat-lg"
          >
            Read article
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
