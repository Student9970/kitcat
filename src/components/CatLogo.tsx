import { cn } from "@/lib/utils";

/** KitCat Journal mark — paw print on a blush gradient tile. */
export function CatLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "size-8 rounded-xl",
    md: "size-10 rounded-2xl",
    lg: "size-12 rounded-2xl",
  };

  const pawSizes = {
    sm: "size-[54%]",
    md: "size-[52%]",
    lg: "size-[50%]",
  };

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-300 via-brand-500 to-brand-600 shadow-cat ring-1 ring-white/50 dark:ring-white/10",
        sizes[size],
        className
      )}
      aria-hidden
    >
      <span
        className={cn("bg-white", pawSizes[size])}
        style={{
          maskImage: "url(/images/paw-print.png)",
          WebkitMaskImage: "url(/images/paw-print.png)",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </span>
  );
}
