import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin never exists in production, but disallow defensively.
      disallow: ["/admin", "/api/", "/search"],
    },
    sitemap: absoluteUrl("/sitemap.xml", siteConfig.url),
    host: siteConfig.url,
  };
}
