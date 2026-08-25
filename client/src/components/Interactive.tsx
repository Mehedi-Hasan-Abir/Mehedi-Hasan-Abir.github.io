import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { animate, stagger } from "animejs";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

/**
 * Velocity-reactive tilt for SMALL elements only (headings, cards).
 * The researched pattern: each wrapped element is its own tiny compositor
 * layer, so the page itself never moves - kinetic feel, zero scroll cost.
 * Runs on all viewports (small layers are cheap).
 */
export function VelocityTilt({ children, max = 2.2 }: { children: ReactNode; max?: number }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 500, damping: 18, mass: 0.15 });
  const skewY = useTransform(smooth, [-2600, 0, 2600], [`-${max}deg`, "0deg", `${max}deg`], { clamp: true });

  return (
    <motion.div style={{ skewY, willChange: "transform" }} className="inline-block align-bottom">
      {children}
    </motion.div>
  );
}

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

/** Continuous outlined-text marquee strip (inline-style animation - no Tailwind class dependency). */
export function Marquee({ text, repeat = 6, duration = 20 }: MarqueeProps) {
  const items = Array.from({ length: repeat });
  return (
    <div className="overflow-hidden py-6 rule-t select-none" aria-hidden="true">
      <div
        className="flex w-max"
        style={{ animation: `marquee ${duration}s linear infinite` }}
      >
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

interface PulseRingProps {
  enabled: boolean;
}

/**
 * Expanding sonar rings behind a button (anime.js transform loop - works on
 * every browser/viewport, unlike CSS ping which was unreliable here).
 * Place inside a `relative` button as the first child.
 */
export function PulseRing({ enabled }: PulseRingProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const rings = Array.from(el.querySelectorAll("[data-ring]"));
    if (!rings.length) return;
    const anim = animate(rings, {
      scale: [1, 1.6],
      opacity: [0.6, 0],
      duration: 1700,
      ease: "outQuad",
      delay: stagger(850),
      loop: true,
    });
    return () => { anim.pause(); };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <span ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span data-ring className="absolute inset-0 rounded-full border-2 border-white/80" />
      <span data-ring className="absolute inset-0 rounded-full border-2 border-white/80" />
    </span>
  );
}
