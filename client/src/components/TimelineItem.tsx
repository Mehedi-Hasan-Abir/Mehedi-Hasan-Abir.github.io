import { motion } from "framer-motion";
import { TechCard } from "./TechCard";
import type { Experience } from "@shared/schema";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  // Extract tech stacks from description
  const techStacks: string[] = [];
  const descriptiveItems: string[] = [];
  
  experience.description.forEach((item) => {
    if (item.startsWith("Tech:")) {
      const techs = item.replace("Tech:", "").split(",").map(t => t.trim());
      techStacks.push(...techs);
    } else {
      descriptiveItems.push(item);
    }
  });

  const impactByIndex = [
    ["100 RPS on 2 vCPU", "Hybrid RAG Production", "5 Services Deployed"],
    ["Training +1.8x", "GPU Util +26%", "Eval QA +100%"],
    ["Coverage +5k chars", "OCR Accuracy +12%", "Delivery Time -22%"],
    ["Field Extraction 128", "POC to Prod Fast", "Multimodal Ready"],
  ];
  const impactChips = impactByIndex[index] ?? ["High Impact", "Scalable", "Production Ready"];
  const isCurrentRole = /present/i.test(experience.period);

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline Line (Desktop) */}
      <motion.div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/70 -translate-x-1/2"
        initial={{ scaleY: 0, opacity: 0.3 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
      />
      
      {/* Timeline Dot (Desktop) */}
      <motion.div
        className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 z-10 shadow-[0_0_20px_rgba(56,189,248,0.45)]"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      />

      {/* Timeline Line (Mobile) */}
      <motion.div
        className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-border"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: "top" }}
      />
      <div className="md:hidden absolute left-0 top-8 w-3 h-3 rounded-full bg-primary -translate-x-[5px]" />

      <div className={`md:flex items-start justify-between ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
        {/* Empty space for alignment */}
        <div className="hidden md:block w-5/12" />

        <motion.div
          initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:w-5/12 mb-8 md:mb-0"
        >
          <div className="relative overflow-hidden bg-card/55 backdrop-blur-xl p-6 rounded-2xl border border-white/15 hover:border-primary/40 transition-all duration-300 shadow-[0_14px_34px_rgba(2,6,23,0.32)]">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/14 via-transparent to-primary/6" />
            <motion.div
              aria-hidden="true"
              className="absolute -inset-y-4 -left-20 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: -220, opacity: 0 }}
              whileHover={{ x: 480, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
             {/* Arrow for Desktop */}
            <div className={`hidden md:block absolute top-8 w-4 h-4 bg-card border-t border-l border-border/50 rotate-45 transform ${
              index % 2 === 0 
                ? "-left-2 border-r-0 border-b-0" 
                : "-right-2 border-l-0 border-t-0 border-r border-b" // actually need to rotate differently
            } ${index % 2 !== 0 ? "rotate-[225deg]" : "-rotate-45"}`} />

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 text-xs font-mono font-medium text-primary bg-primary/10 rounded-full border border-primary/25">
                {experience.period}
              </span>
              {isCurrentRole && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-full bg-emerald-600/10 text-emerald-700 border border-emerald-700/25 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-300/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-300 animate-pulse" />
                  Active
                </span>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {impactChips.map((chip) => (
                <span
                  key={chip}
                  className="px-2.5 py-1 text-[11px] rounded-full font-mono bg-cyan-600/8 text-slate-700 border border-cyan-700/20 dark:bg-white/7 dark:text-cyan-200 dark:border-cyan-200/25"
                >
                  {chip}
                </span>
              ))}
            </div>

            <span className="sr-only">
              {experience.period}
            </span>
            
            <h3 className="text-xl font-bold mb-1">{experience.title}</h3>
            <h4 className="text-muted-foreground font-medium mb-4">{experience.company}</h4>
            
            {/* Descriptive items */}
            {descriptiveItems.length > 0 && (
              <ul className="space-y-2 mb-4">
                {descriptiveItems.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Tech Stack Cards */}
            {techStacks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech, i) => (
                  <TechCard key={`${tech}-${i}`} tech={tech} index={i} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
