import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useCanAnimate, useInView } from "@/lib/use-anime";

interface LetterCascadeProps {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
}

/**
 * Splits text into characters that cascade in with an anime.js stagger.
 * Replays on every viewport entry. Full text stays in the DOM for
 * screen readers / SEO (sr-only + aria-hidden chars).
 */
export function LetterCascade({ text, as: Tag = "span", className, delay = 0 }: LetterCascadeProps) {
  const canAnimate = useCanAnimate();
  const { ref, inView } = useInView<HTMLElement>(0.4);

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !inView || !el) return;
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
  }, [canAnimate, inView, ref, text, delay]);

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
