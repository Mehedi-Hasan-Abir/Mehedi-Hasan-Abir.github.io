import { useEffect, useId, useRef } from "react";
import { animate, svg, stagger } from "animejs";
import { MEHEDI_LINE, HASAN_LINE } from "./drawn-name-paths";
import { useCanAnimate, useInView } from "@/lib/use-anime";

interface LineProps {
  line: { w: number; h: number; paths: string[] };
  accentLast?: boolean;
  shineId: string;
  animate: boolean;
}

function Line({ line, accentLast = false, shineId, animate: canAnimate }: LineProps) {
  return (
    <svg
      viewBox={`0 0 ${line.w} ${line.h}`}
      style={{ height: "clamp(3rem, 7.5vw, 5.6rem)", width: "auto", overflow: "visible" }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={shineId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={line.w}
          y2={0}
        >
          <stop offset="0" stopColor="transparent" />
          <stop offset="0.5" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="1" stopColor="transparent" />
          {canAnimate && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from={`-${line.w} 0`}
              to={`${line.w} 0`}
              dur="4.2s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>

      {/* Base strokes */}
      {line.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={accentLast && i === line.paths.length - 1 ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          data-drawn
        />
      ))}

      {/* Fluid shine passing through constantly */}
      {canAnimate && (
        <g opacity={0.9}>
          {line.paths.map((d, i) => (
            <path key={`s-${i}`} d={d} stroke={`url(#${shineId})`} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      )}
    </svg>
  );
}

/**
 * Hand-drawn hero name: real letter paths (Caveat, OFL) that draw themselves
 * in via anime.js svg.createDrawable - replays on every viewport entry.
 * A fluid shine sweeps through the strokes continuously.
 */
export function DrawnName() {
  const canAnimate = useCanAnimate();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    if (!canAnimate || !inView || !ref.current) return;
    const paths = ref.current.querySelectorAll<SVGPathElement>("path[data-drawn]");
    if (!paths.length) return;

    const drawables = svg.createDrawable(paths);
    const anim = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 900,
      ease: "inOutQuad",
      delay: stagger(90, { start: 150 }),
    });
    return () => { anim.pause(); };
  }, [canAnimate, inView, ref]);

  return (
    <div ref={ref} role="img" aria-label="Mehedi Hasan" className="py-1">
      <span className="sr-only">Mehedi Hasan</span>
      <Line line={MEHEDI_LINE} shineId={`${uid}-m`} animate={canAnimate} />
      <Line line={HASAN_LINE} accentLast shineId={`${uid}-h`} animate={canAnimate} />
    </div>
  );
}
