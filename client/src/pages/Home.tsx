import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { useExperiences, useProjects, useSkills, usePersonalInfo, useEducation, useResearch, useInterests, useHeroPhrases } from "@/hooks/use-portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { useConnection } from "@/contexts/ConnectionContext";
import { NeuralMeshBackground } from "@/components/NeuralMeshBackground";
import { TimelineItem } from "@/components/TimelineItem";
import { ProjectCard } from "@/components/ProjectCard";
import { EducationItem } from "@/components/EducationItem";
import { ResearchItem } from "@/components/ResearchItem";
import { BlogSection } from "@/components/BlogSection";
import { RoleTicker } from "@/components/RoleTicker";
import { motion } from "framer-motion";
import { 
  Mail, 
  Download, 
  ArrowRight, 
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

const MemoryFlipCards = lazy(() =>
  import("@/components/MemoryFlipCards").then((m) => ({ default: m.MemoryFlipCards }))
);

export default function Home() {
  const { canLoadHeavy } = useConnection();
  const { data: experiences } = useExperiences();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: personalInfo } = usePersonalInfo();
  const { data: education } = useEducation();
  const { data: research } = useResearch();
  const { data: interests } = useInterests();
  const heroPhrases = useHeroPhrases();

  if (!personalInfo) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative isolate">
      {canLoadHeavy && <NeuralMeshBackground />}
      <div className="relative z-10">
      <Navbar />
      <main>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] ambient-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] ambient-float [animation-delay:0.6s]" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full bg-cyan-300/15 blur-[120px] ambient-float [animation-delay:1.1s]" />
        </div>

        <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-primary mb-4 block text-lg">Hi, my name is</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              {personalInfo.name}
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-muted-foreground mb-8">
              {personalInfo.role}
            </h2>
            {canLoadHeavy && <RoleTicker phrases={heroPhrases} />}
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              {personalInfo.bio}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <ScrollLink
                {...{ href: "#projects" }}
                to="projects"
                smooth={true}
                offset={-100}
                className="px-8 py-4 bg-primary text-slate-950 rounded-lg font-semibold hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 cursor-pointer"
              >
                View My Work <ArrowRight className="w-4 h-4" />
              </ScrollLink>
              
              {personalInfo.resumeUrl && (
                <motion.a
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all flex items-center gap-2 border border-white/5"
                >
                  <Download className="w-4 h-4" /> Resume
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 group">
              <div className="absolute inset-0 border-2 border-primary rounded-lg translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
              <div className="absolute inset-0 bg-card rounded-lg overflow-hidden shadow-2xl">
                {personalInfo.avatarUrl ? (
                  <img 
                    src={personalInfo.avatarUrl} 
                    alt={personalInfo.name} 
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      canLoadHeavy ? "grayscale group-hover:grayscale-0" : "blur-sm"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-6xl font-mono text-muted-foreground opacity-20">
                      {personalInfo.name?.substring(0, 2) ?? "MH"}
                    </span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <ScrollLink
            {...{ href: "#about" }}
            to="about"
            smooth={true}
            offset={-100}
            aria-label="Scroll to About section"
            className="cursor-pointer text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </ScrollLink>
        </div>
      </section>

      <div className="section-glow-divider" aria-hidden="true" />

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <SectionHeading title="About Me" subtitle="Getting to know the person behind the code" />
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-12 items-center">
             <div className="md:col-span-3 space-y-6 text-muted-foreground leading-relaxed text-lg">
               <p>
                 I’m a Software Engineer based in <span className="text-foreground font-medium">{personalInfo.location}</span> who believes that great technology is built at the intersection of rigorous logic and human empathy.
                 I specialize in teaching computers how to read, think, and solve problems. With a deep focus on LLMs and Document AI, I build production-ready systems that transform how businesses handle information.
               </p>
               <p>
                 My philosophy is simple: Engineering is most powerful when it’s driven by curiosity and built with a sense of purpose.
                </p>
                <p>
                 When I’m away from the terminal, I’m usually exploring the latest in tech research or enjoying the vibrant energy of Dhaka with friends.
               </p>
             </div>
             <div className="md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center aspect-square hover:border-primary/50 transition-colors">
                    <Terminal className="w-8 h-8 text-primary mb-3" />
                    <span className="font-bold text-foreground">Backend</span>
                    <span className="text-xs text-muted-foreground mt-1">Node.js, Python</span>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center aspect-square hover:border-primary/50 transition-colors">
                    <Globe className="w-8 h-8 text-primary mb-3" />
                    <span className="font-bold text-foreground">Web</span>
                    <span className="text-xs text-muted-foreground mt-1">React, Next.js</span>
                  </div>
                  <div className="bg-card p-6 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center aspect-square hover:border-primary/50 transition-colors col-span-2 md:col-span-2">
                    <Cpu className="w-8 h-8 text-primary mb-3" />
                    <span className="font-bold text-foreground">AI Engineering</span>
                    <span className="text-xs text-muted-foreground mt-1">LLMs, PyTorch, TensorFlow</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <div className="section-glow-divider" aria-hidden="true" />

      {/* Experience Section */}
      <section id="experience" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <SectionHeading title="Experience" subtitle="My professional journey" />
          
          <div className="max-w-4xl mx-auto mt-16 space-y-12 md:space-y-0">
            {experiences?.map((exp, index) => (
              <TimelineItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-glow-divider" aria-hidden="true" />

      {/* Projects Section */}
      <section id="projects" className="py-24 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Projects" subtitle="Some things I've built" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {projects?.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Skills" subtitle="Technologies I work with" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            {skills?.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-card p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-lg font-bold mb-4 text-primary font-mono">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-xs font-medium rounded-full transition-all cursor-default border border-border/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Education Section */}
      <section id="education" className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-4">
          <SectionHeading title="Education" subtitle="My academic journey" />
          
          <div className="max-w-4xl mx-auto mt-16 space-y-8">
            {education?.map((edu, idx) => (
              <EducationItem 
                key={idx}
                institution={edu.institution}
                degree={edu.degree}
                period={edu.period}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Research Experience Section */}
      <section id="research" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <SectionHeading title="Research" subtitle="Publications and academic work" />
          
          <div className="max-w-4xl mx-auto mt-12 space-y-6">
            {research?.map((res, idx) => (
              <ResearchItem
                key={idx}
                title={res.title}
                authors={res.authors}
                venue={res.venue}
                year={res.year}
                link={res.link}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Personal & Social Section */}
      <section id="personal" className="py-24 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Beyond Code" subtitle="Getting to know me beyond the code" />
          
          <div className="max-w-5xl mx-auto mt-16">
            {/* Personal Interests Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {interests?.map((interest, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 text-center"
                >
                  <div className="text-4xl mb-3">{interest.icon}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{interest.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{interest.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Social Media Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card/50 p-12 rounded-2xl border border-border/50 text-center"
            >
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Follow me on social media to see photos from my travels, thoughts on movies & tech, and daily life updates!
              </p>
              
              <SocialLinks 
                personalInfo={{
                  github: personalInfo.github || "",
                  linkedin: personalInfo.linkedin || "",
                  email: personalInfo.email || "",
                  facebook: personalInfo.facebook || "",
                  instagram: personalInfo.instagram || ""
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Memory Flip Cards Section */}
      <section id="games" className="py-24 md:py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <SectionHeading title="Fun & Games" subtitle="Take a break and test your memory" />
          
          <div className="flex justify-center mt-12">
            <Suspense fallback={null}>
              <MemoryFlipCards />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading title="Get In Touch" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-card p-10 rounded-2xl border border-border shadow-2xl"
          >
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-lg shadow-primary/25 mb-12"
            >
              <Mail className="w-5 h-5" />
              Say Hello
            </a>
            
            <SocialLinks 
              personalInfo={{
                github: personalInfo.github || "",
                linkedin: personalInfo.linkedin || "",
                email: personalInfo.email || "",
                facebook: personalInfo.facebook || "",
                instagram: personalInfo.instagram || ""
              }}
            />
          </motion.div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Designed & Built by {personalInfo.name}
          </p>
          {/* Increase contrast for accessibility (was text-muted-foreground/50) */}
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
