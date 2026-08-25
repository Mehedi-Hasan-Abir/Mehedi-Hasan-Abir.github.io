import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";
import { MEHEDI_LINE, HASAN_LINE } from "./drawn-name-paths";
import { useCanAnimate, useInView } from "@/lib/use-anime";

interface LineProps {
  line: { w: number; h: number; paths: string[] };
  accentLast?: boolean;
  animated: boolean;
}

function Line({ line, accentLast = false, animated }: LineProps) {
  return (
    <svg
      viewBox={`0 0 ${line.w} ${line.h}`}
      style={{ height: "clamp(3rem, 7.5vw, 5.6rem)", width: "auto", overflow: "visible" }}
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
      {animated &&
        line.paths.map((d, i) => (
          <path
            key={`s-${i}`}
            d={d}
            stroke="hsl(var(--primary))"
            strokeWidth={5.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-shine
          />
        ))}
    </svg>
  );
}

/**
 * Hand-drawn hero name (Caveat letter paths):
 * - draw-in via svg.createDrawable, replays on viewport entry
 * - PARALLEL comet shimmer: every stroke carries its own looping comet
 *   (the signature look) - all tweens pause while the hero is off-screen,
 *   so the cost is zero when not visible.
 */
export function DrawnName() {
  const canAnimate = useCanAnimate();
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const drawAnim = useRef<ReturnType<typeof animate> | null>(null);
  const cometAnims = useRef<ReturnType<typeof animate>[]>([]);

  // Draw-in: replays on every viewport entry
  useEffect(() => {
    if (!canAnimate || !inView || !ref.current) return;
    const paths = ref.current.querySelectorAll<SVGPathElement>("path[data-drawn]");
    if (!paths.length) return;

    const drawables = svg.createDrawable(Array.from(paths));
    drawAnim.current = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 900,
      ease: "inOutQuad",
      delay: stagger(90, { start: 150 }),
    });
  }, [canAnimate, inView, ref]);

  // Parallel comets: one looping tween per stroke (started once)
  const cometsStarted = useRef(false);

  useEffect(() => {
    const host = ref.current;
    if (!canAnimate || !host || cometsStarted.current) return;
    const shines = Array.from(host.querySelectorAll<SVGPathElement>("path[data-shine]"));
    if (!shines.length) return;
    cometsStarted.current = true;

    shines.forEach((path, i) => {
      const len = path.getTotalLength();
      const comet = Math.min(80, len * 0.35);
      path.style.strokeDasharray = `${comet} ${len + comet}`;
      path.style.opacity = "0";
      const state = { o: -1 };
      const a = animate(state, {
        o: 1,
        duration: 2600,
        ease: "inOutQuad",
        delay: 1500 + i * 240,
        loop: true,
        onUpdate: () => {
          path.style.opacity = state.o > -0.7 && state.o < 0.7 ? "0.95" : "0";
          path.style.strokeDashoffset = String(-state.o * (len + comet));
        },
      });
      cometAnims.current.push(a);
    });

    if (!inView) cometAnims.current.forEach((a) => a.pause());
  }, [canAnimate, ref]);

  // Pause/resume all comets by viewport presence
  useEffect(() => {
    if (!cometsStarted.current) return;
    cometAnims.current.forEach((a) => (inView ? a.play() : a.pause()));
  }, [inView]);

  return (
    <div ref={ref} role="img" aria-label="Mehedi Hasan" className="py-1">
      <span className="sr-only">Mehedi Hasan</span>
      <Line line={MEHEDI_LINE} animated={canAnimate} />
      <Line line={HASAN_LINE} accentLast animated={canAnimate} />
    </div>
  );
}
