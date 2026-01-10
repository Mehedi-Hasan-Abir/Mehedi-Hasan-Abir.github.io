import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: number;
}

// Track section numbers based on the page/component they're used in
// This prevents the counter from increasing when navigating between pages
const sectionMap = new Map<string, number>();

export function SectionHeading({ title, subtitle, number }: SectionHeadingProps) {
  // Use the title as a key to maintain consistent numbering
  const sectionKey = title.toLowerCase().replace(/\s+/g, '-');
  
  if (!sectionMap.has(sectionKey)) {
    // Assign a fixed number based on the section type
    const sectionNumbers: Record<string, number> = {
      'about-me': 1,
      'experience': 2,
      'projects': 3,
      'skills': 4,
      'blog': 5,
      'education': 6,
      'research': 7,
      'beyond-code': 8,
      'fun-games': 9,
      'get-in-touch': 10,
    };
    
    const assignedNumber = sectionNumbers[sectionKey] || sectionMap.size + 1;
    sectionMap.set(sectionKey, assignedNumber);
  }
  
  const displayNumber = number !== undefined ? number : sectionMap.get(sectionKey)!;
  const formattedNumber = String(displayNumber - 1).padStart(2, "0");

  return (
    <div className="mb-16 text-center" data-testid="section-heading">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        <span className="text-primary font-mono mr-2">{formattedNumber}.</span>
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "60px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-1 bg-primary mx-auto mt-6 rounded-full"
      />
    </div>
  );
}
