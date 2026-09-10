import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectModalProps {
  projects: Project[];
  startIndex: number;
  onClose: () => void;
}

/**
 * Repo showcase dialog: prev/next carousel through projects with the same
 * card language (ghost number, mono labels, tech chips). Esc closes,
 * arrows step, overlay click closes, background scroll locks.
 */
export function ProjectModal({ projects, startIndex, onClose }: ProjectModalProps) {
  const [[index, dir], setIndex] = useState<[number, number]>([startIndex, 0]);

  const step = useCallback(
    (d: number) => {
      setIndex(([i]) => [(i + d + projects.length) % projects.length, d]);
    },
    [projects.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, step]);

  const project = projects[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative w-full max-w-2xl border border-border bg-card p-7 md:p-9 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden="true"
          className="ghost-num pointer-events-none absolute -top-2 right-3 select-none text-[5.5rem] leading-none !opacity-[0.07] md:text-[7rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close details"
          className="absolute top-4 right-4 inline-flex w-9 h-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={project.id}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mono-label text-accent">
                P&middot;{String(index + 1).padStart(2, "0")} / {projects.length}
              </span>
              <h3 className="font-extrabold tracking-tight mt-3 text-2xl pr-10" style={{ fontStretch: "106%" }}>
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[64ch]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-3 mt-7">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous project"
              className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next project"
              className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="mono-label text-muted-foreground ml-1">
              {index + 1} / {projects.length}
            </span>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline underline-offset-4"
            >
              View on GitHub <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
