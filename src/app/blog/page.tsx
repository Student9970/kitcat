import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getAllPostSummaries } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Container, PageHeader } from "@/components/layout/Container";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: `All articles from ${siteConfig.name}.`,
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPostSummaries({ includeDrafts: false });
  const perPage = siteConfig.postsPerPage;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const pagePosts = posts.slice(0, perPage);

  return (
    <Container className="py-10">
      <JsonLd data={breadcrumbSchema([{ name: "Blog", url: "/blog" }])} />
      <Breadcrumb items={[{ name: "Blog", url: "/blog" }]} />
      <PageHeader
        title="The Journal"
        description={`${posts.length} ${posts.length === 1 ? "article" : "articles"} and counting.`}
      />

      {pagePosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post, i) => (
            <ArticleCard key={post.slug} post={post} priority={i < 3} />
          ))}
        </div>
      ) : (
        <p className="text-muted">No published articles yet. Check back soon!</p>
      )}

      <Pagination currentPage={1} totalPages={totalPages} basePath="/blog" />
    </Container>
  );
}
