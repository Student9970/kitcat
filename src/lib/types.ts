export type PostStatus = "draft" | "published";

/** Raw frontmatter as authored in an MDX file. */
export interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  publishDate: string; // ISO date
  updatedDate?: string; // ISO date
  seoTitle?: string;
  seoDescription?: string;
  status: PostStatus;
}

/** A fully resolved post including computed fields and raw MDX body. */
export interface Post extends PostFrontmatter {
  /** Raw MDX content (without frontmatter). */
  content: string;
  /** Human-readable reading time, e.g. "5 min read". */
  readingTime: string;
  /** Word count of the body. */
  wordCount: number;
  /** Extracted heading anchors for the table of contents. */
  headings: TocHeading[];
  /** Absolute path of the source file (used by the dev admin only). */
  filePath: string;
}

/** Lightweight post shape for listings, cards and the search index. */
export interface PostSummary {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  readingTime: string;
  status: PostStatus;
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface Taxonomy {
  name: string;
  slug: string;
  count: number;
}
