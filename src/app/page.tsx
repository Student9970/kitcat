import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <Container className="py-10">
        <HeaderAd className="mx-auto mb-8" />

        <section className="mb-6 text-center">
          <span className="inline-block rounded-full bg-brand-500/10 px-4 py-1.5 text-sm font-semibold text-brand-600">
            {siteConfig.tagline}
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            {siteConfig.description}
          </p>
        </section>

        {featured && (
          <section className="mt-8">
            <FeaturedPost post={featured} />
          </section>
        )}
      </Container>

      {latest.length > 0 && (
        <Container className="py-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Latest articles</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
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
        <Container className="py-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Browse by category</h2>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
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

      <Container className="py-10">
        <NewsletterSection />
      </Container>
    </>
  );
}
