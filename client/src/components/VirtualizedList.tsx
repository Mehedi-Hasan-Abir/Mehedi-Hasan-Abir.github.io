import { List, type RowComponentProps } from "react-window";
import type { CSSProperties } from "react";
import type { Project } from '@shared/schema';

interface VirtualizedProjectListProps {
  projects: Project[];
  height: number;
}

interface ProjectRowProps {
  projects: Project[];
}

function ProjectRow({ index, style, projects }: RowComponentProps<ProjectRowProps>) {
  const project = projects[index];
  
  return (
    <div style={style} className="p-4 border-b border-border/50 last:border-b-0">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{project.title}</h3>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            External
          </a>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
    </div>
  );
}

export function VirtualizedProjectList({ projects, height }: VirtualizedProjectListProps) {
  return (
    <List<ProjectRowProps>
      defaultHeight={height}
      rowCount={projects.length}
      rowHeight={100}
      rowProps={{ projects }}
      style={{ height } as CSSProperties}
      rowComponent={ProjectRow}
      overscanCount={2}
    />
  );
}
