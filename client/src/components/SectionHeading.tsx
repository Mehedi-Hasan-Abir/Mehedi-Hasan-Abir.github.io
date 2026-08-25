import React from "react";
import { animate } from "animejs";
import { VelocityTilt } from "@/components/Interactive";
import { useAnimeOnView, useCanAnimate } from "@/lib/use-anime";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: number;
}

// Fixed numbering per section keeps order stable across renders/pages.
// Keys are the lowercased, space-dashed section titles used in Home.
const sectionNumbers: Record<string, number> = {
  experience: 1,
  "selected-work": 2,
  capabilities: 3,
  skills: 3,
  writing: 4,
  blog: 4,
  background: 5,
  "beyond-code": 6,
  "fun-&-games": 7,
  "fun-games": 7,
  "get-in-touch": 8,
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

/** Big outlined section number; a filled copy wipes over it on scroll. */
function GhostNumber({ label }: { label: string }) {
  const canAnimate = useCanAnimate();

  const fillRef = useAnimeOnView<HTMLSpanElement>(
    (el) => {
      animate(el, {
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        duration: 900,
        ease: "outExpo",
        delay: 200,
      });
    },
    { threshold: 0.5 }
  );

  return (
    <span className="relative inline-block shrink-0 select-none" aria-hidden="true">
      <span
        className="block text-5xl md:text-6xl font-extrabold leading-none text-transparent"
        style={{ WebkitTextStroke: "1.5px hsl(var(--primary) / 0.55)", fontStretch: "110%" }}
      >
        {label}
      </span>
      <span
        ref={fillRef}
        className="absolute inset-0 block text-5xl md:text-6xl font-extrabold leading-none text-primary"
        style={{
          fontStretch: "110%",
          ...(canAnimate ? { clipPath: "inset(0 100% 0 0)" } : {}),
        }}
      >
        {label}
      </span>
    </span>
  );
}

export function SectionHeading({ title, subtitle, number }: SectionHeadingProps) {
  const sectionKey = title.toLowerCase().replace(/\s+/g, "-");
  const displayNumber = number !== undefined ? number : sectionNumbers[sectionKey] ?? 0;
  const formattedNumber = String(displayNumber).padStart(2, "0");

  return (
    <div className="mb-12 md:mb-16" data-testid="section-heading">
      <div className="flex items-center gap-4 md:gap-6">
        <GhostNumber label={formattedNumber} />
        <VelocityTilt>
          <div>
            <h2 className="display-lg">{title}</h2>
            <PenStroke />
          </div>
        </VelocityTilt>
      </div>

      {subtitle && (
        <p className="mt-4 text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
