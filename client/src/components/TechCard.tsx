import { motion } from "framer-motion";

interface TechCardProps {
  tech: string;
  index: number;
}

export function TechCard({ tech, index }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(var(--primary), 0.3)"
      }}
      className="px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/40 hover:border-primary/70 transition-all cursor-default backdrop-blur-sm"
    >
      {tech}
    </motion.div>
  );
}
