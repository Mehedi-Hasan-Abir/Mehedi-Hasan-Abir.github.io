import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { useCanAnimate, useAnimeOnView, useInView } from "@/lib/use-anime";
import type { Project } from "@shared/schema";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * True on touch-primary devices (no real hover). Used to swap hover-driven
 * flourishes for scroll-driven ones instead of dropping them entirely.
 */
const isHoverless = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

interface ProjectCellProps {
  project: Project;
  index: number;
  className?: string;
  lead?: boolean;
  onDetails: (project: Project) => void;
}

export function ProjectCell({
  project,
  index,
  className = "",
  lead = false,
  onDetails,
}: ProjectCellProps) {
  const canAnimate = useCanAnimate();
  const chipsRef = useAnimeOnView<HTMLDivElement>(
    (el) => {
      const chips = el.querySelectorAll("[data-chip]");
      if (!chips.length) return;
      animate(chips, {
        opacity: [0, 1],
        translateY: [10, 0],
        scale: [0.9, 1],
        duration: 450,
        ease: "outBack",
        delay: stagger(40),
      });
    },
    { threshold: 0.4 }
  );

  const traceRef = useRef<SVGRectElement | null>(null);

  const traceBorder = (draw: boolean) => {
    const rect = traceRef.current;
    if (!canAnimate || !rect) return;
    const len = rect.getTotalLength();
    rect.style.strokeDasharray = String(len);
    animate(rect, {
      strokeDashoffset: draw ? [len, 0] : [0, len],
      opacity: draw ? [0, 1] : [1, 0],
      duration: draw ? 700 : 400,
      ease: draw ? "outQuad" : "inQuad",
    });
  };

  /*
   * Touch devices never fire mouseenter, so the border trace - the signature
   * moment of these cards - was invisible on phones. There, drive it from
   * viewport entry instead: each card draws its own accent outline as it
   * scrolls up, and erases it on the way out.
   */
  const { ref: cardRef, inView } = useInView<HTMLElement>(0.35);

  useEffect(() => {
    if (!canAnimate || !isHoverless()) return;
    traceBorder(inView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAnimate, inView]);

  return (
    <motion.article
      ref={cardRef}
      onMouseEnter={() => traceBorder(true)}
      onMouseLeave={() => traceBorder(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      className={`group relative border border-border bg-card p-7 md:p-9 flex flex-col hover:border-primary/60 active:border-primary/60 transition-[color,background-color,border-color] duration-200 overflow-hidden ${className}`}
    >
      {canAnimate && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full">
          <rect
            ref={traceRef}
            x="0.5" y="0.5" width="99.6%" height="99.6%"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            style={{ opacity: 0 }}
          />
        </svg>
      )}
      {/* Oversized index watermark: gives each stacked mobile card a visual
          anchor where the bento's size hierarchy is unavailable. */}
      <span
        aria-hidden="true"
        className="ghost-num pointer-events-none absolute -top-2 right-3 select-none text-[5.5rem] leading-none !opacity-[0.07] md:text-[7rem]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mono-label text-accent">P&middot;{String(index + 1).padStart(2, "0")}</span>
      <h3 className={`font-extrabold tracking-tight mt-3 ${lead ? "text-2xl md:text-[2rem]" : "text-xl"}`} style={{ fontStretch: "106%" }}>
        {project.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1 max-w-[64ch]">
        {project.description}
      </p>
      <div ref={chipsRef} className="flex flex-wrap gap-1.5 mt-5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            data-chip
            className="tech-chip"
            style={canAnimate ? { opacity: 0 } : undefined}
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 mt-6">
        <button
          type="button"
          onClick={() => onDetails(project)}
          className="btn-push inline-flex items-center gap-1.5 px-5 py-2.5 border border-border rounded-full font-semibold text-sm hover:border-primary/70 hover:text-primary transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
          Details
        </button>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            GitHub <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
