import { 
  Experience, InsertExperience, 
  Project, InsertProject, 
  Skill, InsertSkill, 
  PersonalInfo, InsertPersonalInfo,
  experiences, projects, skills, personalInfo 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getExperiences(): Promise<Experience[]>;
  getProjects(): Promise<Project[]>;
  getSkills(): Promise<Skill[]>;
  getPersonalInfo(): Promise<PersonalInfo | undefined>;
  
  createExperience(experience: InsertExperience): Promise<Experience>;
  createProject(project: InsertProject): Promise<Project>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  createPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo>;
}

export class DatabaseStorage implements IStorage {
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(experiences.id);
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.id);
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.id);
  }

  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    const [info] = await db.select().from(personalInfo).limit(1);
    return info;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const [newExperience] = await db.insert(experiences).values(experience).returning();
    return newExperience;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async createPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo> {
    const [newInfo] = await db.insert(personalInfo).values(info).returning();
    return newInfo;
  }
}

export const storage = new DatabaseStorage();
