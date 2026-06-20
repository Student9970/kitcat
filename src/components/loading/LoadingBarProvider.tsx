"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface LoadingBarContextValue {
  start: () => void;
  stop: () => void;
}

const LoadingBarContext = createContext<LoadingBarContextValue | null>(null);

export function useLoadingBar() {
  const ctx = useContext(LoadingBarContext);
  if (!ctx) {
    throw new Error("useLoadingBar must be used within LoadingBarProvider");
  }
  return ctx;
}

export function LoadingBarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const activeRef = useRef(0);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTrickle = useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    activeRef.current += 1;
    setVisible(true);
    setProgress((p) => (p <= 0 ? 0.08 : p));

    if (!trickleRef.current) {
      trickleRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 0.9) return p;
          return Math.min(0.9, p + (1 - p) * 0.1);
        });
      }, 350);
    }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = Math.max(0, activeRef.current - 1);
    if (activeRef.current === 0) {
      clearTrickle();
      setProgress(1);
      window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280);
    }
  }, [clearTrickle]);

  useEffect(() => () => clearTrickle(), [clearTrickle]);

  return (
    <LoadingBarContext.Provider value={{ start, stop }}>
      <div
        role="progressbar"
        aria-hidden={!visible}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
      >
        <div
          className="h-full origin-left bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_0_12px_oklch(0.68_0.16_350_/_0.45)] transition-[width,opacity] duration-300 ease-out"
          style={{
            width: `${progress * 100}%`,
            opacity: visible ? 1 : 0,
          }}
        />
      </div>
      {children}
    </LoadingBarContext.Provider>
  );
}
