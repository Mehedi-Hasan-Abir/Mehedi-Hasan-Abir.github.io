import { ArrowUpRight } from "lucide-react";
import { educationData, portfolioData } from "@/data/portfolio-data";

export default function AboutPage() {
  const { personalInfo, experiences } = portfolioData;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mono-label text-muted-foreground mb-10">
          <a href="/" className="hover:text-accent">Home</a> / About
        </nav>
        <p className="mono-label text-accent mb-4">DHAKA · AI / ML ENGINEERING</p>
        <h1 className="display-lg max-w-[16ch]">About Mehedi Hasan Abir</h1>
        <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">
          {personalInfo.bio}
        </p>

        <section className="rule-t mt-16 pt-10" aria-labelledby="work-heading">
          <h2 id="work-heading" className="text-2xl font-extrabold">What I work on</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            My recent work spans retrieval-augmented assistants, document intelligence,
            search systems, and model inference. I work across the path from data and
            evaluation to APIs, deployment, and monitoring. The projects on this site
            show public examples of those systems; client and employer work is described
            only at the level shared in my professional portfolio.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/works/" className="inline-flex items-center gap-2 border border-border px-5 py-3 font-semibold hover:border-primary hover:text-accent">Explore work <ArrowUpRight className="w-4 h-4" /></a>
            <a href="/research/" className="inline-flex items-center gap-2 border border-border px-5 py-3 font-semibold hover:border-primary hover:text-accent">Research & publications <ArrowUpRight className="w-4 h-4" /></a>
          </div>
        </section>

        <section className="rule-t mt-16 pt-10" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="text-2xl font-extrabold">Experience</h2>
          <div className="mt-6 space-y-7">
            {experiences.slice(0, 3).map((role) => (
              <article key={role.id} className="border-l-2 border-primary/50 pl-5">
                <h3 className="text-lg font-bold">{role.title}</h3>
                <p className="mono-label text-accent mt-1">{role.company} · {role.period}</p>
                <p className="text-muted-foreground mt-2 leading-relaxed">{role.description[0]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rule-t mt-16 pt-10" aria-labelledby="background-heading">
          <h2 id="background-heading" className="text-2xl font-extrabold">Background</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {educationData[0].degree} from {educationData[0].institution}.
            My published research includes Bengali intent classification with
            generative adversarial BERT, alongside earlier work on ECG classification.
          </p>
          <p className="mt-6 text-muted-foreground">
            Find more of my writing on <a href="/blog/" className="text-accent hover:underline">Writing</a>,
            or reach me through the contact links on the <a href="/" className="text-accent hover:underline">home page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
