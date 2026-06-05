import { useMemo } from 'react';

/**
 * Performance optimization hook for grouping and memoizing data transformations
 */
export function usePortfolioMemoization(experiences: any[], projects: any[], skills: any[]) {
  
  // Memoize sorted experiences
  const sortedExperiences = useMemo(() => {
    return [...(experiences || [])].sort((a, b) => {
      const dateA = new Date(a.period.split(' – ')[0]).getTime();
      const dateB = new Date(b.period.split(' – ')[0]).getTime();
      return dateB - dateA;
    });
  }, [experiences]);

  // Memoize skill categories for filtering
  const skillsByCategory = useMemo(() => {
    const map: Record<string, string[]> = {};
    (skills || []).forEach((skill) => {
      map[skill.category] = skill.items;
    });
    return map;
  }, [skills]);

  // Memoize derived tech stack from all projects
  const allTechStacks = useMemo(() => {
    return new Set(
      (projects || [])
        .flatMap((p) => p.techStack || [])
    );
  }, [projects]);

  return {
    sortedExperiences,
    skillsByCategory,
    allTechStacks,
  };
}