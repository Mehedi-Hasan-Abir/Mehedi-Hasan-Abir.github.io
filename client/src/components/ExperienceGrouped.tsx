import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useCanAnimate, useInView } from "@/lib/use-anime";

export interface ExperienceEntry {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
}

interface ExperienceGroupedProps {
  experiences: ExperienceEntry[];
}

function periodEnd(period: string): string {
  const parts = period.split("–");
  return parts.length > 1 ? parts[1].trim() : period.trim();
}

function periodStart(period: string): string {
  const parts = period.split("–");
  return parts[0].trim();
}

/**
 * Groups roles by company so multiple promotions at one employer render as a
 * single card with an internal progression rail (e.g. Next Solution Lab x3).
 * Rail draws downward, nodes pop, bullets ripple in - anime.js.
 */
export function ExperienceGrouped({ experiences }: ExperienceGroupedProps) {
  const canAnimate = useCanAnimate();
  const { ref: hostRef, inView } = useInView<HTMLDivElement>(0.05);

  useEffect(() => {
    if (!canAnimate || !inView || !hostRef.current) return;
    const host = hostRef.current;

    animate(host.querySelectorAll("[data-xp-rail]"), {
      scaleY: [0, 1],
      duration: 1100,
      ease: "outQuad",
    });
    animate(host.querySelectorAll("[data-xp-node]"), {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 420,
      ease: "outBack",
      delay: stagger(180, { start: 250 }),
    });
    animate(host.querySelectorAll("[data-xp-head]"), {
      opacity: [0, 1],
      translateX: [-18, 0],
      duration: 550,
      ease: "outExpo",
      delay: stagger(180, { start: 200 }),
    });
    animate(host.querySelectorAll("[data-xp-bullet]"), {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 420,
      ease: "outExpo",
      delay: stagger(26, { start: 450 }),
    });

    // Signal pulse traveling down the first rail (anime-driven - reliable everywhere)
    const rail = host.querySelector<HTMLElement>("[data-xp-rail]");
    const pulse = host.querySelector<HTMLElement>("[data-rail-pulse]");
    if (rail && pulse) {
      const distance = rail.offsetHeight - 8;
      animate(pulse, {
        translateY: [0, distance],
        opacity: [0, 1, 1, 0],
        duration: 3000,
        ease: "inOutQuad",
        loop: true,
      });
    }
  }, [canAnimate, inView, hostRef]);

  const hidden = canAnimate ? { opacity: 0 } : undefined;

  return (
    <div ref={hostRef}>
      {(() => {
        const groups: { company: string; roles: ExperienceEntry[] }[] = [];
        for (const exp of experiences) {
          const existing = groups.find((g) => g.company === exp.company);
          if (existing) existing.roles.push(exp);
          else groups.push({ company: exp.company, roles: [exp] });
        }
        return groups.map((group) => {
          const span = `${periodStart(group.roles[group.roles.length - 1].period)} – ${periodEnd(group.roles[0].period)}`;
          return (
            <article key={group.company} className="relative rule-t py-10 md:py-12 overflow-hidden">
              {/* Giant outlined company name drifting behind the masthead */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1 left-0 whitespace-nowrap text-[13vw] md:text-[7vw] font-extrabold uppercase leading-none text-transparent opacity-[0.05] select-none"
                style={{ WebkitTextStroke: "1px hsl(var(--foreground))", fontStretch: "115%" }}
              >
                {group.company}&nbsp;·&nbsp;{group.company}&nbsp;·&nbsp;
              </span>

              {/* Company masthead - high contrast, accent identity */}
              <div className="relative flex flex-wrap items-center justify-between gap-3 mb-9">
                <div>
                  <p className="mono-label text-muted-foreground mb-1.5">COMPANY</p>
                  <h3
                    className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight text-accent leading-none"
                    style={{ fontStretch: "110%" }}
                  >
                    {group.company}
                  </h3>
                </div>
                <span className="mono-label text-sm border border-primary/50 text-accent px-4 py-2 rounded-full bg-primary/10">
                  {span.toUpperCase()}
                </span>
              </div>

              {/* Progression rail */}
              <div className="relative pl-6 md:pl-8">
                <span
                  data-xp-rail
                  aria-hidden="true"
                  className="absolute left-[5px] top-2 bottom-2 w-px bg-border origin-top"
                  style={hidden}
                />
                {canAnimate && (
                  <span
                    data-rail-pulse
                    aria-hidden="true"
                    className="absolute left-[2px] top-[4px] w-[7px] h-[7px] rounded-full bg-primary"
                    style={{ opacity: 0 }}
                  />
                )}
                {group.roles.map((role, ri) => (
                  <div key={role.id} className={`relative ${ri > 0 ? "mt-10" : ""}`}>
                    <span
                      data-xp-node
                      aria-hidden="true"
                      className="absolute -left-6 md:-left-8 top-[7px] w-[11px] h-[11px] rounded-full bg-background border-2 border-primary"
                      style={hidden}
                    />
                    <div data-xp-head style={hidden}>
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <h4 className="text-lg md:text-xl font-bold tracking-tight">{role.title}</h4>
                        <span className="mono-label text-muted-foreground">{role.period}</span>
                        {group.roles.length > 1 && (
                          <span className="mono-label text-muted-foreground/60 hidden sm:inline">
                            ·&nbsp;{String(group.roles.length - ri).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2 max-w-[82ch]">
                      {role.description.map((line, li) => {
                        const isTech = line.startsWith("Tech:");
                        return (
                          <li
                            key={li}
                            data-xp-bullet
                            className={
                              isTech
                                ? "mono-label text-muted-foreground/80 pl-0 leading-relaxed"
                                : "relative pl-5 text-sm md:text-[15px] text-foreground/90 leading-relaxed before:absolute before:left-0 before:top-[0.62em] before:w-2.5 before:h-px before:bg-primary"
                            }
                            style={hidden}
                          >
                            {isTech ? line.replace(/^Tech:\s*/, "") : line}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          );
        });
      })()}
    </div>
  );
}
