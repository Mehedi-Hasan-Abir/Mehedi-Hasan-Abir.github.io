import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProjects } from "@/hooks/use-portfolio";
import { ProjectCell } from "@/components/ProjectCell";
import { ProjectModal } from "@/components/ProjectModal";

export default function WorksPage() {
  const { data: projects, isLoading } = useProjects();
  const [detailId, setDetailId] = useState<number | null>(null);
  const detailIndex = projects?.findIndex((p) => p.id === detailId) ?? -1;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 mono-label text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO HOME
          </a>
          <h1 className="display-lg">Selected Work</h1>
          <p className="mt-3 text-muted-foreground max-w-[64ch]">
            Every repository, presented as it ships — open any card for the short
            version, chips included.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-border bg-card p-7 animate-pulse">
                <div className="h-5 bg-secondary rounded w-2/5" />
                <div className="h-7 bg-secondary rounded w-4/5 mt-4" />
                <div className="h-3.5 bg-secondary rounded w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            {projects.map((project, index) => (
              <ProjectCell
                key={project.id}
                project={project}
                index={index}
                onDetails={(p) => setDetailId(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {projects && detailIndex >= 0 && (
          <ProjectModal
            projects={projects}
            startIndex={detailIndex}
            onClose={() => setDetailId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
