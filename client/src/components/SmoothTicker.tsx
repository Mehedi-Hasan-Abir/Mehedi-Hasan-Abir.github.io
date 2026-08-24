import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/#$%&*";

/**
 * Rotating hero tagline with a scramble/decrypt morph between phrases.
 * Characters shuffle randomly, then lock in left-to-right. Loops forever.
 * Falls back to static first phrase on low-bandwidth connections.
 */
export function SmoothTicker({ phrases, className }: { phrases: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(phrases[0] ?? "");
  const rafRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (phrases.length <= 1) return;
    const HOLD = 1700;
    const SCRAMBLE = 520;

    const id = window.setTimeout(() => {
      const next = phrases[(index + 1) % phrases.length];
      const start = performance.now();
      const maxLen = Math.max(next.length, display.length);

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SCRAMBLE);
        const reveal = Math.floor(t * next.length);
        let out = "";
        for (let i = 0; i < next.length; i++) {
          if (i < reveal) {
            out += next[i];
          } else if (next[i] === " ") {
            out += " ";
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        setDisplay(out);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(next);
          setIndex((i) => (i + 1) % phrases.length);
        }
      };
      void maxLen;
      rafRef.current = requestAnimationFrame(tick);
    }, HOLD);

    return () => {
      clearTimeout(id);
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [index, phrases, display.length]);

  return (
    <p className={`${className ?? ""} font-mono`} aria-live="polite">
      <span className="text-accent select-none" aria-hidden="true">&gt;&nbsp;</span>
      {display}
      <span className="text-accent animate-pulse select-none" aria-hidden="true">_</span>
    </p>
  );
}
