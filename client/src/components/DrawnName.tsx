import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";
import { MEHEDI_LINE, HASAN_LINE } from "./drawn-name-paths";
import { useCanAnimate } from "@/lib/use-anime";

interface LineProps {
  line: { w: number; h: number; paths: string[] };
  accentLast?: boolean;
}

function Line({ line, accentLast = false }: LineProps) {
  return (
    <svg
      viewBox={`0 0 ${line.w} ${line.h}`}
      style={{ height: "clamp(3.2rem, 7vw, 5.6rem)", width: "auto" }}
      fill="none"
      aria-hidden="true"
    >
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
    </svg>
  );
}

/**
 * Hand-drawn hero name: real letter paths (Caveat, OFL) that draw themselves
 * in via anime.js svg.createDrawable. Static stroked fallback without motion.
 */
export function DrawnName() {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLDivElement | null>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!canAnimate || played.current || !ref.current) return;
    played.current = true;
    const paths = ref.current.querySelectorAll<SVGPathElement>("path[data-drawn]");
    if (!paths.length) return;

    const drawables = svg.createDrawable(paths);
    animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 900,
      ease: "inOutQuad",
      delay: stagger(90, { start: 250 }),
    });
  }, [canAnimate]);

  return (
    <div ref={ref} role="img" aria-label="Mehedi Hasan" className="py-1">
      <span className="sr-only">Mehedi Hasan</span>
      <Line line={MEHEDI_LINE} />
      <Line line={HASAN_LINE} accentLast />
    </div>
  );
}
