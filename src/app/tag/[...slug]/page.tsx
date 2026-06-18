import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getTags, getTagBySlug, getPostsByTag } from "@/lib/posts";
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
  for (const tag of getTags()) {
    params.push({ slug: [tag.slug] });
    const pages = Math.ceil(tag.count / perPage);
    for (let p = 2; p <= pages; p++) {
      params.push({ slug: [tag.slug, "page", String(p)] });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const tag = getTagBySlug(parsed.slug);
  if (!tag) return {};
  const suffix = parsed.page > 1 ? ` — Page ${parsed.page}` : "";
  return buildMetadata({
    title: `#${tag.name}${suffix}`,
    description: `Articles tagged “${tag.name}” on ${siteConfig.name}.`,
    path: parsed.page > 1 ? `/tag/${parsed.slug}/page/${parsed.page}` : `/tag/${parsed.slug}`,
  });
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const tag = getTagBySlug(parsed.slug);
  if (!tag) notFound();

  const posts = getPostsByTag(parsed.slug);
  const perPage = siteConfig.postsPerPage;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  if (parsed.page > totalPages) notFound();

  const start = (parsed.page - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);
  const basePath = `/tag/${parsed.slug}`;

  return (
    <Container className="py-10">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Tags", url: "/categories" },
          { name: `#${tag.name}`, url: basePath },
        ])}
      />
      <Breadcrumb items={[{ name: `#${tag.name}`, url: basePath }]} />
      <PageHeader
        title={`#${tag.name}`}
        description={
          parsed.page > 1
            ? `Page ${parsed.page} of ${totalPages}`
            : `${tag.count} ${tag.count === 1 ? "article" : "articles"} tagged with “${tag.name}”.`
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
