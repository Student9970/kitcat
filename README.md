# Niche Blog Platform

A production-ready, **SEO-first**, niche-agnostic blogging platform built with
**Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. Content is
stored as local **MDX files** — no database, no external CMS — and the site exports
to fully static HTML for deployment on **Cloudflare Pages** (or any static host).

A local, **development-only admin dashboard** lets you create, edit, and publish
posts and manage images by writing directly to the `/content` and `/public/uploads`
folders. The admin is **physically excluded from production builds**.

---

## Features

- **Pages**: Home, blog listing (paginated), single post, category & tag archives
  (paginated), search, about, contact, privacy policy, disclaimer, custom 404.
- **Design**: Modern, clean, magazine-style, mobile-first, dark mode, great
  typography (`@tailwindcss/typography`), responsive cards.
- **Content**: Local MDX with full frontmatter, drafts/published workflow, reading
  time, table of contents, related posts.
- **SEO**: Dynamic Metadata API, Open Graph, Twitter cards, canonical URLs, XML
  sitemap, RSS feed, `robots.txt`, web manifest, and automatic JSON-LD structured
  data (`Organization`, `WebSite`, `BlogPosting`, `BreadcrumbList`, `FAQPage`).
- **Search**: Instant client-side fuzzy search (title, content, tags, category) via
  a build-time generated index.
- **Admin** (dev only): Password-protected dashboard — create/edit/delete posts,
  manage categories & tags, upload/preview/delete images, auto-slug, auto reading
  time, auto metadata, draft/publish workflow, filterable & searchable posts table.
- **Monetization-ready**: `HeaderAd`, `InContentAd`, `SidebarAd`, `FooterAd`
  (disabled by default) and an `AffiliateProduct` component (image, pros/cons, CTA).
- **Analytics-ready**: Env placeholders for Google Analytics, Google Search Console,
  and Microsoft Clarity.
- **Performance**: Static Site Generation, font optimization, lazy-loaded images,
  code splitting, minimal client JS.

---

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 16 (App Router, `output: export`)         |
| Language       | TypeScript                                        |
| Styling        | Tailwind CSS v4 + `@tailwindcss/typography`       |
| Content        | MDX + `gray-matter` + `next-mdx-remote`           |
| Search         | `fuse.js` over a build-time JSON index            |
| Theming        | `next-themes` (system / light / dark)             |
| Icons          | `lucide-react`                                     |
| Deployment     | Cloudflare Pages (static)                         |

---

## Folder structure

```
.
├── content/
│   ├── posts/            # Published & draft MDX posts (the live content)
│   └── drafts/           # Scratch / work-in-progress MDX (never published)
├── public/
│   ├── images/           # Static images (logo, OG, post heroes)
│   ├── uploads/          # Images uploaded via the admin dashboard
│   ├── _headers          # Cloudflare Pages headers
│   └── _redirects        # Cloudflare Pages redirects
├── scripts/
│   └── build-search-index.mjs   # Generates public/search-index.json
├── src/
│   ├── app/
│   │   ├── admin/                # DEV-ONLY dashboard (page.dev.tsx)
│   │   ├── api/admin/            # DEV-ONLY route handlers (*.dev.ts)
│   │   ├── blog/                 # Listing, pagination, [slug] post pages
│   │   ├── category/ tag/        # Taxonomy archives + pagination
│   │   ├── search/ about/ contact/ privacy-policy/ disclaimer/
│   │   ├── sitemap.ts robots.ts manifest.ts rss.xml/route.ts
│   │   ├── layout.tsx not-found.tsx globals.css icon.svg
│   ├── components/              # Header, Footer, ArticleCard, ... + admin/
│   ├── config/                  # site.ts (the one file to re-theme) + features.ts
│   └── lib/                     # posts, seo, structured-data, search, admin
├── next.config.ts
├── .env.example
└── README.md
```

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example env file and edit it:

```bash
cp .env.example .env.local
```

At minimum set:

- `NEXT_PUBLIC_SITE_URL` — your production URL (used for canonical/OG/sitemap).
- `ADMIN_PASSWORD` — the password for the local admin dashboard.

### 3. Run the dev server

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

---

## Re-theming for a new niche (cats → pets, tech, business, …)

Everything niche-specific lives in **`src/config/site.ts`** — name, tagline,
description, navigation, social links, posts-per-page, etc. Edit that file, swap the
logo/OG images in `public/images/`, adjust the brand color tokens in
`src/app/globals.css` (the `--color-brand-*` variables), and replace the MDX in
`content/posts/`. No other code changes are required.

---

## Authoring content

Each post is an MDX file in `content/posts/` with this frontmatter:

```yaml
---
title: "Post title"
slug: "post-title"
description: "Short summary for cards and meta tags."
category: "Nutrition"
tags: ["cat food", "reviews"]
featuredImage: "/images/posts/example.svg"
author: "The Editorial Team"
publishDate: "2026-06-12"
updatedDate: "2026-06-16"   # optional
seoTitle: "Custom SEO title"        # optional
seoDescription: "Custom SEO description"   # optional
status: "published"          # "draft" | "published"
---
```

Inside the body you can use Markdown plus these components:

- `<Callout type="tip|info|warning|success" title="...">...</Callout>`
- `<AffiliateProduct title=... image=... pros={[...]} cons={[...]} ctaHref=... />`
- `<InContentAd />`

> A `## FAQ` section with `### Question` subheadings is automatically turned into
> `FAQPage` structured data.

---

## Admin dashboard (development only)

Run `npm run dev` and open `/admin`. After entering `ADMIN_PASSWORD` you can:

- Create / edit / delete posts (saved as MDX in `content/posts/`).
- Auto-generate slug, reading time, and SEO metadata.
- Toggle draft / published status.
- Move files from `content/drafts/` into `content/posts/`.
- Upload, preview, select, and delete images in `public/uploads/`.
- Filter (drafts/published) and search the posts table.

### Why the admin is safe for production

Every admin file uses a `.dev.tsx` / `.dev.ts` extension. Those extensions are only
registered as routes during `next dev` (see `pageExtensions` in `next.config.ts`).
In a production build Next.js never sees them as routes, so `/admin` and
`/api/admin/*` **do not exist** in the exported site — they're not hidden, they're
simply not built.

---

## Build & deploy

### Build locally

```bash
npm run build      # generates the static site in ./out
npm run preview    # serves ./out locally to verify
```

### Deploy to Cloudflare Pages

1. Push the repository to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Use these build settings:
   - **Framework preset**: `Next.js (Static HTML Export)` (or "None")
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variable**: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
4. Save and deploy. Every `git push` to your production branch redeploys automatically.

### Recommended workflow

```
1. Run the admin locally:        npm run dev  →  /admin
2. Write / edit an article       (saved as MDX in content/posts)
3. Commit & push:                git add . && git commit -m "post: ..." && git push
4. Cloudflare Pages builds and deploys the static site automatically.
```

---

## Scripts

| Command               | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Start the dev server (admin enabled).                  |
| `npm run build`       | Build the static site to `./out`.                      |
| `npm run preview`     | Serve the built `./out` directory locally.             |
| `npm run lint`        | Run ESLint.                                            |
| `npm run search-index`| Regenerate `public/search-index.json` manually.        |

---

## License

MIT — use it for any niche you like.
