/**
 * Central site configuration.
 *
 * This is the ONE place you edit to re-theme the platform for a new niche
 * (cats, pets, technology, business, finance, ...). Nothing about the niche
 * is hard-coded anywhere else.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** lucide-react icon name */
  icon: "twitter" | "facebook" | "instagram" | "youtube" | "linkedin" | "github" | "rss";
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  /** Public, canonical URL. Falls back to env var, then localhost. */
  url: string;
  locale: string;
  /** Default social share image (relative to /public). */
  defaultOgImage: string;
  logo: string;
  author: {
    name: string;
    url: string;
    twitter: string; // @handle
  };
  organization: {
    name: string;
    logo: string;
    sameAs: string[];
  };
  mainNav: NavItem[];
  footerNav: NavItem[];
  social: SocialLink[];
  /** Number of posts per page on listing pages. */
  postsPerPage: number;
  /** Newsletter provider action URL (optional). */
  newsletterActionUrl: string;
}

const url =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "The Curious Cat",
  shortName: "Curious Cat",
  description:
    "Expert guides, honest reviews, and practical tips to help your cat live a happier, healthier life.",
  tagline: "Everything your cat wishes you knew.",
  url,
  locale: "en_US",
  defaultOgImage: "/images/og-default.svg",
  logo: "/images/logo.svg",
  author: {
    name: "The Curious Cat Editorial Team",
    url: `${url}/about`,
    twitter: "@curiouscat",
  },
  organization: {
    name: "The Curious Cat",
    logo: `${url}/images/logo.svg`,
    sameAs: [
      "https://twitter.com/curiouscat",
      "https://facebook.com/curiouscat",
      "https://instagram.com/curiouscat",
    ],
  },
  mainNav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "RSS Feed", href: "/rss.xml" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
  social: [
    { label: "Twitter", href: "https://twitter.com/curiouscat", icon: "twitter" },
    { label: "Facebook", href: "https://facebook.com/curiouscat", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/curiouscat", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com/@curiouscat", icon: "youtube" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
  ],
  postsPerPage: 9,
  newsletterActionUrl: "",
};

export type { SiteConfig as TSiteConfig };
