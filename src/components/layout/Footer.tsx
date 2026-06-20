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
import { CatLogo } from "@/components/CatLogo";

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
      className="inline-flex size-9 items-center justify-center rounded-full border border-brand-200/80 bg-card text-muted transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 hover:shadow-cat dark:border-brand-800/60 dark:hover:bg-brand-950/50"
    >
      <Icon className="size-4" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-brand-200/60 bg-gradient-to-b from-brand-50/80 to-blush-50/60 dark:border-brand-800/40 dark:from-brand-950/40 dark:to-[var(--background)]">
      <div className="pointer-events-none absolute inset-0 bg-paw-pattern opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="group flex items-center gap-2.5">
              <CatLogo />
              <span className="font-serif text-lg tracking-tight group-hover:text-brand-600">
                <span className="font-bold text-brand-700 dark:text-brand-300">KitCat</span>
                <span className="font-normal text-brand-600/90 dark:text-brand-400/90"> Journal</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <div className="mt-5 flex gap-2">
              {siteConfig.social.map((s) => (
                <SocialIcon key={s.label} social={s} />
              ))}
            </div>
          </div>

          <div className="md:justify-self-center">
            <h3 className="font-serif font-bold text-brand-700 dark:text-brand-300">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h3 className="font-serif font-bold text-brand-700 dark:text-brand-300">Legal & More</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-brand-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-brand-200/60 pt-6 text-sm text-muted sm:flex-row dark:border-brand-800/40">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Made with love for cat girls everywhere. 🐾
          </p>
          <p className="font-medium text-brand-600 dark:text-brand-400">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
