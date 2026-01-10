import { useQuery } from "@tanstack/react-query";
import { portfolioData } from "@/data/portfolio-data";

// ============================================
// Data Hooks for Portfolio Content
// ============================================

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      // Use static data only for GitHub Pages deployment
      return portfolioData.experiences;
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      // Use static data only for GitHub Pages deployment
      return portfolioData.projects;
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      // Use static data only for GitHub Pages deployment
      return portfolioData.skills;
    },
  });
}

export function usePersonalInfo() {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn: async () => {
      // Use static data only for GitHub Pages deployment
      return portfolioData.personalInfo;
    },
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      // Use static data only for GitHub Pages deployment
      return portfolioData.blogs;
    },
  });
}
