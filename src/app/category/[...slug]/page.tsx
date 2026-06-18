import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getCategories, getCategoryBySlug, getPostsByCategory } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Container, PageHeader } from "@/components/layout/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

/** Parse `[categorySlug]` or `[categorySlug, "page", "2"]`. */
function parseSlug(parts: string[]): { slug: string; page: number } | null {
  if (parts.length === 1) return { slug: parts[0], page: 1 };
  if (parts.length === 3 && parts[1] === "page") {
    const page = Number(parts[2]);
    if (Number.isInteger(page) && page >= 2) return { slug: parts[0], page };
  }
  return null;
}

export function generateStaticParams() {
  const perPage = siteConfig.postsPerPage;
  const params: { slug: string[] }[] = [];
  for (const cat of getCategories()) {
    params.push({ slug: [cat.slug] });
    const pages = Math.ceil(cat.count / perPage);
    for (let p = 2; p <= pages; p++) {
      params.push({ slug: [cat.slug, "page", String(p)] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const category = getCategoryBySlug(parsed.slug);
  if (!category) return {};
  const suffix = parsed.page > 1 ? ` — Page ${parsed.page}` : "";
  return buildMetadata({
    title: `${category.name} Articles${suffix}`,
    description: `Browse all ${category.count} articles in ${category.name} on ${siteConfig.name}.`,
    path: parsed.page > 1 ? `/category/${parsed.slug}/page/${parsed.page}` : `/category/${parsed.slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const category = getCategoryBySlug(parsed.slug);
  if (!category) notFound();

  const posts = getPostsByCategory(parsed.slug);
  const perPage = siteConfig.postsPerPage;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  if (parsed.page > totalPages) notFound();

  const start = (parsed.page - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);
  const basePath = `/category/${parsed.slug}`;

  return (
    <Container className="py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Categories", url: "/categories" },
          { name: category.name, url: basePath },
        ])}
      />
      <Breadcrumb
        items={[
          { name: "Categories", url: "/categories" },
          { name: category.name, url: basePath },
        ]}
      />
      <PageHeader
        title={category.name}
        description={
          parsed.page > 1
            ? `Page ${parsed.page} of ${totalPages}`
            : `${category.count} ${category.count === 1 ? "article" : "articles"} in this category.`
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination currentPage={parsed.page} totalPages={totalPages} basePath={basePath} />
    </Container>
  );
}
