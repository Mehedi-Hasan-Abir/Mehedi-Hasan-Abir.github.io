import { Fragment } from "react";
import { useCanAnimate, useInView } from "@/lib/use-anime";
import { scrollToSection } from "@/lib/scroll-to";
import {
  AdminAltIcon,
  BigDataIcon,
  ChartNetworkIcon,
  ChartUserIcon,
  ChipBrainIcon,
  ComputerIcon,
  ScienceAiIcon,
} from "./CircuitIcon";

interface CapItem {
  key: string;
  label: string;
  Icon: (props: { on: boolean; label: string }) => React.JSX.Element;
}

/** Same icon order as the CapabilityIcons strip (SkillsMindMap category order). */
const ITEMS: CapItem[] = [
  { key: "comp", label: "Programming", Icon: ComputerIcon },
  { key: "chip", label: "ML & Deep Learning", Icon: ChipBrainIcon },
  { key: "sci", label: "LLMs & Agentic AI", Icon: ScienceAiIcon },
  { key: "net", label: "Vector & Search", Icon: ChartNetworkIcon },
  { key: "big", label: "Backend & Distributed Systems", Icon: BigDataIcon },
  { key: "usr", label: "Frontend", Icon: ChartUserIcon },
  { key: "admin", label: "DevOps & Cloud", Icon: AdminAltIcon },
];

/**
 * Slim icon ticker directly under the hero. Seamless CSS loop (track is
 * duplicated once, translating -50%), pausing on hover / focus / off-screen.
 * Every item jumps to the Capabilities section; hover replays that icon's
 * own choreography via the shared .cap-<key> rules. No Magnetic here — the
 * track itself moves, so cursor-pull would fight it.
 *
 * Mobile: fixed ~64px band, icons stay legible, tap jumps to Skills.
 * Without animation (2G): a swipeable static row instead of a cut-off loop.
 */
export function CapabilityMarquee() {
  const canAnimate = useCanAnimate();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  const goSkills = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Mouse click leaves focus on the link, and :focus-within pauses the
    // loop — release it so the marquee resumes (keyboard focus is kept).
    if (e.detail > 0) e.currentTarget.blur();
    scrollToSection("skills");
  };

  const row = (hidden: boolean) => (
    <>
      {ITEMS.map(({ key, label, Icon }) => (
        <Fragment key={key + (hidden ? "-b" : "-a")}>
          <a
            href="#skills"
            onClick={goSkills}
            tabIndex={hidden ? -1 : 0}
            aria-hidden={hidden || undefined}
            title={label + " — see Capabilities"}
            className={
              "cap-item cap-" + key + " group flex shrink-0 items-center gap-2.5 px-5 py-3 " +
              "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            }
          >
            <span className="block w-8 h-8 md:w-9 md:h-9">
              <Icon on={canAnimate} label={label} />
            </span>
            <span className="mono-label whitespace-nowrap text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
              {label.toUpperCase()}
            </span>
          </a>
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-primary/50" />
        </Fragment>
      ))}
    </>
  );

  return (
    <div
      ref={ref}
      className={
        "cap-marquee rule-t rule-b overflow-hidden bg-card/60 " +
        (canAnimate ? "cap-live " : "") +
        (canAnimate && !inView ? "circuit-paused" : "")
      }
      aria-label="Capability areas — activate to see details"
    >
      <div
        className={
          "flex w-max items-center " +
          (canAnimate ? "cap-track" : "overflow-x-auto max-w-full")
        }
      >
        {row(false)}
        {canAnimate && <div className="flex items-center" aria-hidden="true">{row(true)}</div>}
      </div>
    </div>
  );
}
