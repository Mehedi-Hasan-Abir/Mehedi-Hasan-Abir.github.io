import { HazariCta } from "@/components/HazariCta";
import { hubArticles } from "@/data/articles";
import { HAZARI_HUB, HAZARI_TOPICS } from "@/data/hazari-hub";

/** Hub for every Hazari article, grouped by topic. */
export default function HazariHubPage() {
  const all = hubArticles("hazari");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mono-label text-muted-foreground mb-10">
          <a href="/" className="hover:text-accent">Home</a> / Hazari
        </nav>
        <p className="mono-label text-accent mb-4">CARD GAME GUIDES</p>
        <h1 className="display-lg max-w-[22ch]">{HAZARI_HUB.heading}</h1>
        <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">
          {HAZARI_HUB.intro}
        </p>

        <HazariCta />

        {HAZARI_TOPICS.map((topic) => {
          const items = all.filter((article) => article.topic === topic);
          if (items.length === 0) return null;
          return (
            <section key={topic} className="rule-t mt-14 pt-9" aria-labelledby={`topic-${topic}`}>
              <h2 id={`topic-${topic}`} className="text-2xl font-extrabold">{topic}</h2>
              <ul className="mt-5 space-y-5">
                {items.map((article) => (
                  <li key={article.slug}>
                    <a href={`/blog/${article.slug}/`} className="text-accent font-semibold hover:underline">
                      {article.title}
                    </a>
                    <p className="mt-1 text-muted-foreground leading-relaxed max-w-[65ch]">{article.summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <div className="rule-t mt-14 pt-8 flex flex-wrap gap-5 items-center">
          <a href="/blog/" className="text-accent font-semibold hover:underline">All writing</a>
          <a href="/projects/hazari-card-game-scoring/" className="text-muted-foreground hover:text-accent">
            Hazari scorekeeper case study
          </a>
        </div>
      </div>
    </main>
  );
}
