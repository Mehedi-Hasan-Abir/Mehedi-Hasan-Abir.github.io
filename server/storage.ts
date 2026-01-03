import { 
  Experience, InsertExperience, 
  Project, InsertProject, 
  Skill, InsertSkill, 
  PersonalInfo, InsertPersonalInfo,
  experiences, projects, skills, personalInfo 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Mock data for development without database
const MOCK_PERSONAL_INFO: any = {
  id: 1,
  name: "Mehedi Hasan",
  role: "AI/ML Engineer",
  bio: "AI/ML Engineer with expertise in document understanding, deep learning, and LLM applications. Experienced in building production-grade systems for text recognition, data extraction, and intelligent search.",
  email: "abir.aust.102@gmail.com",
  phone: "(+880) 1521323549",
  github: "https://github.com/Mehedi-Hasan-Abir",
  linkedin: "https://linkedin.com/in/mehedihasan102",
  location: "Dhaka, Bangladesh",
  avatarUrl: "https://avatars.githubusercontent.com/u/76932315?v=4",
  resumeUrl: "https://drive.google.com/file/d/1EnArhls8W_j5GopG_l-6Y0nijhOxnTwB/view?usp=sharing",
  facebook: "https://www.facebook.com/mehedihasan.abir.7/",
  instagram: "https://www.instagram.com/___abracadabra_____/"
};

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Technonext",
    period: "Jun 2025 – Present",
    description: [
      "Working on Ticket Parsing for airline/passenger documents with structured field extraction",
      "Built local LLM-powered parsing pipeline using vLLM for high-throughput inference",
      "Designed heuristic validation layer to reduce hallucinations and ensure schema-correct extraction",
      "Tech: vLLM, Local LLM, RAG, Python, FastAPI"
    ]
  },
  {
    id: 2,
    title: "Senior AI Engineer",
    company: "Next Solution Lab",
    period: "Jun 2023 – Jun 2025",
    description: [
      "Led English DeepICR system for document understanding (contracts/invoices)",
      "Built and trained Text Detection, Layout Detection, Text Recognition models",
      "Tech: Mask R-CNN, OpenCV, YOLOv7, DBNet, LayoutLM, BROS",
      "Optimized training and inference pipelines with PyTorch DDP and CUDA for improved throughput",
      "Tech: PyTorch DDP, CUDA, cuDNN",
      "Packaged services with Docker and managed deployment via AWS (EC2, S3, ECR, CloudWatch)",
      "Implemented LoRA/PEFT-based LLM fine-tuning and inference acceleration pipelines",
      "Tech: HuggingFace Transformers, BitsAndBytes, ONNX",
      "Built RAG search system for Japanese legal documents with conversational Q&A",
      "Tech: LangChain, ChromaDB, Elasticsearch, FastAPI"
    ]
  },
  {
    id: 3,
    title: "AI Engineer",
    company: "Next Solution Lab",
    period: "Jun 2022 – Jun 2023",
    description: [
      "Built Japanese Text-recognition training pipeline with ~5,000-character coverage",
      "Tech: RCNN+CTC",
      "Trained and tested models for English DeepICR on new datasets every sprint",
      "Developed DocQA system for Q&A on contracts and invoices",
      "Tech: BERT, RoBERTa, Flask, Streamlit",
      "Implemented Multilingual OCR for Arabic, Vietnamese, Thai, and Indonesian documents",
      "Tech: Google Vision API, FastAPI, NVIDIA NeMo"
    ]
  },
  {
    id: 4,
    title: "Associate AI Engineer",
    company: "Next Solution Lab",
    period: "Jun 2021 – Jun 2022",
    description: [
      "Built Key-Value Extraction Module with OpenCV rule engine extracting 128 fields",
      "Tech: OpenCV, REST API",
      "Developed Smart Farming POC for camera-only cattle monitoring",
      "Tech: Detectron2, SORT",
      "Implemented ID/OCR system for driving license extraction",
      "Tech: YOLOv5, FastAPI, Streamlit"
    ]
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Shorol Notes — AI-Powered Note-Taking",
    description: "Voice notes with AI transcription and summarization; calendar sync with Bangla-first UX. Pluggable backends supporting OpenAI, Ollama, and Hugging Face models.",
    techStack: ["React", "TypeScript", "Vite", "Node.js", "Express", "TailwindCSS", "OpenAI API"],
    link: "https://github.com/Mehedi-Hasan-Abir"
  },
  {
    id: 2,
    title: "AI-Powered Research Agent",
    description: "ReAct-style tool-using agent with integrated search across PubMed, Wikipedia, ArXiv, and the web. Configurable prompts and models for diverse research queries.",
    techStack: ["Python", "FastAPI", "LangChain", "Transformers", "SerpAPI"],
    link: "https://github.com/Mehedi-Hasan-Abir"
  },
  {
    id: 3,
    title: "Japanese Lawyer Assistant",
    description: "Legal Q&A system over Japanese corpus using RAG with FAISS retriever and ELYZALLaMA-2. Provides concise answers with custom prompts.",
    techStack: ["Python", "LangChain", "FAISS", "FastAPI", "HuggingFace"],
    link: "https://github.com/Mehedi-Hasan-Abir"
  }
];

const MOCK_SKILLS: Skill[] = [
  {
    id: 1,
    category: "Programming",
    items: ["Python", "JavaScript", "Node.js", "C#", "Java", "TypeScript"]
  },
  {
    id: 2,
    category: "ML & Deep Learning",
    items: ["PyTorch", "TensorFlow", "Transformers", "YOLOv7", "Mask R-CNN", "LayoutLM", "ONNX"]
  },
  {
    id: 3,
    category: "LLMs & NLP",
    items: ["BERT", "RoBERTa", "LLM Fine-tuning", "LoRA/PEFT", "RAG", "LangChain", "ChromaDB"]
  },
  {
    id: 4,
    category: "Backend & APIs",
    items: ["FastAPI", "Express.js", "REST API", "Docker", "CI/CD"]
  },
  {
    id: 5,
    category: "Frontend",
    items: ["React", "Material-UI", "TailwindCSS", "Vite"]
  },
  {
    id: 6,
    category: "Cloud & DevOps",
    items: ["AWS (EC2, S3, Lambda, ECR)", "Docker", "Elasticsearch", "CloudWatch"]
  }
];

export const MOCK_EDUCATION = [
  {
    id: 1,
    institution: "Ahsanullah University of Science and Technology (AUST)",
    degree: "Bachelor of Science in Computer Science & Engineering",
    gpa: "3.59/4.00",
    period: "Apr 2016 – Jan 2021"
  },
  {
    id: 2,
    institution: "Hermann Gmeiner School, Mirpur",
    degree: "Higher Secondary Certificate (HSC)",
    gpa: "5.00/5.00",
    period: "2013 – 2015"
  },
  {
    id: 3,
    institution: "Mirpur Bangla School & College",
    degree: "Secondary School Certificate (SSC)",
    gpa: "5.00/5.00",
    period: "2003 – 2013"
  }
];

export const MOCK_RESEARCH = [
  {
    id: 1,
    title: "Bengali Intent Classification with Generative Adversarial BERT",
    authors: "Mehedi Hasan (First Author)",
    venue: "IEEE Xplore",
    year: "2023",
    link: "https://github.com/Mehedi-Hasan-Abir"
  },
  {
    id: 2,
    title: "Design of an Arrhythmia Classification Algorithm Using 2-D Convolutional Neural Network",
    authors: "Mehedi Hasan (First Author)",
    venue: "Undergraduate Thesis, AUST",
    year: "2021",
    link: "https://github.com/Mehedi-Hasan-Abir"
  }
];

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
    if (!db) return MOCK_EXPERIENCES;
    return await db.select().from(experiences).orderBy(experiences.id);
  }

  async getProjects(): Promise<Project[]> {
    if (!db) return MOCK_PROJECTS;
    return await db.select().from(projects).orderBy(projects.id);
  }

  async getSkills(): Promise<Skill[]> {
    if (!db) return MOCK_SKILLS;
    return await db.select().from(skills).orderBy(skills.id);
  }

  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    if (!db) return MOCK_PERSONAL_INFO;
    const [info] = await db.select().from(personalInfo).limit(1);
    return info;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    if (!db) return experience as Experience;
    const [newExperience] = await db.insert(experiences).values(experience).returning();
    return newExperience;
  }

  async createProject(project: InsertProject): Promise<Project> {
    if (!db) return project as Project;
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    if (!db) return skill as Skill;
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async createPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo> {
    if (!db) return info as PersonalInfo;
    const [newInfo] = await db.insert(personalInfo).values(info).returning();
    return newInfo;
  }
}

export const storage = new DatabaseStorage();
