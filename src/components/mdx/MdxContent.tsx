import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";

import { AffiliateProduct } from "@/components/AffiliateProduct";
import { InContentAd } from "@/components/ads/AdSlot";
import { Callout } from "./Callout";

/* eslint-disable @typescript-eslint/no-explicit-any */

const components = {
  a: ({ href = "", children, ...props }: any) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "", ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="mx-auto rounded-xl border border-default"
      {...props}
    />
  ),
  // Custom components available to authors directly in MDX:
  Callout,
  AffiliateProduct,
  InContentAd,
};

/**
 * Server component that compiles & renders MDX at build time (SSG-friendly).
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            rehypeHighlight,
          ],
        },
      }}
    />
  );
}
