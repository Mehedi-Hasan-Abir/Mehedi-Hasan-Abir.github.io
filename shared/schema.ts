import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  period: text("period").notNull(),
  description: text("description").array().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull(),
  link: text("link"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  items: text("items").array().notNull(),
});

export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  github: text("github"),
  linkedin: text("linkedin"),
  location: text("location"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
});

export const insertExperienceSchema = createInsertSchema(experiences);
export const insertProjectSchema = createInsertSchema(projects);
export const insertSkillSchema = createInsertSchema(skills);
export const insertPersonalInfoSchema = createInsertSchema(personalInfo);

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type PersonalInfo = typeof personalInfo.$inferSelect;
export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
