import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostsByTag, getTagBySlug, getTags } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  return { title: tag ? `#${tag.name}` : "Tag" };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const posts = getPostsByTag(slug);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">#{tag.name}</h1>
      <p className="mt-2 text-muted">{tag.count} article{tag.count === 1 ? "" : "s"}</p>
      <ul className="mt-8 space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/blog/${post.slug}`} className="text-brand-600 hover:underline">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
