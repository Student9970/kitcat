import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Conditionally join + de-duplicate Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn an arbitrary string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format an ISO date string for display, e.g. "June 18, 2026". */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Build an absolute URL from a path using the configured site URL. */
export function absoluteUrl(path: string, base: string): string {
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/** Estimate reading time from a word count (~225 wpm). */
export function readingTimeFromWords(words: number): string {
  const minutes = Math.max(1, Math.round(words / 225));
  return `${minutes} min read`;
}

/** Truncate text to a maximum length on a word boundary. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
