import { ArrowUpRight } from "lucide-react";
import { useParams } from "wouter";
import { caseStudies } from "@/data/case-studies";
import { portfolioData } from "@/data/portfolio-data";
import NotFound from "@/pages/not-found";

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return <NotFound />;

  const project = portfolioData.projects.find((item) => item.id === study.projectId);
  if (!project) return <NotFound />;
  const related = caseStudies.filter((item) => item.slug !== slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mono-label text-muted-foreground mb-10">
          <a href="/" className="hover:text-accent">Home</a> / <a href="/works/" className="hover:text-accent">Work</a> / {study.slug.replaceAll("-", " ")}
        </nav>
        <p className="mono-label text-accent mb-4">PROJECT CASE STUDY</p>
        <h1 className="display-lg max-w-[22ch]">{study.title}</h1>
        <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed">{study.summary}</p>
        <div className="mt-7 flex flex-wrap gap-2">
          {project.techStack.map((technology) => <span key={technology} className="tech-chip">{technology}</span>)}
        </div>

        <section className="rule-t mt-16 pt-10" aria-labelledby="challenge-heading">
          <h2 id="challenge-heading" className="text-2xl font-extrabold">The problem</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{study.challenge}</p>
        </section>
        <section className="rule-t mt-12 pt-10" aria-labelledby="approach-heading">
          <h2 id="approach-heading" className="text-2xl font-extrabold">How it works</h2>
          {study.approach.map((paragraph) => <p key={paragraph} className="mt-4 text-muted-foreground leading-relaxed">{paragraph}</p>)}
        </section>
        <section className="rule-t mt-12 pt-10" aria-labelledby="outcome-heading">
          <h2 id="outcome-heading" className="text-2xl font-extrabold">Results and limits</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{study.outcome}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{study.caveat}</p>
        </section>

        <div className="rule-t mt-14 pt-8 flex flex-wrap gap-5 items-center">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
            View source and evidence <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="/works/" className="text-muted-foreground hover:text-accent">All work</a>
        </div>
        {related.length > 0 && (
          <aside className="rule-t mt-14 pt-8" aria-label="Related projects">
            <h2 className="text-xl font-bold">Related case study</h2>
            {related.map((item) => (
              <a key={item.slug} href={`/projects/${item.slug}/`} className="block mt-4 text-accent hover:underline">{item.title}</a>
            ))}
          </aside>
        )}
      </div>
    </main>
  );
}
