import { useRef, type ReactNode, type MouseEvent } from "react";
import { animate } from "animejs";

/** Pulls its child toward the cursor while hovered; springs back on leave. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    animate(el, {
      translateX: dx * strength,
      translateY: dy * strength,
      duration: 300,
      ease: "outQuad",
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    animate(el, {
      translateX: 0,
      translateY: 0,
      duration: 650,
      ease: "outElastic(1, .45)",
    });
  };

  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block will-change-transform">
      {children}
    </span>
  );
}

interface MarqueeProps {
  text: string;
  repeat?: number;
  duration?: number;
}

/** Continuous outlined-text marquee strip. Pauses under reduced-motion CSS. */
export function Marquee({ text, repeat = 6, duration = 22 }: MarqueeProps) {
  const items = Array.from({ length: repeat });
  return (
    <div className="overflow-hidden py-6 rule-t select-none" aria-hidden="true">
      <div className="flex w-max animate-[marquee_var(--marquee-dur)_linear_infinite]" style={{ "--marquee-dur": `${duration}s` } as React.CSSProperties}>
        {items.map((_, i) => (
          <span
            key={i}
            className="whitespace-nowrap pr-8 text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-transparent"
            style={{ WebkitTextStroke: "1px hsl(var(--primary) / 0.35)", fontStretch: "110%" }}
          >
            {text}&nbsp;·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
