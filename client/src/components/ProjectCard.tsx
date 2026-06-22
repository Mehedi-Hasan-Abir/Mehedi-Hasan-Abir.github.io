import { memo, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = memo(({ project, index }: ProjectCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 6,
      y: (x - 0.5) * 8,
      glowX: x * 100,
      glowY: y * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 })}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors duration-300 flex flex-col h-full glow-border-hover"
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={
                project.link.includes("github")
                  ? `View ${project.title} on GitHub`
                  : `Open external link for ${project.title}`
              }
            >
              {project.link.includes("github") ? (
                <Github className="w-5 h-5" />
              ) : (
                <ExternalLink className="w-5 h-5" />
              )}
            </a>
          )}
        </div>
        
        <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-mono rounded-full bg-secondary text-secondary-foreground border border-white/5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(56, 189, 248, 0.22), transparent 45%)`,
        }}
      />
    </motion.div>
  );
});

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
