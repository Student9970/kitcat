"use client";

import { useState } from "react";
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";

import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

export function SocialShare({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = absoluteUrl(`/blog/${slug}`, siteConfig.url);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "Share on Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: "Share on Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "Share on LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-medium text-muted">Share:</span>
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex size-9 items-center justify-center rounded-full border border-brand-200/80 text-muted transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 hover:shadow-cat dark:border-brand-800/60 dark:hover:bg-brand-950/50"
        >
          <Icon className="size-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex size-9 items-center justify-center rounded-full border border-brand-200/80 text-muted transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 hover:shadow-cat dark:border-brand-800/60 dark:hover:bg-brand-950/50"
      >
        {copied ? <Check className="size-4 text-green-600" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
