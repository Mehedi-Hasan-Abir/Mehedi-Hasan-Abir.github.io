import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  number?: number;
}

let sectionCounter = 0;

export function SectionHeading({ title, subtitle, number }: SectionHeadingProps) {
  if (number === undefined) {
    sectionCounter++;
  }
  
  const displayNumber = number !== undefined ? number : sectionCounter;
  const formattedNumber = String(displayNumber).padStart(2, "0");

  return (
    <div className="mb-16 text-center">
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
