import { FixedSizeList as List } from 'react-window';
import { memo } from 'react';
import type { Project } from '@shared/schema';

interface VirtualizedProjectListProps {
  projects: Project[];
  height: number;
}

const ProjectRow = memo(({ index, style, data }: { index: number; style: any; data: Project[] }) => {
  const project = data[index];
  
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
});

export function VirtualizedProjectList({ projects, height }: VirtualizedProjectListProps) {
  return (
    <List
      height={height}
      itemCount={projects.length}
      itemSize={100}
      width="100%"
      itemData={projects}
    >
      {ProjectRow}
    </List>
  );
}