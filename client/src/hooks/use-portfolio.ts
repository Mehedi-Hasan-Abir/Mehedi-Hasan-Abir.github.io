import { useQuery } from "@tanstack/react-query";
import { portfolioData } from "@/data/portfolio-data";

// ============================================
// Data Hooks for Portfolio Content
// ============================================

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => portfolioData.experiences,
    initialData: portfolioData.experiences,
    staleTime: Infinity,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => portfolioData.projects,
    initialData: portfolioData.projects,
    staleTime: Infinity,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => portfolioData.skills,
    initialData: portfolioData.skills,
    staleTime: Infinity,
  });
}

export function usePersonalInfo() {
  return useQuery({
    queryKey: ["personalInfo"],
    queryFn: async () => portfolioData.personalInfo,
    initialData: portfolioData.personalInfo,
    staleTime: Infinity,
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => portfolioData.blogs,
    initialData: portfolioData.blogs,
    staleTime: Infinity,
  });
}
