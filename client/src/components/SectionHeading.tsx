import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: number;
}

// Fixed numbering per section keeps order stable across renders/pages.
const sectionNumbers: Record<string, number> = {
  "about-me": 1,
  experience: 2,
  projects: 3,
  skills: 4,
  blog: 5,
  education: 6,
  research: 7,
  "beyond-code": 8,
  "fun-games": 9,
  "get-in-touch": 10,
};

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
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="display-lg"
        >
          {title}
        </motion.h2>
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 text-muted-foreground max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="h-px bg-border origin-left mt-6"
        aria-hidden="true"
      />
    </div>
  );
}
