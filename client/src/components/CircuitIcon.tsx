import type { CSSProperties } from "react";
import { useId } from "react";
import {
  P_AGEAR,
  P_BOXA,
  P_BOXB,
  P_BOXC,
  P_CHIP,
  P_CLOUD,
  P_NET,
  P_PEOPLE,
  P_PERSON,
  P_SCIGEAR,
  P_SCISTATIC,
  P_SIGN,
} from "./circuit-paths";

/**
 * Circuit icon set — the NeuralBrain treatment, generalized.
 *
 * Line icons are inline SVG layers painted with the site accent
 * (hsl(var(--primary)), so the runtime accent picker recolors them).
 * Gears / boxes / signs are split layers (absolute path data from
 * icon_asset) so each part animates independently — see circuit-paths.ts.
 * The raster computer icon is a white silhouette (public/icons/) used as
 * a CSS alpha mask, exactly like NeuralBrain's PNG technique.
 *
 * Reflection sweep: an SVG rect clipped by the artwork itself (clipPath
 * of the same layer paths), so light only ever travels INSIDE the
 * strokes — never a full-box wash. The computer's HTML sheen wears the
 * same PNG mask for the same reason.
 *
 * Idle loops only run when `on` (useCanAnimate); hover choreography is
 * pure CSS :hover like the rest of the portfolio. Off-screen pausing is
 * handled by the parent strip via .circuit-paused (index.css).
 */

function Halo({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        "absolute inset-[12%] rounded-full bg-primary/25 blur-xl transition-colors " +
        (on ? "circuit-halo" : "")
      }
    />
  );
}

function SvgShell({
  label,
  on,
  layers,
  children,
}: {
  label: string;
  on: boolean;
  layers: string[];
  children: React.ReactNode;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `cg${uid}`;
  const clipId = `cc${uid}`;
  return (
    <span className="relative block w-full aspect-square" role="img" aria-label={label}>
      <Halo on={on} />
      <svg viewBox="0 0 24 24" aria-hidden="true" className="ci-svg absolute inset-0">
        <defs>
          {/* Slant lives in the gradient (x2/y2), NOT in a g transform:
              Chromium leaks clipped content when transform + clip-path
              share one element. */}
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0.25">
            <stop offset="0.2" stopColor="transparent" />
            <stop offset="0.5" style={{ stopColor: "var(--circuit-core)" }} />
            <stop offset="0.8" stopColor="transparent" />
          </linearGradient>
          <clipPath id={clipId}>
            {layers.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </clipPath>
        </defs>
        {children}
        <g clipPath={`url(#${clipId})`}>
          <rect x="-10" y="-6" width="9" height="36" fill={`url(#${gradId})`} className="ci-glint" />
        </g>
      </svg>
    </span>
  );
}

const DIM = (on: boolean) => "ci-dim" + (on ? " circuit-base" : "");
const BRIGHT = "ci-bright";

export function ChipBrainIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_CHIP]}>
      <path d={P_CHIP} className={DIM(on)} />
    </SvgShell>
  );
}

export function ScienceAiIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_SCISTATIC, P_SCIGEAR]}>
      <path d={P_SCISTATIC} className={DIM(on)} />
      <path d={P_SCIGEAR} className={BRIGHT + " ci-gear"} />
    </SvgShell>
  );
}

export function BigDataIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_BOXA, P_BOXB, P_BOXC, P_CLOUD]}>
      <path d={P_BOXA} className={DIM(on) + " ci-boxA"} />
      <path d={P_BOXB} className={DIM(on) + " ci-boxB"} />
      <path d={P_BOXC} className={DIM(on) + " ci-boxC"} />
      <path d={P_CLOUD} className={BRIGHT + " ci-cloud"} />
    </SvgShell>
  );
}

export function ChartNetworkIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_NET]}>
      <path d={P_NET} className={DIM(on) + " ci-net"} />
    </SvgShell>
  );
}

export function ChartUserIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_PEOPLE, P_SIGN]}>
      <path d={P_PEOPLE} className={DIM(on)} />
      <path d={P_SIGN} className={BRIGHT + " ci-sign"} />
    </SvgShell>
  );
}

export function AdminAltIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <SvgShell label={label} on={on} layers={[P_PERSON, P_AGEAR]}>
      <path d={P_PERSON} className={DIM(on)} />
      <path d={P_AGEAR} className={BRIGHT + " ci-gear"} />
    </SvgShell>
  );
}

const COMP_MASK: CSSProperties = {
  WebkitMaskImage: "url(/icons/computer-line.png)",
  maskImage: "url(/icons/computer-line.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

const COMP_FLOW =
  "linear-gradient(160deg, transparent 44%, var(--circuit-glow) 47.5%, var(--circuit-core) 50%, var(--circuit-glow) 52.5%, transparent 56%)";
const COMP_FLOW_REV =
  "linear-gradient(205deg, transparent 44%, var(--circuit-glow) 47.5%, var(--circuit-core) 50%, var(--circuit-glow) 52.5%, transparent 56%)";

export function ComputerIcon({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={"relative block w-full aspect-square " + (on ? "ci-compglow" : "")}
      role="img"
      aria-label={label}
    >
      <Halo on={on} />
      <span
        aria-hidden="true"
        className={"absolute inset-0 bg-primary " + (on ? "circuit-base" : "opacity-100")}
        style={COMP_MASK}
      />
      {on && (
        <>
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={COMP_MASK}>
            <span className="circuit-flow-a absolute -inset-y-full left-0 w-full" style={{ backgroundImage: COMP_FLOW }} />
          </span>
          <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={COMP_MASK}>
            <span className="circuit-flow-b absolute -inset-y-full left-0 w-full" style={{ backgroundImage: COMP_FLOW_REV }} />
          </span>
        </>
      )}
      {/* Sheen clipped by the same silhouette mask: light stays inside the artwork */}
      <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={COMP_MASK}>
        <span className="ci-sheen" />
      </span>
    </span>
  );
}
