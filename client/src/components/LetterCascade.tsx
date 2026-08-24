import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useCanAnimate } from "@/lib/use-anime";

interface LetterCascadeProps {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}

/**
 * Splits text into characters that cascade in with an anime.js stagger.
 * Full text stays in the DOM for screen readers / SEO (sr-only + aria-hidden chars).
 */
export function LetterCascade({ text, as: Tag = "span", className, delay = 0 }: LetterCascadeProps) {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !el) return;
    const chars = el.querySelectorAll("[data-char]");
    if (!chars.length) return;

    const anim = animate(chars, {
      opacity: [0, 1],
      translateY: ["0.85em", "0em"],
      scale: [0.85, 1],
      duration: 750,
      ease: "outExpo",
      delay: stagger(26, { start: delay }),
    });

    return () => { anim.pause(); };
  }, [canAnimate, text, delay]);

  const chars = (
    <span aria-hidden="true" className="inline">
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            data-char
            className="inline-block will-change-transform"
            style={canAnimate ? { opacity: 0 } : undefined}
          >
            {ch}
          </span>
        )
      )}
    </span>
  );

  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{text}</span>
      {chars}
    </Tag>
  );
}

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * One-time word-by-word fade-up reveal (no looping).
 * Used for the hero tagline - static after the entrance.
 */
export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !el) return;
    const words = el.querySelectorAll("[data-word]");
    if (!words.length) return;

    const anim = animate(words, {
      opacity: [0, 1],
      translateY: ["0.6em", "0em"],
      duration: 650,
      ease: "outExpo",
      delay: stagger(70, { start: delay }),
    });

    return () => { anim.pause(); };
  }, [canAnimate, text, delay]);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <span
            key={i}
            data-word
            className="inline-block will-change-transform mr-[0.28em]"
            style={canAnimate ? { opacity: 0 } : undefined}
          >
            {word}
          </span>
        ))}
      </span>
    </p>
  );
}
