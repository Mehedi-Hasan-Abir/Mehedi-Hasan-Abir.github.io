import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useAnimeOnView, useCanAnimate } from "@/lib/use-anime";

interface CountUpProps {
  to: number;
  suffix?: string;
  pad?: number;
  className?: string;
  duration?: number;
}

/** Tweens a number from 0 when scrolled into view. Real value, padded display. */
export function CountUp({ to, suffix = "", pad = 2, className, duration = 1500 }: CountUpProps) {
  const canAnimate = useCanAnimate();
  const textRef = useRef<HTMLSpanElement | null>(null);

  const hostRef = useAnimeOnView<HTMLSpanElement>(
    () => {
      const target = { v: 0 };
      animate(target, {
        v: to,
        duration,
        ease: "outExpo",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = String(Math.round(target.v)).padStart(pad, "0") + suffix;
          }
        },
      });
    },
    { enabled: canAnimate, threshold: 0.5 }
  );

  return (
    <span ref={hostRef} className={className}>
      <span ref={textRef}>
        {canAnimate
          ? String(0).padStart(pad, "0") + suffix
          : String(to).padStart(pad, "0") + suffix}
      </span>
    </span>
  );
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsStripProps {
  stats: StatItem[];
}

/** Editorial stats band - hairline top/bottom, big mono numbers, count-up on scroll. */
export function StatsStrip({ stats }: StatsStripProps) {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!canAnimate || !el) return;
    const cells = el.querySelectorAll("[data-stat]");
    const anim = animate(cells, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 600,
      ease: "outExpo",
      delay: stagger(90),
    });
    return () => { anim.pause(); };
  }, [canAnimate]);

  return (
    <div ref={ref} className="rule-t rule-b grid grid-cols-2 md:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          data-stat
          className={`py-7 md:py-9 text-center ${i > 0 ? "border-l border-border" : ""} ${i >= 2 ? "max-md:border-t max-md:border-border" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}
          style={canAnimate ? { opacity: 0 } : undefined}
        >
          <div className="font-mono font-semibold text-3xl md:text-4xl text-accent tracking-tight">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </div>
          <div className="mono-label text-muted-foreground mt-1.5">{stat.label.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}
