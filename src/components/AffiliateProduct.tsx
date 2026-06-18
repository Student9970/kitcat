import Image from "next/image";
import { Check, X, ExternalLink, Star } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AffiliateProductProps {
  title: string;
  image: string;
  /** Short subtitle / one-liner about the product. */
  description?: string;
  pros?: string[];
  cons?: string[];
  ctaText?: string;
  ctaHref: string;
  /** Optional rating out of 5. */
  rating?: number;
  /** Optional badge, e.g. "Editor's Choice". */
  badge?: string;
  price?: string;
  className?: string;
}

/**
 * Affiliate product box: image, title, pros/cons and a clear CTA.
 * Designed to be dropped straight into MDX content.
 */
export function AffiliateProduct({
  title,
  image,
  description,
  pros = [],
  cons = [],
  ctaText = "Check Price",
  ctaHref,
  rating,
  badge,
  price,
  className,
}: AffiliateProductProps) {
  return (
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border border-default bg-card shadow-sm",
        className
      )}
    >
      {badge && (
        <div className="bg-brand-600 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-white">
          {badge}
        </div>
      )}
      <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-xl bg-white sm:w-full">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="180px"
              className="object-contain p-2"
            />
          ) : null}
        </div>

        <div className="flex flex-col">
          <h3 className="text-xl font-bold leading-tight">{title}</h3>

          {(rating || price) && (
            <div className="mt-1 flex items-center gap-3 text-sm">
              {rating ? (
                <span className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4"
                      fill={i < Math.round(rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-1 font-medium text-muted">{rating.toFixed(1)}</span>
                </span>
              ) : null}
              {price ? <span className="font-semibold text-brand-600">{price}</span> : null}
            </div>
          )}

          {description && <p className="mt-2 text-sm text-muted">{description}</p>}

          {(pros.length > 0 || cons.length > 0) && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {pros.length > 0 && (
                <ul className="space-y-1.5">
                  {pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              )}
              {cons.length > 0 && (
                <ul className="space-y-1.5">
                  {cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm">
                      <X className="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <a
            href={ctaHref}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-700 sm:w-auto"
          >
            {ctaText}
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
