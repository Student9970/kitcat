import type { Metadata } from "next";

import { getCategories, getTags } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/layout/Container";
import { CategoryCard } from "@/components/CategoryCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description: "Browse all article categories and topics.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categories = getCategories();
  const tags = getTags();

  return (
    <Container className="py-10">
      <Breadcrumb items={[{ name: "Categories", url: "/categories" }]} />
      <PageHeader title="Categories" description="Find articles by the topics you care about." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>

      {tags.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-bold">Popular tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="rounded-full border border-default bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                #{tag.name} <span className="text-xs opacity-60">({tag.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
