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
  name: "KitCat Journal",
  shortName: "KitCat",
  description:
    "Expert guides, honest reviews, and practical tips to help your cat live a happier, healthier life.",
  tagline: "Everything your cat wishes you knew.",
  url,
  locale: "en_US",
  defaultOgImage: "/images/og-default.svg",
  logo: "/images/logo.svg",
  author: {
    name: "KitCat Journal Editorial Team",
    url: `${url}/about`,
    twitter: "@kitcatjournal",
  },
  organization: {
    name: "KitCat Journal",
    logo: `${url}/images/logo.svg`,
    sameAs: [
      "https://twitter.com/kitcatjournal",
      "https://facebook.com/kitcatjournal",
      "https://instagram.com/kitcatjournal",
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
    { label: "Twitter", href: "https://twitter.com/kitcatjournal", icon: "twitter" },
    { label: "Facebook", href: "https://facebook.com/kitcatjournal", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com/kitcatjournal", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com/@kitcatjournal", icon: "youtube" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
  ],
  postsPerPage: 9,
  newsletterActionUrl: "",
};

export type { SiteConfig as TSiteConfig };
