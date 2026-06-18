// Generates public/search-index.json from published MDX posts.
// Runs automatically before `dev` and `build` (see package.json), and can be
// run manually with `npm run search-index`.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const OUTPUT = path.join(ROOT, "public", "search-index.json");

function stripMdx(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/<[^>]+>/g, " ") // jsx/html tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/[#>*`_~|-]/g, " ") // markdown punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f));

  const index = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (data.status !== "published") continue;

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string"
        ? data.tags.split(",").map((t) => t.trim())
        : [];

    index.push({
      title: String(data.title ?? "Untitled"),
      slug: String(data.slug ?? file.replace(/\.mdx?$/, "")),
      description: String(data.description ?? ""),
      category: String(data.category ?? ""),
      tags,
      featuredImage: String(data.featuredImage ?? ""),
      publishDate: String(data.publishDate ?? ""),
      // Truncated body text keeps the index small but searchable.
      content: stripMdx(content).slice(0, 2000),
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(index), "utf8");
  console.log(`[search-index] wrote ${index.length} posts -> ${path.relative(ROOT, OUTPUT)}`);
}

build();
