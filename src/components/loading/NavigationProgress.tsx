"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useLoadingBar } from "@/components/loading/LoadingBarProvider";

/** Starts/stops the top loading bar for initial page load and route navigation. */
export function NavigationProgress() {
  const pathname = usePathname();
  const { start, stop } = useLoadingBar();
  const isFirstPathname = useRef(true);

  // Initial site load
  useEffect(() => {
    start();
    if (document.readyState === "complete") {
      stop();
      return;
    }
    const onLoad = () => stop();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Route navigation finished
  useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false;
      return;
    }
    stop();
  }, [pathname, stop]);

  // Start when clicking internal links
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname && url.search === window.location.search) return;

      start();
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, start]);

  return null;
}
