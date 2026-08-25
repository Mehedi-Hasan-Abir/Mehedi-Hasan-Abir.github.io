import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useConnection } from "@/contexts/ConnectionContext";
import { useInView } from "@/lib/use-anime";

export interface SkillGroup {
  id: number;
  category: string;
  items: string[];
}

interface SkillsMindMapProps {
  skills: SkillGroup[];
}

const VIEW_W = 1120;
const ROOT = { x: 60, w: 220, h: 68 };
const HEADER_H = 36;
const ITEM_H = 20;
const BRANCH_GAP = 40;
const TOP_PAD = 44;
const COL_X = [430, 790];

/** Stack branches vertically per column; height adapts to item counts. */
function layoutBranches(skills: SkillGroup[]): { x: number; y: number }[] {
  const cols: { x: number; y: number }[][] = [[], []];
  const colHeights = [0, 0];

  skills.forEach((group, i) => {
    const col = i % 2;
    const branchH = HEADER_H + group.items.length * ITEM_H + 16;
    const y = TOP_PAD + colHeights[col];
    cols[col].push({ x: COL_X[col], y });
    colHeights[col] += branchH + BRANCH_GAP;
  });

  return skills.map((_, i) => {
    const col = i % 2;
    return cols[col][Math.floor(i / 2)];
  });
}

function columnHeight(skills: SkillGroup[]): number {
  const colHeights = [0, 0];
  skills.forEach((group, i) => {
    const col = i % 2;
    colHeights[col] += HEADER_H + group.items.length * ITEM_H + 16 + BRANCH_GAP;
  });
  return Math.max(...colHeights) - BRANCH_GAP + TOP_PAD * 2;
}

export function SkillsMindMap({ skills }: SkillsMindMapProps) {
  const { canLoadHeavy } = useConnection();
  // Only genuine low-bandwidth users (2G / saveData) get the static text list.
  const useVisual = canLoadHeavy;

  if (!useVisual) {
    return <SkillFallback skills={skills} />;
  }

  return (
    <>
      {/* Mobile: vertical tree - thumb-friendly, zero horizontal scroll */}
      <div className="md:hidden">
        <SkillsTreeMobile skills={skills} />
      </div>
      {/* Desktop: SVG mind map */}
      <div className="hidden md:block">
        <SkillsMapDesktop skills={skills} />
      </div>
    </>
  );
}

/* ================= MOBILE TREE ================= */

function SkillsTreeMobile({ skills }: { skills: SkillGroup[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.08);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inView || !ref.current) return;
    const host = ref.current;
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const rail = host.querySelector("[data-rail]");
    if (rail) {
      animate(rail, { scaleY: [0, 1], duration: 900, ease: "outQuad" });
    }
    animate(rootEl, {
      opacity: [0, 1],
      scale: [0.85, 1],
      rotate: [-4, 0],
      duration: 550,
      ease: "outBack",
    });
    animate(host.querySelectorAll("[data-branch]"), {
      opacity: [0, 1],
      translateX: [32, 0],
      duration: 600,
      ease: "outExpo",
      delay: stagger(130, { start: 220 }),
    });
    // Chips ripple in per branch - more fluid, more noticeable
    host.querySelectorAll("[data-branch]").forEach((branch, bi) => {
      const chips = branch.querySelectorAll("[data-chip]");
      if (!chips.length) return;
      animate(chips, {
        opacity: [0, 1],
        translateY: [12, 0],
        scale: [0.85, 1],
        duration: 480,
        ease: "outBack",
        delay: stagger(38, { start: 420 + bi * 130 }),
      });
    });
  }, [inView, ref]);

  // Branch header accent borders - fade-in overlay (opacity/scale only;
  // anime v4 cannot interpolate colors containing CSS vars - it crashes)
  useEffect(() => {
    if (!inView || !ref.current) return;
    animate(ref.current.querySelectorAll("[data-haccent]"), {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 520,
      ease: "outQuad",
      delay: stagger(90, { start: 380 }),
    });
  }, [inView, ref]);


  return (
    <div ref={ref} className="relative pl-6" role="img" aria-label="Capabilities grouped into seven areas">
      <span
        data-rail
        aria-hidden="true"
        className="absolute left-[5px] top-2 bottom-6 w-px bg-border origin-top"
      />
      <div ref={rootRef} className="inline-flex flex-col items-center border-2 border-primary bg-card rounded-2xl px-6 py-3.5 mb-7">
        <span className="font-extrabold tracking-wide text-[15px]">AI ENGINEERING</span>
        <span className="mono-label text-[10px] text-muted-foreground mt-0.5">PRODUCTION STACK</span>
      </div>

      <div className="space-y-7">
        {skills.map((group) => (
          <div key={group.id} data-branch className="relative">
            <span
              data-node
              aria-hidden="true"
              className="absolute -left-6 top-[13px] w-[11px] h-[11px] rounded-full bg-background border-2 border-primary"
            />
            <span className="relative inline-block">
              <h3 className="mono-label font-semibold inline-block bg-secondary border border-border px-3.5 py-2 rounded-lg">
                {group.category.toUpperCase()}
              </h3>
              <span
                data-haccent
                aria-hidden="true"
                className="absolute -inset-px border border-primary rounded-lg pointer-events-none will-change-transform"
                style={{ opacity: 0 }}
              />
            </span>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {group.items.map((item) => (
                <span
                  key={item}
                  data-chip
                  className="mono-label text-[11px] text-muted-foreground border border-border bg-card px-2.5 py-1 rounded-md will-change-transform"
                  style={{ opacity: 0 }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= DESKTOP SVG MAP ================= */

function SkillsMapDesktop({ skills }: { skills: SkillGroup[] }) {
  const { ref: containerRef, inView } = useInView<HTMLDivElement>(0.15);
  const pulseAnimsRef = useRef<ReturnType<typeof animate>[]>([]);

  useEffect(() => {
    if (!inView || !containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    // Draw edges organically
    svg.querySelectorAll<SVGPathElement>("[data-edge]").forEach((path, i) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      animate(path, {
        strokeDashoffset: [len, 0],
        duration: 900,
        ease: "outQuad",
        delay: 120 + i * 90,
      });
    });

    // Root pop
    const rootG = svg.querySelector("[data-root]");
    if (rootG) {
      animate(rootG, {
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 550,
        ease: "outBack",
      });
    }

    // Branch cascade
    animate(svg.querySelectorAll("[data-branch-g]"), {
      opacity: [0, 1],
      translateX: [26, 0],
      duration: 600,
      ease: "outExpo",
      delay: stagger(100, { start: 320 }),
    });

    // Pulses travel root -> branch along each edge, looping (paused off-screen)
    const pulseAnims: ReturnType<typeof animate>[] = [];
    svg.querySelectorAll<SVGCircleElement>("[data-pulse]").forEach((circle, i) => {
      const edge = svg.querySelectorAll<SVGPathElement>("[data-edge]")[i];
      if (!edge) return;
      const len = edge.getTotalLength();
      const state = { t: 0 };
      pulseAnims.push(
        animate(state, {
          t: 1,
          duration: 2400,
          ease: "inOutQuad",
          delay: 900 + i * 350,
          loop: true,
          onUpdate: () => {
            const pt = edge.getPointAtLength(state.t * len);
            circle.setAttribute("cx", String(pt.x));
            circle.setAttribute("cy", String(pt.y));
            circle.setAttribute("opacity", state.t > 0.04 && state.t < 0.96 ? "1" : "0");
          },
        })
      );
    });
    pulseAnimsRef.current = pulseAnims;
    if (!inView) pulseAnims.forEach((a) => a.pause());
  }, [inView, containerRef]);

  // Pause/resume edge pulses by viewport presence
  useEffect(() => {
    if (!pulseAnimsRef.current.length) return;
    pulseAnimsRef.current.forEach((a) => (inView ? a.play() : a.pause()));
  }, [inView]);

  const VIEW_H = columnHeight(skills);
  const pts = layoutBranches(skills);
  const rootY = VIEW_H / 2 - ROOT.h / 2;

  return (
    <div ref={containerRef} className="overflow-x-auto" role="img" aria-label="Mind map of technical capabilities grouped into seven areas">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ minWidth: 920, width: "100%" }}>
        {/* Edges */}
        {skills.map((group, i) => {
          const y2 = pts[i].y - 8;
          const d = `M ${ROOT.x + ROOT.w} ${rootY + ROOT.h / 2}
                     C ${ROOT.x + ROOT.w + 90} ${rootY + ROOT.h / 2},
                     ${pts[i].x - 90} ${y2},
                     ${pts[i].x - 10} ${y2}`;
          return (
            <path
              key={group.id}
              data-edge
              d={d}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={1.6}
              strokeLinecap="round"
              opacity={0.7}
            />
          );
        })}

        {/* Data pulses traveling along each edge (anime drives cx/cy via getPointAtLength) */}
        {skills.map((group) => (
          <circle
            key={`pulse-${group.id}`}
            data-pulse
            r={3.4}
            fill="hsl(var(--primary))"
            opacity={0}
          />
        ))}

        {/* Root node */}
        <g data-root>
          <rect
            x={ROOT.x}
            y={rootY}
            width={ROOT.w}
            height={ROOT.h}
            rx={14}
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
          <text
            x={ROOT.x + ROOT.w / 2}
            y={rootY + 30}
            textAnchor="middle"
            className="fill-foreground"
            fontSize={17}
            fontWeight={800}
            letterSpacing="0.5"
          >
            AI ENGINEERING
          </text>
          <text
            x={ROOT.x + ROOT.w / 2}
            y={rootY + 50}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={11}
            fontFamily="var(--font-mono)"
            letterSpacing="1"
          >
            PRODUCTION STACK
          </text>
        </g>

        {/* Branches */}
        {skills.map((group, i) => {
          const p = pts[i];
          return (
            <g key={group.id} data-branch-g>
              <rect
                x={p.x - 10}
                y={p.y - 26}
                width={310}
                height={36}
                rx={9}
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--border))"
                strokeWidth={1.2}
              />
              <text
                x={p.x}
                y={p.y - 3}
                fontSize={13.5}
                fontWeight={700}
                letterSpacing="0.4"
                fontFamily="var(--font-mono)"
                className="fill-foreground"
              >
                {group.category.toUpperCase()}
              </text>
              {group.items.map((item, ii) => (
                <text
                  key={item}
                  x={p.x + 2}
                  y={p.y + 30 + ii * ITEM_H}
                  fontSize={12.5}
                  className="fill-muted-foreground"
                >
                  {item}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Low-bandwidth fallback: hairline rows with inline items. */
function SkillFallback({ skills }: { skills: SkillGroup[] }) {
  return (
    <div>
      {skills.map((group) => (
        <div key={group.id} className="rule-t py-5 first:border-t-0 first:pt-0">
          <h3 className="mono-label font-semibold mb-2">{group.category.toUpperCase()}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {group.items.join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
}
