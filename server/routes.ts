import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API Endpoints
  app.get(api.experiences.list.path, async (_req, res) => {
    const data = await storage.getExperiences();
    res.json(data);
  });

  app.get(api.projects.list.path, async (_req, res) => {
    const data = await storage.getProjects();
    res.json(data);
  });

  app.get(api.skills.list.path, async (_req, res) => {
    const data = await storage.getSkills();
    res.json(data);
  });

  app.get(api.personalInfo.get.path, async (_req, res) => {
    const data = await storage.getPersonalInfo();
    res.json(data);
  });

  // Seed Data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("⏭️  Skipping database seed (no DATABASE_URL)");
    return;
  }

  const existingInfo = await storage.getPersonalInfo();
  if (!existingInfo) {
    console.log("Seeding database...");

    await storage.createPersonalInfo({
      name: "Mehedi Hasan",
      role: "AI/ML Engineer",
      bio: "Passionate AI Engineer specializing in LLMs, OCR, and Document Understanding. Experienced in building high-throughput inference pipelines and scalable ML systems.",
      email: "abir.aust.102@gmail.com",
      phone: "(+880) 1521323549",
      github: "https://github.com/Mehedi-Hasan-Abir",
      linkedin: "https://linkedin.com/in/mehedihasan102",
      location: "Dhaka, Bangladesh",
      avatarUrl: "/images/profile.jpg",
      resumeUrl: "/images/resume.pdf"
    });

    const expData = [
      {
        title: "Senior Software Engineer",
        company: "Technonext",
        period: "Jun 2025 - Present",
        description: [
          "Working on Ticket Parsing for airline/passenger documents, extracting structured fields.",
          "Building a local LLM-powered parsing pipeline using vLLM for high-throughput inference.",
          "Designed a heuristic validation layer to verify LLM outputs and reduce hallucinations.",
          "Developing prompts, post-processing, and evaluation workflows."
        ]
      },
      {
        title: "Senior AI Engineer",
        company: "Next Solution Lab",
        period: "Jun 2023 - Jun 2025",
        description: [
          "Led English DeepICR: built, trained, and tested Text Detection, Layout Detection, and Data-extraction models.",
          "Optimized training and inference pipelines via model fine-tuning and parallel processing.",
          "Enabled GPU multi-training and PDF batching for large documents.",
          "Standardized evaluation with automated reports for PM/business sign-off.",
          "Packaged services with Docker and managed deployment on AWS."
        ]
      },
      {
        title: "AI Engineer",
        company: "Next Solution Lab",
        period: "Jun 2022 - Jun 2023",
        description: [
          "Built the Japanese Text-recognition training pipeline with augmentation/evaluation.",
          "DocQA (pre-LLM): Q&A for contracts/invoices documents using BERT/RoBERTa.",
          "Multilingual OCR: Document OCR for Arabic, Vietnamese, Thai, Indonesian."
        ]
      }
    ];

    for (const exp of expData) {
      await storage.createExperience(exp);
    }

    const projectData = [
      {
        title: "Shorol Notes",
        description: "AI-Powered Note-Taking with voice notes, transcription/summarization, and calendar sync.",
        techStack: ["React", "TypeScript", "Node.js", "OpenAI API", "Tailwind CSS"],
        link: "#"
      },
      {
        title: "AI-Powered Research Agent",
        description: "ReAct-style tool-using agent with PubMed, Wikipedia, ArXiv, and web search integration.",
        techStack: ["Python", "FastAPI", "LangChain", "Transformers"],
        link: "#"
      },
      {
        title: "Japanese Lawyer Assistant",
        description: "Legal Q&A over Japanese corpus using RAG with instruct LLM.",
        techStack: ["Python", "LangChain", "FAISS", "FastAPI", "LLaMA-2"],
        link: "#"
      }
    ];

    for (const proj of projectData) {
      await storage.createProject(proj);
    }

    const skillData = [
      { category: "Languages", items: ["Python", "JavaScript", "Node.js", "C#", "Java"] },
      { category: "Frameworks", items: ["PyTorch", "TensorFlow", "FastAPI", "React", "LangChain"] },
      { category: "Cloud & DevOps", items: ["AWS", "Docker", "CI/CD", "EC2", "S3"] },
      { category: "Tools", items: ["Git", "PostgreSQL", "Elasticsearch", "ChromaDB"] }
    ];

    for (const skill of skillData) {
      await storage.createSkill(skill);
    }

    console.log("Database seeded successfully!");
  }
}
