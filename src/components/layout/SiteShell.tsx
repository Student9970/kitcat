"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps the app and hides the public header/footer on /admin routes so the
 * local admin dashboard renders as a standalone full-screen tool.
 * (Admin only exists during development — see next.config.ts.)
 */
export function SiteShell({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paw-pattern">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </div>
  );
}
