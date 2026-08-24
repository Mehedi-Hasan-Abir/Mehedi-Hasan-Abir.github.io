import { motion } from "framer-motion";

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
 */
export function ExperienceGrouped({ experiences }: ExperienceGroupedProps) {
  const groups: { company: string; roles: ExperienceEntry[] }[] = [];

  for (const exp of experiences) {
    const existing = groups.find((g) => g.company === exp.company);
    if (existing) {
      existing.roles.push(exp);
    } else {
      groups.push({ company: exp.company, roles: [exp] });
    }
  }

  return (
    <div>
      {groups.map((group, gi) => {
        // Data is newest-first within each company.
        const span = `${periodStart(group.roles[group.roles.length - 1].period)} – ${periodEnd(group.roles[0].period)}`;
        return (
          <motion.article
            key={group.company}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: gi * 0.06 }}
            className="rule-t py-10 md:py-12 first:border-t-0 first:pt-0"
          >
            {/* Company masthead */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-8">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontStretch: "108%" }}>
                {group.company}
              </h3>
              <span className="mono-label text-accent">{span.toUpperCase()}</span>
            </div>

            {/* Progression rail */}
            <div className="relative pl-6 md:pl-8">
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-2 bottom-2 w-px bg-border"
              />
              {group.roles.map((role, ri) => (
                <div key={role.id} className={`relative ${ri > 0 ? "mt-10" : ""}`}>
                  <motion.span
                    aria-hidden="true"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: ri * 0.08 }}
                    className="absolute -left-6 md:-left-8 top-[7px] w-[11px] h-[11px] rounded-full bg-background border-2 border-primary"
                  />
                  <div className="flex flex-wrap items-baseline gap-x-4">
                    <h4 className="text-lg md:text-xl font-bold tracking-tight">{role.title}</h4>
                    <span className="mono-label text-muted-foreground">{role.period}</span>
                    {group.roles.length > 1 && (
                      <span className="mono-label text-muted-foreground/60 hidden sm:inline">
                        ·&nbsp;{String(group.roles.length - ri).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2 max-w-[82ch]">
                    {role.description.map((line, li) => {
                      const isTech = line.startsWith("Tech:");
                      return (
                        <li
                          key={li}
                          className={
                            isTech
                              ? "mono-label text-muted-foreground/80 pl-0 leading-relaxed"
                              : "relative pl-5 text-sm md:text-[15px] text-foreground/90 leading-relaxed before:absolute before:left-0 before:top-[0.62em] before:w-2.5 before:h-px before:bg-primary"
                          }
                        >
                          {isTech ? line.replace(/^Tech:\s*/, "") : line}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
