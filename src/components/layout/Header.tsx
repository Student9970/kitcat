"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CatLogo } from "@/components/CatLogo";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-200/60 bg-[var(--background)]/85 backdrop-blur-lg dark:border-brand-800/40">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <CatLogo />
          <span className="font-serif text-lg tracking-tight transition-colors group-hover:text-brand-600">
            <span className="hidden sm:inline">
              <span className="font-bold text-brand-700 dark:text-brand-300">KitCat</span>
              <span className="font-normal text-brand-600/90 dark:text-brand-400/90"> Journal</span>
            </span>
            <span className="font-bold text-brand-700 sm:hidden dark:text-brand-300">{siteConfig.shortName}</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {siteConfig.mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200"
                    : "text-muted hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden w-64 md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-brand-200/80 bg-card text-muted transition-colors hover:border-brand-300 hover:text-brand-600 lg:hidden dark:border-brand-800/60"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-brand-200/60 lg:hidden dark:border-brand-800/40">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <div className="mb-3 md:hidden">
              <SearchBar />
            </div>
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-full px-4 py-2.5 font-semibold text-muted transition-colors hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
