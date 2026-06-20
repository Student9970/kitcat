"use client";

import { useEffect } from "react";

import { useLoadingBar } from "@/components/loading/LoadingBarProvider";

/** Drives the top loading bar while search index loads or the query changes. */
export function useSearchLoadingBar(loading: boolean, query: string) {
  const { start, stop } = useLoadingBar();
  const trimmed = query.trim();

  useEffect(() => {
    if (!trimmed) return;
    start();
    return () => stop();
  }, [trimmed, loading, start, stop]);
}
