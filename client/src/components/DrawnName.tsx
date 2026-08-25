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
 * - ONE sequential comet sweeps the strokes (single tween = one DOM write
 *   per frame instead of 18 parallel loops)
 * - everything pauses while the hero is off-screen
 */
export function DrawnName() {
  const canAnimate = useCanAnimate();
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const drawAnim = useRef<ReturnType<typeof animate> | null>(null);
  const cometAnim = useRef<ReturnType<typeof animate> | null>(null);
  const shinePaths = useRef<SVGPathElement[]>([]);

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

  // Single sequential comet (starts once; paused/resumed by viewport)
  useEffect(() => {
    const host = ref.current;
    if (!canAnimate || !host) return;
    shinePaths.current = Array.from(host.querySelectorAll<SVGPathElement>("path[data-shine]"));
    const shines = shinePaths.current;
    if (!shines.length) return;

    const lens = shines.map((p) => p.getTotalLength());
    const cometLens = lens.map((l) => Math.min(80, l * 0.35));
    const SLOT = 240;
    const total = shines.length * SLOT;

    shines.forEach((p, i) => {
      p.style.strokeDasharray = `${cometLens[i]} ${lens[i] + cometLens[i]}`;
      p.style.opacity = "0";
    });

    const state = { t: 0 };
    let activeIdx = -1;
    cometAnim.current = animate(state, {
      t: 1,
      duration: total + 900,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        const idx = Math.min(shines.length - 1, Math.floor(state.t * shines.length));
        const local = state.t * shines.length - idx;
        if (idx !== activeIdx) {
          if (activeIdx >= 0 && shines[activeIdx]) shines[activeIdx].style.opacity = "0";
          activeIdx = idx;
        }
        const p = shines[idx];
        const len = lens[idx];
        const comet = cometLens[idx];
        p.style.opacity = local > 0.05 && local < 0.95 ? "0.95" : "0";
        p.style.strokeDashoffset = String(-local * (len + comet));
      },
    });
    if (!inView) cometAnim.current.pause();

    return () => { cometAnim.current?.pause(); };
  }, [canAnimate, ref]);

  // Pause/resume everything by viewport presence
  useEffect(() => {
    if (!canAnimate) return;
    if (inView) {
      cometAnim.current?.play();
    } else {
      drawAnim.current?.pause();
      cometAnim.current?.pause();
    }
  }, [inView, canAnimate]);

  return (
    <div ref={ref} role="img" aria-label="Mehedi Hasan" className="py-1">
      <span className="sr-only">Mehedi Hasan</span>
      <Line line={MEHEDI_LINE} animated={canAnimate} />
      <Line line={HASAN_LINE} accentLast animated={canAnimate} />
    </div>
  );
}
