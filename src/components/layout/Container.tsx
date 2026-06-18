import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "prose" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[88rem]",
        size === "prose" && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "mx-auto max-w-2xl text-center"
      )}
    >
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      {description && (
        <p className="mt-3 text-lg text-muted">{description}</p>
      )}
    </div>
  );
}
