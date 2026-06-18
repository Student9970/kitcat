import Link from "next/link";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Rss,
} from "lucide-react";

import { siteConfig, type SocialLink } from "@/config/site";

const iconMap = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  rss: Rss,
} as const;

function SocialIcon({ social }: { social: SocialLink }) {
  const Icon = iconMap[social.icon];
  return (
    <a
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={social.label}
      className="inline-flex size-9 items-center justify-center rounded-full border border-default text-muted transition-colors hover:bg-brand-500/10 hover:text-brand-600"
    >
      <Icon className="size-4" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-default bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-extrabold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
                {siteConfig.shortName.charAt(0)}
              </span>
              <span className="text-lg">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted">{siteConfig.description}</p>
            <div className="mt-5 flex gap-2">
              {siteConfig.social.map((s) => (
                <SocialIcon key={s.label} social={s} />
              ))}
            </div>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h3 className="font-semibold">Legal & More</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-default pt-6 text-sm text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
