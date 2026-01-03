import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface EducationItemProps {
  institution: string;
  degree: string;
  period: string;
  index: number;
}

export function EducationItem({ institution, degree, period, index }: EducationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pb-12"
    >
      {/* Timeline line */}
      {index !== 2 && (
        <div className="absolute left-6 top-20 h-12 w-0.5 bg-gradient-to-b from-primary to-transparent" />
      )}

      <div className="flex gap-6">
        {/* Icon */}
        <div className="relative z-10 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors hover:bg-card/80">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">{institution}</h3>
              <p className="text-primary font-semibold">{degree}</p>
            </div>
            <span className="text-sm text-muted-foreground font-mono whitespace-nowrap">
              {period}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
