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
          className="inline-flex size-9 items-center justify-center rounded-full border border-default text-muted transition-colors hover:bg-brand-500/10 hover:text-brand-600"
        >
          <Icon className="size-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex size-9 items-center justify-center rounded-full border border-default text-muted transition-colors hover:bg-brand-500/10 hover:text-brand-600"
      >
        {copied ? <Check className="size-4 text-green-600" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
