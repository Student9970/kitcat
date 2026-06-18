"use client";

import { useEffect, useState } from "react";

import type { TocHeading } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 1.0 }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-semibold uppercase tracking-wider text-muted">
        On this page
      </p>
      <ul className="space-y-2 border-l border-default">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: (h.level - 2) * 12 }}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 pl-3 transition-colors",
                activeId === h.id
                  ? "border-brand-600 font-medium text-brand-600"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
