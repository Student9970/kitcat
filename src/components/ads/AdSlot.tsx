import { adsConfig } from "@/config/features";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  /** AdSense ad slot ID (data-ad-slot). */
  slot?: string;
  format?: string;
  className?: string;
  label?: string;
  /** Visual placeholder height when no real ad is configured. */
  minHeight?: number;
};

/**
 * Base ad slot. Renders nothing unless ads are explicitly enabled via
 * NEXT_PUBLIC_ADS_ENABLED=true. When enabled but no AdSense client is set, it
 * shows a labelled placeholder so layouts can be designed around it.
 */
export function AdSlot({
  slot,
  format = "auto",
  className,
  label = "Advertisement",
  minHeight = 90,
}: AdSlotProps) {
  if (!adsConfig.enabled) return null;

  const hasAdsense = !!adsConfig.adsenseClientId && !!slot;

  return (
    <div
      className={cn(
        "my-6 flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-default bg-card/50 text-center",
        className
      )}
      style={{ minHeight }}
      aria-label={label}
    >
      <span className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted">
        {label}
      </span>
      {hasAdsense ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={adsConfig.adsenseClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <span className="text-xs text-muted">Ad space</span>
      )}
    </div>
  );
}

export function HeaderAd({ className }: { className?: string }) {
  return <AdSlot label="Advertisement" slot="header" minHeight={90} className={cn("max-w-3xl", className)} />;
}

export function InContentAd({ className }: { className?: string }) {
  return <AdSlot label="Advertisement" slot="in-content" minHeight={250} className={className} />;
}

export function SidebarAd({ className }: { className?: string }) {
  return <AdSlot label="Sponsored" slot="sidebar" minHeight={600} className={className} />;
}

export function FooterAd({ className }: { className?: string }) {
  return <AdSlot label="Advertisement" slot="footer" minHeight={90} className={className} />;
}
