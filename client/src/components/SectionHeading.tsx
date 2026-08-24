import React from "react";
import { animate } from "animejs";
import { useAnimeOnView, useCanAnimate } from "@/lib/use-anime";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: number;
}

// Fixed numbering per section keeps order stable across renders/pages.
const sectionNumbers: Record<string, number> = {
  experience: 1,
  projects: 2,
  skills: 3,
  blog: 4,
  education: 5,
  research: 6,
  "beyond-code": 7,
  "fun-games": 8,
  "get-in-touch": 9,
};

/** Hand-drawn accent stroke that sketches itself under the title on scroll. */
function PenStroke() {
  const canAnimate = useCanAnimate();

  const pathRef = useAnimeOnView<SVGPathElement>(
    (path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      animate(path, {
        strokeDashoffset: [len, 0],
        opacity: [1, 1],
        duration: 950,
        ease: "outQuad",
        delay: 250,
      });
    },
    { threshold: 0.5 }
  );

  return (
    <svg
      className="block mt-4 h-[10px] w-[190px] md:w-[230px] overflow-visible"
      viewBox="0 0 230 10"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M3 7 C 55 2.5, 120 9.5, 165 5.5 S 215 4, 227 5"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={canAnimate ? { opacity: 0 } : undefined}
      />
    </svg>
  );
}

export function SectionHeading({ title, subtitle, number }: SectionHeadingProps) {
  const sectionKey = title.toLowerCase().replace(/\s+/g, "-");
  const displayNumber = number !== undefined ? number : sectionNumbers[sectionKey] ?? 0;
  const formattedNumber = String(displayNumber).padStart(2, "0");

  return (
    <div className="mb-12 md:mb-16" data-testid="section-heading">
      <div className="flex items-baseline gap-4 md:gap-5">
        <span className="ghost-num text-sm md:text-base shrink-0" aria-hidden="true">
          {formattedNumber}
        </span>
        <div>
          <h2 className="display-lg">{title}</h2>
          <PenStroke />
        </div>
      </div>

      {subtitle && (
        <p className="mt-4 text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
