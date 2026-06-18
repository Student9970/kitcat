import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type CalloutType = "info" | "tip" | "warning" | "success";

const styles: Record<CalloutType, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200" },
  tip: { icon: Lightbulb, className: "border-brand-500/30 bg-brand-500/10 text-brand-900 dark:text-brand-200" },
  warning: { icon: AlertTriangle, className: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200" },
  success: { icon: CheckCircle2, className: "border-green-500/30 bg-green-500/10 text-green-900 dark:text-green-200" },
};

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = styles[type];
  return (
    <div className={cn("not-prose my-6 flex gap-3 rounded-xl border p-4", className)}>
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="text-sm leading-relaxed [&>p]:m-0 [&>p+p]:mt-2">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
