import Link from "next/link";
import { Home, Search } from "lucide-react";

import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl font-bold text-brand-500 md:text-9xl">404</p>
      <p className="mt-2 text-3xl" aria-hidden>
        🐱
      </p>
      <h1 className="mt-4 font-serif text-2xl font-bold md:text-3xl">This page wandered off</h1>
      <p className="mt-3 max-w-md leading-relaxed text-muted">
        Like a curious kitty, this page has gone exploring somewhere else. Let&apos;s get you back to the good stuff.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white shadow-cat transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-cat-lg"
        >
          <Home className="size-4" />
          Back home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-card px-6 py-3 font-semibold transition-all hover:border-brand-300 hover:shadow-cat dark:border-brand-800/60"
        >
          <Search className="size-4" />
          Search articles
        </Link>
      </div>
    </Container>
  );
}
