import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, User } from "lucide-react";

import { siteConfig } from "@/config/site";
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { buildPostMetadata } from "@/lib/seo";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  extractFaqFromContent,
} from "@/lib/structured-data";
import { formatDate, slugify } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { TableOfContents } from "@/components/TableOfContents";
import { SocialShare } from "@/components/SocialShare";
import { RelatedPosts } from "@/components/RelatedPosts";
import { MdxContent } from "@/components/mdx/MdxContent";
import { SidebarAd } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, 3);
  const faqs = extractFaqFromContent(post.content);

  const schemas: Record<string, unknown>[] = [
    blogPostingSchema(post),
    breadcrumbSchema([
      { name: "Blog", url: "/blog" },
      { name: post.category, url: `/category/${slugify(post.category)}` },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
  ];
  if (faqs.length) schemas.push(faqSchema(faqs));

  return (
    <Container className="py-10">
      <JsonLd data={schemas} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          items={[
            { name: "Blog", url: "/blog" },
            { name: post.category, url: `/category/${slugify(post.category)}` },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />

        <header className="mb-8">
          <Link
            href={`/category/${slugify(post.category)}`}
            className="text-sm font-semibold uppercase tracking-wider text-brand-600 hover:underline"
          >
            {post.category}
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" />
              {post.author || siteConfig.author.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {post.featuredImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-default">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:scroll-mt-24 prose-a:text-brand-600 prose-img:rounded-xl">
            <MdxContent source={post.content} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${slugify(tag)}`}
                  className="rounded-full border border-default bg-card px-3 py-1 text-sm text-muted transition-colors hover:border-brand-500 hover:text-brand-600"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-default pt-6">
            <SocialShare slug={post.slug} title={post.title} />
            {post.updatedDate && (
              <p className="text-xs text-muted">
                Updated {formatDate(post.updatedDate)}
              </p>
            )}
          </div>

          <RelatedPosts posts={related} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <TableOfContents headings={post.headings} />
            <SidebarAd />
          </div>
        </aside>
      </div>
    </Container>
  );
}
