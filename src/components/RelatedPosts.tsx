import type { PostSummary } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16 border-t border-default pt-12">
      <h2 className="mb-8 text-2xl font-bold">Related articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
