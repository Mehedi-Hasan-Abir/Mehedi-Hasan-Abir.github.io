import { Navbar } from "@/components/Navbar";
import { useExperiences, useProjects, useSkills, usePersonalInfo } from "@/hooks/use-portfolio";
import { TimelineItem } from "@/components/TimelineItem";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Download, 
  ArrowRight, 
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

export default function Home() {
  const { data: experiences, isLoading: loadingExp } = useExperiences();
  const { data: projects, isLoading: loadingProj } = useProjects();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: personalInfo, isLoading: loadingInfo } = usePersonalInfo();

  if (loadingExp || loadingProj || loadingSkills || loadingInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="font-mono text-muted-foreground animate-pulse">Loading System...</p>
        </div>
      </div>
    );
  }

  if (!personalInfo) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
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
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              {personalInfo.bio}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <ScrollLink to="projects" smooth={true} offset={-100}>
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-lg shadow-primary/25 flex items-center gap-2">
                  View My Work <ArrowRight className="w-4 h-4" />
                </button>
              </ScrollLink>
              
              {personalInfo.resumeUrl && (
                <a 
                  href={personalInfo.resumeUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-all hover:-translate-y-1 flex items-center gap-2 border border-white/5"
                >
                  <Download className="w-4 h-4" /> Resume
                </a>
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
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-6xl font-mono text-muted-foreground opacity-20">
                      {personalInfo.name.substring(0, 2)}
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
          <ScrollLink to="about" smooth={true} offset={-100} className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="w-6 h-6 rotate-90" />
          </ScrollLink>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <SectionHeading title="About Me" subtitle="Getting to know the person behind the code" />
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-12 items-center">
             <div className="md:col-span-3 space-y-6 text-muted-foreground leading-relaxed text-lg">
               <p>
                 I am a passionate software engineer based in <span className="text-foreground font-medium">{personalInfo.location}</span>. 
                 I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between.
               </p>
               <p>
                 My goal is to always build products that provide pixel-perfect, performant experiences. 
                 When I'm not at the computer, I'm usually hanging out with my friends, reading, or exploring new tech.
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
      <section id="skills" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <SectionHeading title="Skills" subtitle="Technologies I work with" />
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            {skills?.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors"
              >
                <h3 className="text-xl font-bold mb-6 text-center text-primary font-mono">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {skillGroup.items.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-border pt-8 mt-8">
              <div className="flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</div>
                  <a href={`mailto:${personalInfo.email}`} className="text-sm font-medium hover:text-primary transition-colors">{personalInfo.email}</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</div>
                  <div className="text-sm font-medium">{personalInfo.location}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 md:col-span-1 mt-4 md:mt-0">
                {personalInfo.github && (
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Designed & Built by {personalInfo.name}
          </p>
          <p className="text-xs text-muted-foreground/50 mt-2">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
