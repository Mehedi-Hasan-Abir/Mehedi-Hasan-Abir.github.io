import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { SiGithub, SiLinkedin, SiMedium } from "react-icons/si";
import { Link as ScrollLink } from "react-scroll";
import { Navbar } from "@/components/Navbar";
import { useExperiences, useProjects, useSkills, usePersonalInfo, useEducation, useResearch, useInterests, useHeroPhrases, useBlogs } from "@/hooks/use-portfolio";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { useConnection } from "@/contexts/ConnectionContext";
import { LetterCascade } from "@/components/LetterCascade";
import { DrawnName } from "@/components/DrawnName";
import { SmoothTicker } from "@/components/SmoothTicker";
import { StatsStrip } from "@/components/StatsStrip";
import { Magnetic, Marquee, PulseRing, ScrollSkew } from "@/components/Interactive";
import { ExperienceGrouped } from "@/components/ExperienceGrouped";
import { SkillsMindMap } from "@/components/SkillsMindMap";
import { BlogSection } from "@/components/BlogSection";
import { useCanAnimate, useAnimeOnView, useInView } from "@/lib/use-anime";

const MemoryFlipCards = lazy(() =>
  import("@/components/MemoryFlipCards").then((m) => ({ default: m.MemoryFlipCards }))
);

const ease = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { canLoadHeavy } = useConnection();
  const canAnimate = useCanAnimate();
  const { data: experiences } = useExperiences();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: personalInfo } = usePersonalInfo();
  const { data: education } = useEducation();
  const { data: research } = useResearch();
  const { data: interests } = useInterests();
  const { data: blogs } = useBlogs();
  const heroPhrases = useHeroPhrases();

  if (!personalInfo) return null;

  const yearsBuilding = Math.max(1, new Date().getFullYear() - 2021);
  const techCount = skills?.reduce((acc, g) => acc + g.items.length, 0) ?? 0;
  const companyCount = new Set(experiences?.map((e) => e.company) ?? []).size;
  const postCount = blogs?.length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      {/* Scroll-skew wraps page content only - never the fixed navbar */}
      <ScrollSkew>
      <main className="max-w-6xl mx-auto px-5 md:px-8">

        {/* ============ HERO ============ */}
        <section id="hero" className="relative min-h-[92dvh] flex items-center pt-28 pb-16">
          <div className="w-full grid lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="inline-flex items-center gap-2.5 mono-label !text-[13px] md:!text-sm font-semibold text-accent border border-primary/50 bg-primary/10 rounded-full px-5 py-2.5 mb-6 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
                AI/ML ENGINEER &middot; DHAKA, BANGLADESH
              </p>
              <DrawnName />

              <div className="mt-6 min-h-[2.2rem]">
                <SmoothTicker
                  phrases={heroPhrases}
                  className="text-sm md:text-base text-muted-foreground"
                />
              </div>

              <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-[58ch] leading-relaxed">
                {personalInfo.bio}
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <Magnetic>
                  <ScrollLink
                    {...{ href: "#projects" }}
                    to="projects"
                    smooth={true}
                    offset={-80}
                    className="btn-push relative inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <PulseRing enabled={canAnimate} />
                    View my work <ArrowDown className="w-4 h-4" />
                  </ScrollLink>
                </Magnetic>
                <Magnetic>
                  <motion.a
                    href={personalInfo.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.98 }}
                    className="btn-push inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-full font-semibold text-sm hover:border-foreground transition-colors"
                  >
                    Resume <Download className="w-4 h-4" />
                  </motion.a>
                </Magnetic>
              </div>

              <div className="flex items-center gap-1 mt-8">
                {[
                  { href: personalInfo.github, label: "GitHub", Icon: SiGithub },
                  { href: personalInfo.linkedin, label: "LinkedIn", Icon: SiLinkedin },
                  { href: personalInfo.medium, label: "Medium", Icon: SiMedium },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2.5 rounded-md text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
                <span className="w-px h-5 bg-border mx-2" aria-hidden="true" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  aria-label="Email"
                  className="p-2.5 rounded-md text-muted-foreground hover:text-accent transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
                </a>
              </div>
            </motion.div>

            {/* Portrait */}
            <motion.figure
              initial={canAnimate ? { clipPath: "inset(0 100% 0 0)" } : false}
              animate={canAnimate ? { clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={{ duration: 1, delay: 0.5, ease }}
              className="justify-self-center lg:justify-self-end w-full max-w-[280px] lg:max-w-[360px] mt-4 lg:mt-0"
            >
              <div className="relative group">
                {/* Orbiting dashed rings */}
                {canAnimate && (
                  <>
                    <svg
                      aria-hidden="true"
                      className="absolute -inset-7 w-[calc(100%+56px)] h-[calc(100%+56px)] pointer-events-none"
                      style={{ animation: "spin-slow 26s linear infinite" }}
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle cx="50" cy="50" r="48.5" stroke="hsl(var(--primary) / 0.55)" strokeWidth="0.5" strokeDasharray="1.6 2.6" />
                      <circle cx="50" cy="1.5" r="1.5" fill="hsl(var(--primary))" />
                    </svg>
                    <svg
                      aria-hidden="true"
                      className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none"
                      style={{ animation: "spin-slow 16s linear infinite reverse" }}
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle cx="50" cy="50" r="48.8" stroke="hsl(var(--primary) / 0.35)" strokeWidth="0.4" strokeDasharray="0.7 2.2" />
                      <circle cx="98.5" cy="50" r="1.1" fill="hsl(var(--primary) / 0.9)" />
                    </svg>
                  </>
                )}
                <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border border-primary/40 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={800}
                  height={800}
                  className="relative w-full aspect-square object-cover grayscale contrast-[1.04] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <figcaption className="mono-label text-muted-foreground mt-4 flex justify-between">
                <span>DHAKA &middot; UTC+6</span>
                <span>EST. 2021</span>
              </figcaption>
            </motion.figure>
          </div>

          <ScrollLink
            {...{ href: "#experience" }}
            to="experience"
            smooth={true}
            offset={-80}
            aria-label="Scroll to Experience section"
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block text-muted-foreground hover:text-accent transition-colors cursor-pointer"
          >
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </ScrollLink>
        </section>

        {/* ============ STATS ============ */}
        <StatsStrip
          stats={[
            { value: yearsBuilding, suffix: "+", label: "Years building AI" },
            { value: techCount, label: "Production technologies" },
            { value: companyCount, label: "Companies" },
            { value: postCount, label: "Published essays" },
          ]}
        />

        {/* ============ EXPERIENCE ============ */}
        <section id="experience" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Experience" subtitle="My professional journey" />
          {experiences && experiences.length > 0 && (
            <ExperienceGrouped experiences={experiences} />
          )}
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Selected Work" subtitle="Some things I've built" />

          {projects && projects.length > 0 && (
            <div className="grid lg:grid-cols-12 gap-4">
              {/* Lead project */}
              <ProjectCell project={projects[0]} index={0} className="lg:col-span-7" lead />
              <div className="lg:col-span-5 grid gap-4 content-start">
                {projects.slice(1).map((project, index) => (
                  <ProjectCell key={project.id} project={project} index={index + 1} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ============ SKILLS ============ */}
        <section id="skills" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading
            title="Capabilities"
            subtitle="The production stack behind seven years of shipped AI systems"
          />
          {skills && skills.length > 0 && <SkillsMindMap skills={skills} />}
        </section>

        {/* ============ BLOG ============ */}
        <BlogSection />

        {/* ============ EDUCATION + RESEARCH ============ */}
        <section id="education" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Background" subtitle="Education and academic work" />
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight mb-6" style={{ fontStretch: "108%" }}>Education</h3>
              {education?.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className={`rule-t py-4 ${idx === 0 ? "border-t-0 pt-0" : ""}`}
                >
                  <div className="font-bold text-[15px] leading-snug">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground mt-1">{edu.institution}</div>
                  <div className="mono-label text-accent mt-1.5">{edu.period.toUpperCase()}</div>
                </motion.div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight mb-6" style={{ fontStretch: "108%" }}>Research</h3>
              {research?.map((res, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className={`rule-t py-4 ${idx === 0 ? "border-t-0 pt-0" : ""}`}
                >
                  <div className="font-bold text-[15px] leading-snug">{res.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {res.authors} &middot; {res.venue} &middot; {res.year}
                  </div>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent text-[13px] font-semibold mt-2 hover:underline underline-offset-4"
                  >
                    View <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ BEYOND CODE ============ */}
        <section id="personal" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Beyond Code" subtitle="Getting to know me beyond the code" />
          <InterestWave interests={interests ?? []} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.55 }}
            className="border border-border bg-card p-8 md:p-12 mt-10 text-center"
          >
            <p className="text-muted-foreground mb-7 max-w-xl mx-auto leading-relaxed">
              Follow me on social media to see photos from my travels, thoughts on movies &amp; tech, and daily life updates!
            </p>
            <SocialLinks
              personalInfo={{
                github: personalInfo.github || "",
                linkedin: personalInfo.linkedin || "",
                email: personalInfo.email || "",
                facebook: personalInfo.facebook || "",
                instagram: personalInfo.instagram || "",
              }}
            />
          </motion.div>
        </section>

        {/* ============ FUN & GAMES ============ */}
        <section id="games" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Fun & Games" subtitle="Take a break and test your memory" />
          <div className="flex justify-center">
            <Suspense fallback={null}>
              <MemoryFlipCards />
            </Suspense>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="rule-t py-20 md:py-28 cv-auto">
          <SectionHeading title="Get In Touch" />
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, ease }}
          >
            <h3 className="display-lg max-w-[16ch]">
              <LetterCascade as="span" text="Have an idea?" className="block" />
              <span className="block">
                <LetterCascade as="span" text="Let's build it." delay={350} />
              </span>
            </h3>
            <p className="mt-6 text-muted-foreground max-w-xl leading-relaxed">
              I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${personalInfo.email}`}
                className="btn-push relative inline-flex items-center gap-2.5 mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                <PulseRing enabled={canAnimate} />
                Say Hello
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              </a>
            </Magnetic>

            <div className="rule-t pt-8 mt-12">
              <SocialLinks
                personalInfo={{
                  github: personalInfo.github || "",
                  linkedin: personalInfo.linkedin || "",
                  email: personalInfo.email || "",
                  facebook: personalInfo.facebook || "",
                  instagram: personalInfo.instagram || "",
                }}
              />
            </div>
          </motion.div>
        </section>
      </main>

      {/* ============ MARQUEE ============ */}
      <Marquee text="Let's build something useful" />

      {/* ============ FOOTER ============ */}
      <footer className="rule-t py-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-wrap justify-between gap-3 mono-label text-muted-foreground">
          <span>Designed &amp; Built by {personalInfo.name}</span>
          <span>&copy; {new Date().getFullYear()} &middot; All rights reserved</span>
        </div>
      </footer>
      </ScrollSkew>
    </div>
  );
}

/* ---------- Interest chips: center-out anime wave ---------- */

interface Interest {
  icon: string;
  title: string;
  desc: string;
}

function InterestWave({ interests }: { interests: Interest[] }) {
  const canAnimate = useCanAnimate();
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    if (!canAnimate || !inView || !ref.current) return;
    const chips = ref.current.querySelectorAll("[data-chip]");
    if (!chips.length) return;
    const anim = animate(chips, {
      opacity: [0, 1],
      translateY: [16, 0],
      scale: [0.9, 1],
      duration: 550,
      ease: "outBack",
      delay: stagger(70, { from: "center" }),
    });
    return () => { anim.pause(); };
  }, [canAnimate, inView, ref]);

  return (
    <div ref={ref} className="flex flex-wrap gap-2.5">
      {interests.map((interest, idx) => (
        <span
          key={idx}
          data-chip
          className="inline-flex items-center gap-2.5 border border-border rounded-full pl-3 pr-4 py-2 text-sm hover:border-foreground transition-colors"
          title={interest.desc}
          style={canAnimate ? { opacity: 0 } : undefined}
        >
          <i className="not-italic text-base" aria-hidden="true">{interest.icon}</i>
          <b className="font-semibold">{interest.title}</b>
        </span>
      ))}
    </div>
  );
}

/* ---------- Project cell ---------- */

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  link: string;
}

function ProjectCell({
  project,
  index,
  className = "",
  lead = false,
}: {
  project: Project;
  index: number;
  className?: string;
  lead?: boolean;
}) {
  const canAnimate = useCanAnimate();
  const chipsRef = useAnimeOnView<HTMLDivElement>(
    (el) => {
      const chips = el.querySelectorAll("[data-chip]");
      if (!chips.length) return;
      animate(chips, {
        opacity: [0, 1],
        translateY: [10, 0],
        scale: [0.9, 1],
        duration: 450,
        ease: "outBack",
        delay: stagger(40),
      });
    },
    { threshold: 0.4 }
  );

  const traceRef = useRef<SVGRectElement | null>(null);

  const traceBorder = (draw: boolean) => {
    const rect = traceRef.current;
    if (!canAnimate || !rect) return;
    const len = rect.getTotalLength();
    rect.style.strokeDasharray = String(len);
    animate(rect, {
      strokeDashoffset: draw ? [len, 0] : [0, len],
      opacity: draw ? [0, 1] : [1, 0],
      duration: draw ? 700 : 400,
      ease: draw ? "outQuad" : "inQuad",
    });
  };

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => traceBorder(true)}
      onMouseLeave={() => traceBorder(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      className={`group relative border border-border bg-card p-7 md:p-9 flex flex-col hover:border-primary/60 transition-colors overflow-hidden ${className}`}
    >
      {canAnimate && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full">
          <rect
            ref={traceRef}
            x="0.5" y="0.5" width="99.6%" height="99.6%"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            style={{ opacity: 0 }}
          />
        </svg>
      )}
      <span className="mono-label text-accent">P&middot;{String(index + 1).padStart(2, "0")}</span>
      <h3 className={`font-extrabold tracking-tight mt-3 ${lead ? "text-2xl md:text-[2rem]" : "text-xl"}`} style={{ fontStretch: "106%" }}>
        {project.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1 max-w-[64ch]">
        {project.description}
      </p>
      <div ref={chipsRef} className="flex flex-wrap gap-1.5 mt-5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            data-chip
            className="mono-label text-muted-foreground border border-border px-2.5 py-1 rounded-md"
            style={canAnimate ? { opacity: 0 } : undefined}
          >
            {tech}
          </span>
        ))}
      </div>
      <span className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold mt-6">
        View on GitHub <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </motion.a>
  );
}
