import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getAllPostSummaries,
  getCategories,
  getFeaturedPost,
} from "@/lib/posts";
import { Container } from "@/components/layout/Container";
import { FeaturedPost } from "@/components/FeaturedPost";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { NewsletterSection } from "@/components/NewsletterSection";
import { HeaderAd } from "@/components/ads/AdSlot";

export default function HomePage() {
  const featured = getFeaturedPost();
  const allPosts = getAllPostSummaries({ includeDrafts: false });
  const latest = featured
    ? allPosts.filter((p) => p.slug !== featured.slug).slice(0, 6)
    : allPosts.slice(0, 6);
  const categories = getCategories().slice(0, 6);

  return (
    <>
      <div className="bg-hero-wash">
        <Container className="py-12 md:py-16">
          <HeaderAd className="mx-auto mb-8" />

          <section className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50/80 px-4 py-1.5 text-sm font-semibold text-brand-600 backdrop-blur-sm dark:border-brand-800/60 dark:bg-brand-950/40 dark:text-brand-300">
              <Sparkles className="size-3.5" />
              {siteConfig.tagline}
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              {siteConfig.description}
            </p>
          </section>

          {featured && (
            <section className="mt-10">
              <FeaturedPost post={featured} />
            </section>
          )}
        </Container>
      </div>

      {latest.length > 0 && (
        <Container className="py-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">Latest purrs & posts</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all hover:gap-2 hover:text-brand-700"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, i) => (
              <ArticleCard key={post.slug} post={post} priority={i < 3} />
            ))}
          </div>
        </Container>
      )}

      {categories.length > 0 && (
        <Container className="py-12">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">Browse by category</h2>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all hover:gap-2 hover:text-brand-700"
            >
              All categories <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </Container>
      )}

      <Container className="py-12">
        <NewsletterSection />
      </Container>
    </>
  );
}
