import { useEffect, useRef, useState } from "react";
import { useConnection } from "@/contexts/ConnectionContext";

/**
 * Shared anime.js integration helpers.
 * Animations always run for capable connections (site-owner requirement);
 * only genuine low-bandwidth users (2G / saveData) skip decorative motion.
 * Scroll-triggered effects REPLAY on every viewport entry (owner preference).
 */

export function useInView<T extends HTMLElement>(threshold = 0.25, once = false) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting && once) io.disconnect();
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return { ref, inView };
}

/** True when decorative anime.js motion should run. */
export function useCanAnimate(): boolean {
  const { canLoadHeavy } = useConnection();
  return canLoadHeavy;
}

/**
 * Runs a callback every time the host element enters the viewport
 * (animations replay on each scroll entry). Re-arms when `enabled`
 * flips to true (e.g. canLoadHeavy resolving after first paint).
 */
export function useAnimeOnView<T extends Element>(
  run: (el: T) => void,
  options?: { threshold?: number; enabled?: boolean }
) {
  const { threshold = 0.25, enabled = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (!enabled) return;
    let running = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !running && ref.current) {
            running = true;
            runRef.current(ref.current);
            // small cooldown so fast scroll jitter doesn't double-fire
            setTimeout(() => { running = false; }, 600);
          }
        });
      },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [enabled, threshold]);

  return ref;
}
