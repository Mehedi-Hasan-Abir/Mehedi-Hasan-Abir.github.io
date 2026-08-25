import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/#$%&*";

/**
 * Rotating hero tagline with a scramble/decrypt morph between phrases.
 * Writes text directly to the DOM node (zero React re-renders per frame).
 * Loops forever. Static first phrase on low-bandwidth connections.
 */
export function SmoothTicker({ phrases, className }: { phrases: string[]; className?: string }) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const HOLD = 1700;
    const SCRAMBLE = 520;
    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const scrambleTo = (next: string, done: () => void) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SCRAMBLE);
        const reveal = Math.floor(t * next.length);
        let out = "";
        for (let i = 0; i < next.length; i++) {
          if (i < reveal || next[i] === " ") out += next[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        if (textRef.current) textRef.current.textContent = out;
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
        else done();
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const cycle = () => {
      timeout = setTimeout(() => {
        index = (index + 1) % phrases.length;
        scrambleTo(phrases[index], cycle);
      }, HOLD);
    };
    cycle();

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phrases]);

  return (
    <p className={`${className ?? ""} font-mono`} aria-live="polite">
      <span className="text-accent select-none" aria-hidden="true">&gt;&nbsp;</span>
      <span ref={textRef}>{phrases[0]}</span>
      <span className="text-accent animate-pulse select-none" aria-hidden="true">_</span>
    </p>
  );
}
