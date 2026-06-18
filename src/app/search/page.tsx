import type { Metadata } from "next";
import { Suspense } from "react";

import { buildMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search across all articles.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ name: "Search", url: "/search" }]} />
      <PageHeader title="Search" description="Find exactly what you're looking for." />
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <SearchResults />
      </Suspense>
    </Container>
  );
}
