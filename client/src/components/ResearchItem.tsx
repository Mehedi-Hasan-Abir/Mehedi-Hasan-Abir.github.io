import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

interface ResearchItemProps {
  title: string;
  authors: string;
  venue: string;
  year: string;
  link?: string;
  index: number;
}

export function ResearchItem({ title, authors, venue, year, link, index }: ResearchItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Left border accent */}
      <div className="absolute top-0 left-0 h-full w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex gap-4">
        <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors pr-8">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            <span className="font-semibold text-foreground">{authors}</span>
          </p>
          
          <div className="flex flex-wrap gap-3 items-center text-sm">
            <span className="px-3 py-1 bg-secondary/50 rounded-full text-muted-foreground border border-border/30">
              {venue}
            </span>
            <span className="text-muted-foreground font-mono">{year}</span>
            
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs font-semibold">View</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
