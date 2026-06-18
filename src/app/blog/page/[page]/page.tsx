import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getAllPostSummaries } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/layout/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumb } from "@/components/Breadcrumb";

interface Props {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

function totalPages() {
  const posts = getAllPostSummaries({ includeDrafts: false });
  return Math.max(1, Math.ceil(posts.length / siteConfig.postsPerPage));
}

export function generateStaticParams() {
  // Generate 1..N so this route is never empty (required by output: export).
  // Page 1 is canonicalised to /blog to avoid duplicate content.
  const pages = totalPages();
  return Array.from({ length: pages }, (_, i) => ({ page: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = Number(page);
  return buildMetadata({
    title: pageNum > 1 ? `Blog — Page ${page}` : "Blog",
    // Page 1 canonicalises to the main /blog listing.
    path: pageNum > 1 ? `/blog/page/${page}` : "/blog",
  });
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNum = Number(page);
  const pages = totalPages();

  if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > pages) {
    notFound();
  }

  const posts = getAllPostSummaries({ includeDrafts: false });
  const perPage = siteConfig.postsPerPage;
  const start = (pageNum - 1) * perPage;
  const pagePosts = posts.slice(start, start + perPage);

  return (
    <Container className="py-10">
      <Breadcrumb
        items={[
          { name: "Blog", url: "/blog" },
          ...(pageNum > 1 ? [{ name: `Page ${pageNum}`, url: `/blog/page/${pageNum}` }] : []),
        ]}
      />
      <PageHeader title="The Blog" description={`Page ${pageNum} of ${pages}`} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pagePosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination currentPage={pageNum} totalPages={pages} basePath="/blog" />
    </Container>
  );
}
