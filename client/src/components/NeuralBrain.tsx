import { useCanAnimate, useInView } from "@/lib/use-anime";
import { scrollToSection } from "@/lib/scroll-to";

/**
 * Interactive "circuit brain" easter egg, wired beside the hero signature.
 *
 * The artwork is an owner-approved raster image (client/public/neural-brain.png
 * - black strokes on a transparent background) painted with the site's accent
 * color via a CSS alpha mask: wherever the PNG is opaque, the accent color
 * shows. That means the image recolors itself with the theme's accent
 * variable - no offline pixel processing, and light/dark themes both work.
 *
 * Flowing light: the PNG is raster, so there are no stroke paths to draw along.
 * Instead every layer shares that same mask, so a gradient moving *behind* the
 * mask is only visible where the PNG has strokes - which reads as current
 * running through the circuit traces. Three layers stack up:
 *   1. base  - dim accent fill that slowly breathes
 *   2. flow  - two bright bands sweeping in opposite directions (the signals)
 *   3. bloom - a ring expanding from the core, like a pulse leaving the brain
 * The transforms live on CHILDREN of the masked wrappers: transforming a
 * masked element would move the artwork itself instead of the light.
 *
 * Timings live in index.css (.circuit-* classes) rather than inline style so
 * the hover/focus "surge" can override animation-duration - inline styles
 * would outrank the stylesheet. All four loops pause via .circuit-paused when
 * the brain scrolls out of view, so idle scrolling costs nothing.
 *
 * Interactivity: sits in the site's <Magnetic> wrapper for the cursor pull,
 * surges brighter/faster on hover, and click/tap scrolls to Skills.
 */

/** Artwork is 1536x1024. Kept as a CSS aspect-ratio so the box can be sized
 *  fluidly (phones) without us doing the height maths in JS. */
const IMG_ASPECT_RATIO = "1536 / 1024";

// Mask props kept in one object so the spans stay readable.
const MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage: "url(/neural-brain.png)",
  maskImage: "url(/neural-brain.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

/**
 * Travelling band of light. The core is the charge itself, the shoulders are
 * its glow. Both colors come from CSS vars so each theme picks an appropriate
 * charge color (white-hot on dark surfaces, full-strength accent on light -
 * see --circuit-core / --circuit-glow in index.css).
 * The band is deliberately narrow: a wide one washes the whole brain at once
 * and reads as a shimmer instead of a pulse running along the traces.
 */
function flowGradient(angle: number): string {
  return [
    `linear-gradient(${angle}deg`,
    "transparent 44%",
    "var(--circuit-glow) 47.5%",
    "var(--circuit-core) 50%",
    "var(--circuit-glow) 52.5%",
    "transparent 56%)",
  ].join(", ");
}

/** Ring pulse radiating out of the core. */
const BLOOM_GRADIENT = [
  "radial-gradient(circle at 50% 52%",
  "transparent 33%",
  "var(--circuit-glow) 41%",
  "var(--circuit-core) 45%",
  "var(--circuit-glow) 49%",
  "transparent 57%)",
].join(", ");

export function NeuralBrain({ className = "" }: { className?: string }) {
  const canAnimate = useCanAnimate();
  // Four infinite CSS animations would keep compositing while scrolled past,
  // so pause them off-screen - same policy DrawnName uses for its comets.
  const { ref, inView } = useInView<HTMLButtonElement>(0.2);

  const scrollToSkills = () => {
    scrollToSection("skills");
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollToSkills}
      aria-label="Jump to Capabilities section"
      title="Click to explore my capabilities"
      className={
        "circuit-brain relative inline-flex items-center justify-center rounded-2xl cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
        className +
        (canAnimate && !inView ? " circuit-paused" : "")
      }
      style={{ aspectRatio: IMG_ASPECT_RATIO }}
    >
      {/* Pulsing glow behind the icon. Inset is a percentage so the halo keeps
          its proportion at the phone size (a fixed inset-4 swallowed the box). */}
      <span
        aria-hidden="true"
        className={
          "absolute inset-[12%] rounded-full bg-accent/25 blur-xl group-hover:bg-accent/50 group-focus-visible:bg-accent/50 transition-colors " +
          (canAnimate ? "circuit-halo" : "")
        }
      />

      {/* Base trace layer: dim accent paint shaped by the PNG's alpha. */}
      <span
        aria-hidden="true"
        className={
          "absolute inset-0 bg-accent " +
          (canAnimate ? "circuit-base" : "opacity-100")
        }
        style={MASK_STYLE}
      />

      {canAnimate && (
        <>
          {/*
            Signal bands. Each wrapper carries the mask and stays still; the
            inner span is oversized and slides, so only the part of the band
            overlapping a trace lights up. Two opposing directions keep the
            circuit from looking like it drains one way.
          */}
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={MASK_STYLE}>
            <span
              className="circuit-flow-a absolute -inset-y-full left-0 w-full"
              style={{ backgroundImage: flowGradient(160) }}
            />
          </span>
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={MASK_STYLE}>
            <span
              className="circuit-flow-b absolute -inset-y-full left-0 w-full"
              style={{ backgroundImage: flowGradient(205) }}
            />
          </span>

          {/* Core pulse: ring of light expanding out through the traces. */}
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={MASK_STYLE}>
            <span
              className="circuit-bloom absolute inset-0"
              style={{ backgroundImage: BLOOM_GRADIENT }}
            />
          </span>
        </>
      )}
    </button>
  );
}

