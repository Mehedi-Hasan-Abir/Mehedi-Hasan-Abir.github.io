import { ArrowUpRight } from "lucide-react";
import { HAZARI_CTA } from "@/data/hazari-hub";

/** The two-choice call to action shown at the end of every Hazari page. */
export function HazariCta() {
  return (
    <section
      aria-labelledby="hazari-cta-heading"
      className="mt-14 border border-primary/40 bg-primary/5 rounded-xl p-6 md:p-8"
    >
      <h2 id="hazari-cta-heading" className="text-2xl font-extrabold">{HAZARI_CTA.heading}</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed max-w-[60ch]">{HAZARI_CTA.text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={HAZARI_CTA.play.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-push inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm"
        >
          {HAZARI_CTA.play.label} <ArrowUpRight className="w-4 h-4" />
        </a>
        <a
          href={HAZARI_CTA.score.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-push inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-full font-semibold text-sm"
        >
          {HAZARI_CTA.score.label} <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
