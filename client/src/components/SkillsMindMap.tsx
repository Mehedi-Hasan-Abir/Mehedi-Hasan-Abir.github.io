import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useConnection } from "@/contexts/ConnectionContext";

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
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const useMap = canLoadHeavy && !reduce;

  if (!useMap) {
    return <SkillFallback skills={skills} />;
  }

  const VIEW_H = columnHeight(skills);
  const pts = layoutBranches(skills);
  const rootY = VIEW_H / 2 - ROOT.h / 2;

  return (
    <div className="overflow-x-auto" role="img" aria-label="Mind map of technical capabilities grouped into seven areas">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{ minWidth: 920, width: "100%" }}
      >
        {/* Edges */}
        {skills.map((group, i) => {
          const active = hovered === null || hovered === i;
          const y2 = pts[i].y - 8;
          const d = `M ${ROOT.x + ROOT.w} ${rootY + ROOT.h / 2}
                     C ${ROOT.x + ROOT.w + 90} ${rootY + ROOT.h / 2},
                     ${pts[i].x - 90} ${y2},
                     ${pts[i].x - 10} ${y2}`;
          return (
            <motion.path
              key={group.id}
              d={d}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={active ? 1.8 : 1}
              strokeLinecap="round"
              style={{ opacity: active ? 0.75 : 0.15, transition: "opacity .25s ease" }}
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}

        {/* Root node */}
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: `${ROOT.x + ROOT.w / 2}px ${rootY + ROOT.h / 2}px` }}
        >
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
        </motion.g>

        {/* Branches */}
        {skills.map((group, i) => {
          const p = pts[i];
          const active = hovered === null || hovered === i;
          return (
            <motion.g
              key={group.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              style={{
                cursor: "default",
                opacity: undefined,
                transition: "opacity .25s ease",
                ...(active ? {} : { opacity: 0.22 }),
              }}
            >
              <rect
                x={p.x - 10}
                y={p.y - 26}
                width={310}
                height={36}
                rx={9}
                fill="hsl(var(--secondary))"
                stroke={hovered === i ? "hsl(var(--primary))" : "hsl(var(--border))"}
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
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/** Low-motion / slow-connection fallback: hairline rows with inline items. */
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
