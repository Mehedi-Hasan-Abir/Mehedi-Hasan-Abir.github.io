import { portfolioData, educationData, researchData, interestsData, heroPhrases } from "@/data/portfolio-data";

// All portfolio content is bundled with the site. Stable return values keep
// existing consumers simple without creating query observers on every page.
const experiences = { data: portfolioData.experiences, isLoading: false };
const projects = { data: portfolioData.projects, isLoading: false };
const skills = { data: portfolioData.skills, isLoading: false };
const personalInfo = { data: portfolioData.personalInfo, isLoading: false };
const blogs = { data: portfolioData.blogs, isLoading: false };
const education = { data: educationData, isLoading: false };
const research = { data: researchData, isLoading: false };
const interests = { data: interestsData, isLoading: false };

export const useExperiences = () => experiences;
export const useProjects = () => projects;
export const useSkills = () => skills;
export const usePersonalInfo = () => personalInfo;
export const useBlogs = () => blogs;
export const useEducation = () => education;
export const useResearch = () => research;
export const useInterests = () => interests;
export const useHeroPhrases = () => heroPhrases;
