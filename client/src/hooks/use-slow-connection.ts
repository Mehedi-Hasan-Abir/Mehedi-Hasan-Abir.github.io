import { useState, useEffect } from "react";

/**
 * Detects slow connection (2G, slow-3g, or Save-Data).
 * Used to load the page first, then defer heavy assets (animations, images, analytics).
 */
export function useSlowConnection(): boolean {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (!conn) {
      setSlow(false);
      return;
    }
    const effectiveType = conn.effectiveType;
    const saveData = conn.saveData === true;
    const isSlow =
      saveData ||
      effectiveType === "slow-2g" ||
      effectiveType === "2g";
    setSlow(isSlow);
  }, []);

  return slow;
}

/**
 * When true, heavy content can be loaded (after shell is visible).
 * - Fast connection: true after mount.
 * - Slow connection: true after requestIdleCallback + short delay so the page paints first.
 */
export function useDeferHeavy(slowConnection: boolean): boolean {
  const [canLoadHeavy, setCanLoadHeavy] = useState(!slowConnection);

  useEffect(() => {
    if (!slowConnection) {
      setCanLoadHeavy(true);
      return;
    }
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(
          () => {
            setTimeout(() => setCanLoadHeavy(true), 800);
          },
          { timeout: 2000 }
        )
      : setTimeout(() => setCanLoadHeavy(true), 1500);
    return () => {
      if (typeof id === "number" && window.cancelIdleCallback) {
        window.cancelIdleCallback(id);
      }
    };
  }, [slowConnection]);

  return canLoadHeavy;
}
