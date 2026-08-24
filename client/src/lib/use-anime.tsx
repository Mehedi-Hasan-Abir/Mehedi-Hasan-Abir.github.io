import { useEffect, useRef, useState } from "react";
import { useConnection } from "@/contexts/ConnectionContext";

/**
 * Shared anime.js integration helpers.
 * Animations always run for capable connections (site-owner requirement);
 * only genuine low-bandwidth users (2G / saveData) skip decorative motion.
 */

export function useInView<T extends HTMLElement>(threshold = 0.25, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
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
 * Runs a callback once when the host element enters the viewport
 * and animation is allowed. Re-arms when `enabled` flips to true
 * (e.g. canLoadHeavy resolving after first paint).
 */
export function useAnimeOnView<T extends Element>(
  run: (el: T) => void,
  options?: { threshold?: number; enabled?: boolean }
) {
  const { threshold = 0.25, enabled = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const ran = useRef(false);
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (!enabled || ran.current) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !ran.current) {
            ran.current = true;
            runRef.current(node);
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [enabled, threshold]);

  return ref;
}
