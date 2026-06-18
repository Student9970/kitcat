import type { NextConfig } from "next";

/**
 * Admin is physically excluded from production builds.
 *
 * Every admin file (pages + route handlers) is named `*.dev.tsx` / `*.dev.ts`.
 * The `dev.tsx` / `dev.ts` page extensions are only registered while running
 * `next dev`, so in a production build Next.js never treats those files as
 * routes — the `/admin` and `/api/admin/*` endpoints simply do not exist.
 */
const isDev = process.env.NODE_ENV === "development";

const pageExtensions = isDev
  ? ["tsx", "ts", "jsx", "js", "dev.tsx", "dev.ts"]
  : ["tsx", "ts", "jsx", "js"];

const nextConfig: NextConfig = {
  pageExtensions,

  // Static Site Generation export for Cloudflare Pages (and any static host).
  // Disabled in dev so the admin route handlers / server features work locally.
  output: isDev ? undefined : "export",

  // Required for `output: export`. Cloudflare can still optimize delivery.
  images: {
    unoptimized: true,
  },

  // Cleaner static URLs (e.g. /blog/post/ -> index.html in a folder).
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
