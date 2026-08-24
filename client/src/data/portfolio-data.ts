// Static portfolio data for GitHub Pages deployment
export const educationData = [
  { institution: "Ahsanullah University of Science and Technology (AUST)", degree: "Bachelor of Science in Computer Science & Engineering", period: "Apr 2016 – Jan 2021" },
  { institution: "Hermann Gmeiner School, Mirpur", degree: "Higher Secondary Certificate (HSC)", period: "2013 – 2015" },
  { institution: "Mirpur Bangla School & College", degree: "Secondary School Certificate (SSC)", period: "2003 – 2013" }
];

export const researchData = [
  { title: "Bengali Intent Classification with Generative Adversarial BERT", authors: "Mehedi Hasan (First Author)", venue: "IEEE Xplore", year: "2023", link: "https://github.com/Mehedi-Hasan-Abir" },
  { title: "Design of an Arrhythmia Classification Algorithm Using 2-D Convolutional Neural Network", authors: "Mehedi Hasan (First Author)", venue: "Undergraduate Thesis, AUST", year: "2021", link: "https://github.com/Mehedi-Hasan-Abir" }
];

export const interestsData = [
  { icon: "\u26BD", title: "Football", desc: "I love watching and playing football whenever I can" },
  { icon: "\uD83C\uDFAC", title: "Cinema & Series", desc: "A true cinefile who watches movies and series religiously" },
  { icon: "\uD83D\uDCF8", title: "Photography", desc: "Passionate about art, especially photography and visual storytelling" },
  { icon: "\u2708\uFE0F", title: "Travel", desc: "Always up for exploring new places and cultures" },
  { icon: "\uD83C\uDFC6", title: "All Sports", desc: "Tennis, cricket, basketball, table tennis - I watch them all" },
  { icon: "\uD83C\uDFB5", title: "Music", desc: "Music is a big part of my life and creative process" }
];

export const heroPhrases = [
  "Building production-grade LLM systems",
  "Designing resilient AI pipelines",
  "Turning complex documents into useful data",
  "Shipping fast interfaces with measurable impact",
];

export const portfolioData = {
  personalInfo: {
    id: 1,
    name: "Mehedi Hasan",
    role: "AI/ML Engineer",
    bio: "I believe that great AI shouldn't just be powerful; it should be useful. I'm passionate about building tools that save people time and make businesses smarter.",
    email: "abir.aust.102@gmail.com",
    phone: "(+880) 1521323549",
    github: "https://github.com/Mehedi-Hasan-Abir",
    linkedin: "https://linkedin.com/in/mehedihasan102",
    location: "Dhaka, Bangladesh",
    avatarUrl: "/images/profile_re.webp",
    resumeUrl: "https://drive.google.com/file/d/1D3XEr6KhoJV9eu38J3p6DT6bGXLFHKxm/view?usp=sharing",
    facebook: "https://www.facebook.com/mehedihasan.abir.7/",
    instagram: "https://www.instagram.com/___abracadabra_____/",
    medium: "https://medium.com/@mhabir102",
  },
  experiences: [
    {
      id: 1,
      title: "Senior Software Engineer (AI/ML)",
      company: "Technonext",
      period: "Jun 2025 – Present",
      description: [
        "Food Delivery App — Built gRPC-based cuisine prediction microservice using Sentence Transformers + FAISS vector search; achieved 100 RPS on 2 vCPU with ONNX inference optimization and Redis-powered personalization",
        "Tech: gRPC, Sentence Transformers, FAISS, PostgreSQL, Redis, ONNX",
        "E-commerce — End-to-end visual product search with CLIP embeddings, FAISS retrieval, Elasticsearch ranking, and Kafka batch processing; model optimization via ONNX and OpenVINO",
        "Tech: CLIP, FAISS, Elasticsearch, Kafka, ONNX, OpenVINO",
        "Passport MRZ Scanner — Full ML pipeline with real-time ONNX inference, Redis Streams, custom async scheduler (Python/Golang) with micro-batching, and CPU-isolated multiprocessing worker pool",
        "Tech: ONNX, Redis Streams, Python, Golang, Multiprocessing",
        "Agentic AI Chatbot — LangGraph multi-step orchestration with vLLM (Gemma 12B/LLaMA 3 8B), hybrid RAG (Qdrant + Elasticsearch), BGE reranking, FastAPI + gRPC backends, LangSmith + Prometheus observability",
        "Tech: LangGraph, vLLM, Qdrant, Elasticsearch, FastAPI, gRPC, LangSmith, Prometheus",
        "Infrastructure — Docker, Kubernetes, CI/CD (GitHub Actions), Prometheus + Grafana monitoring across all production services",
        "Tech: Docker, Kubernetes, GitHub Actions, Prometheus, Grafana",
      ],
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
        "Tech: LangChain, ChromaDB, Elasticsearch, FastAPI",
      ],
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
        "Tech: Google Vision API, FastAPI, NVIDIA NeMo",
      ],
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
        "Tech: YOLOv5, FastAPI, Streamlit",
      ],
    },
  ],
  projects: [
    {
      id: 1,
      title: "Shorol Notes — AI-Powered Note-Taking",
      description:
        "Voice notes with AI transcription and summarization; calendar sync with Bangla-first UX. Pluggable backends supporting OpenAI, Ollama, and Hugging Face models.",
      techStack: [
        "React",
        "TypeScript",
        "Vite",
        "Node.js",
        "Express",
        "TailwindCSS",
        "OpenAI API",
      ],
      link: "https://github.com/Mehedi-Hasan-Abir/Shorol-Notes-AI-Powered",
    },
    {
      id: 2,
      title: "AI-Powered Research Agent",
      description:
        "ReAct-style tool-using agent with integrated search across PubMed, Wikipedia, ArXiv, and the web. Configurable prompts and models for diverse research queries.",
      techStack: [
        "Python",
        "FastAPI",
        "LangChain",
        "Transformers",
        "SerpAPI",
      ],
      link: "https://github.com/Mehedi-Hasan-Abir/AI_Powered_Research_Agent-LLM-",
    },
    {
      id: 3,
      title: "Japanese Lawyer Assistant",
      description:
        "Legal Q&A system over Japanese corpus using RAG with FAISS retriever and ELYZALLaMA-2. Provides concise answers with custom prompts.",
      techStack: [
        "Python",
        "LangChain",
        "FAISS",
        "FastAPI",
        "HuggingFace",
      ],
      link: "https://github.com/Mehedi-Hasan-Abir/Japanese-Lawyer-Assistant-Langchain-LLM",
    },
  ],
  skills: [
    {
      id: 1,
      category: "Programming",
      items: [
        "Python",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Golang",
        "C#",
        "Java",
      ],
    },
    {
      id: 2,
      category: "ML & Deep Learning",
      items: [
        "PyTorch",
        "TensorFlow",
        "HuggingFace Transformers",
        "ONNX Runtime",
        "OpenVINO",
        "YOLOv7",
        "Mask R-CNN",
        "LayoutLM",
      ],
    },
    {
      id: 3,
      category: "LLMs & Agentic AI",
      items: [
        "LangGraph",
        "vLLM",
        "LangChain",
        "RAG (Retrieval-Augmented Generation)",
        "BGE / E5 Embeddings",
        "Reranking",
        "LoRA / PEFT",
        "DPO",
        "LLaMA 3",
        "Gemma",
        "Mistral",
      ],
    },
    {
      id: 4,
      category: "Vector & Search",
      items: [
        "Qdrant",
        "FAISS",
        "Elasticsearch",
        "ChromaDB",
        "Hybrid Search (BM25 + Vector)",
      ],
    },
    {
      id: 5,
      category: "Backend & Distributed Systems",
      items: [
        "FastAPI",
        "gRPC",
        "Kafka",
        "Redis Streams",
        "Microservices",
        "Asyncio",
        "PostgreSQL",
        "MySQL",
      ],
    },
    {
      id: 6,
      category: "Frontend",
      items: [
        "React",
        "TypeScript",
        "TailwindCSS",
        "Vite",
        "Material-UI",
      ],
    },
    {
      id: 7,
      category: "DevOps & Cloud",
      items: [
        "Kubernetes",
        "Docker",
        "AWS (EC2, ECS, S3, Lambda, ECR)",
        "Prometheus",
        "Grafana",
        "OpenTelemetry",
        "CI/CD (GitHub Actions)",
        "CloudWatch",
      ],
    },
  ],
  blogs: [
    {
      id: 1,
      title: "The System Design Decisions Behind Big Tech Stacks",
      description: "System design lessons from Uber, Netflix, Stripe, and other tech giants. A practical breakdown of distributed systems, cloud-native infrastructure, high-performance backends, and the trade-offs tech leads must understand.",
      thumbnail: "/images/blog-system-design-big-tech.jpg",
      thumbnailWidth: 1024,
      thumbnailHeight: 572,
      externalLink: "https://mhabir.substack.com/p/the-system-design-decisions-behind",
      platform: "Substack",
      date: "2026-01-07",
      tags: ["System Design", "Software Architecture", "Tech Lead", "Distributed Systems", "Big Tech", "Scalability"]
    },
    {
      id: 2,
      title: "LLM Latency in Production (Part 1) — Model-Level Optimization",
      description: "A tech lead's playbook for reducing LLM inference latency in production. Part 1 focuses on model-level optimization: GPU bottlenecks, memory bandwidth limits, quantization (INT8/INT4), Flash Attention, and vLLM internals.",
      thumbnail: "/images/blog-llm-latency-production.jpg",
      thumbnailWidth: 1024,
      thumbnailHeight: 572,
      externalLink: "https://mhabir.substack.com/p/3-part-series-llm-latency-in-production",
      platform: "Substack",
      date: "2026-01-07",
      tags: ["LLM", "Inference", "Latency", "GPU", "Quantization", "vLLM", "Production Systems"]
    },
    {
      id: 3,
      title: "How to Use, Optimize and Serve an LLM in Your Production System",
      description: "An end-to-end guide covering the full lifecycle of deploying LLMs in production: model selection, quantization and pruning strategies, inference optimization, and high-performance serving with vLLM and ONNX Runtime.",
      thumbnail: "/images/blog-llm-production-system.webp",
      thumbnailWidth: 1200,
      thumbnailHeight: 670,
      externalLink: "https://medium.com/towards-artificial-intelligence/how-to-use-optimize-and-serve-an-llm-in-your-production-system-25fd40f63b6a",
      platform: "Medium",
      date: "2026-06-20",
      tags: ["LLM", "Production Systems", "Optimization", "Inference", "MLOps", "vLLM", "ONNX"]
    },
    {
      id: 4,
      title: "LLM Latency in Production (Part 2) — Serve-Level Speed",
      description: "Part 2 of the LLM latency series. Covers serve-level architecture: request batching, async queuing, load balancing, and system design patterns that stabilize P95/P99 tail latency in production LLM services.",
      thumbnail: "/images/blog-llm-latency-serve.webp",
      thumbnailWidth: 1200,
      thumbnailHeight: 670,
      externalLink: "https://medium.com/towards-artificial-intelligence/part-2-serve-level-speed-system-design-that-stabilizes-p95-p99-61543d856588",
      platform: "Medium",
      date: "2026-06-20",
      tags: ["LLM", "Latency", "P95", "P99", "System Design", "Inference Serving", "Production Systems"]
    },
    {
      id: 5,
      title: "LLM Latency in Production (Part 3) — Engine-Level Runtime Selection",
      description: "Part 3 of the LLM latency series. A deep dive into inference engine selection — vLLM, TensorRT-LLM, ONNX Runtime — and how choosing the right runtime gives you throughput, latency, and hardware efficiency for free.",
      thumbnail: "/images/blog-llm-latency-engine.webp",
      thumbnailWidth: 1200,
      thumbnailHeight: 800,
      externalLink: "https://medium.com/towards-artificial-intelligence/part-3-implementation-engine-level-choosing-the-runtime-that-gives-you-these-for-free-b0e9081205b0",
      platform: "Medium",
      date: "2026-06-20",
      tags: ["LLM", "Runtime", "vLLM", "TensorRT", "ONNX", "Inference Engine", "Production Systems"]
    },
  ],
};
