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

  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline Line (Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
      
      {/* Timeline Dot (Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 z-10" />

      {/* Timeline Line (Mobile) */}
      <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-border" />
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
          <div className="bg-card p-6 rounded-xl border border-border/50 hover:border-border transition-colors relative">
             {/* Arrow for Desktop */}
            <div className={`hidden md:block absolute top-8 w-4 h-4 bg-card border-t border-l border-border/50 rotate-45 transform ${
              index % 2 === 0 
                ? "-left-2 border-r-0 border-b-0" 
                : "-right-2 border-l-0 border-t-0 border-r border-b" // actually need to rotate differently
            } ${index % 2 !== 0 ? "rotate-[225deg]" : "-rotate-45"}`} />

            <span className="inline-block px-3 py-1 mb-4 text-xs font-mono font-medium text-primary bg-primary/10 rounded-full">
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
