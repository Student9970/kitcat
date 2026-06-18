import Link from "next/link";
import { Home, Search } from "lucide-react";

import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-extrabold text-brand-600 md:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-bold md:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        Oops — the page you&apos;re looking for has wandered off. It might have been
        moved or deleted.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Home className="size-4" />
          Back home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-default px-6 py-3 font-semibold transition-colors hover:bg-card"
        >
          <Search className="size-4" />
          Search articles
        </Link>
      </div>
    </Container>
  );
}
