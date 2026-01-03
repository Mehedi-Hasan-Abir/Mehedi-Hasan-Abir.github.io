import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { portfolioData } from "@/data/portfolio-data";

// ============================================
// Data Hooks for Portfolio Content
// ============================================

export function useExperiences() {
  return useQuery({
    queryKey: [api.experiences.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.experiences.list.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch experiences");
        return api.experiences.list.responses[200].parse(await res.json());
      } catch {
        // Fallback to static data for GitHub Pages
        return portfolioData.experiences;
      }
    },
  });
}

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.projects.list.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch projects");
        return api.projects.list.responses[200].parse(await res.json());
      } catch {
        // Fallback to static data for GitHub Pages
        return portfolioData.projects;
      }
    },
  });
}

export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.skills.list.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch skills");
        return api.skills.list.responses[200].parse(await res.json());
      } catch {
        // Fallback to static data for GitHub Pages
        return portfolioData.skills;
      }
    },
  });
}

export function usePersonalInfo() {
  return useQuery({
    queryKey: [api.personalInfo.get.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.personalInfo.get.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch personal info");
        return api.personalInfo.get.responses[200].parse(await res.json());
      } catch {
        // Fallback to static data for GitHub Pages
        return portfolioData.personalInfo;
      }
    },
  });
}
