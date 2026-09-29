import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articleBySlug, articles } from "@/data/articles";
import { ArticleBody } from "@/components/ArticleBody";
import NotFound from "@/pages/not-found";

export default function ArticlePage() {
  const slug = typeof window !== "undefined"
    ? window.location.pathname.replace(/^\/blog\//, "").replace(/\/$/, "")
    : "";
  const article = articleBySlug(slug);
  if (!article) return <NotFound />;

  const others = articles.filter((item) => item.slug !== article.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mono-label text-muted-foreground mb-10">
          <a href="/" className="hover:text-accent">Home</a> /{" "}
          <a href="/blog/" className="hover:text-accent">Writing</a> / Article
        </nav>

        <p className="mono-label text-accent mb-4">
          {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}ARTICLE
        </p>
        <h1 className="display-lg max-w-[24ch]">{article.title}</h1>
        <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">
          {article.summary}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {article.tags.map((tag) => <span key={tag} className="tech-chip">{tag}</span>)}
        </div>

        <div className="rule-t mt-12 pt-9">
          <ArticleBody blocks={article.blocks} />
        </div>

        <div className="rule-t mt-14 pt-8 flex flex-wrap gap-5 items-center">
          <a href="/blog/" className="inline-flex items-center gap-2 text-accent font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> All writing
          </a>
          {article.externalLink && (
            <a
              href={article.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent inline-flex items-center gap-1.5"
            >
              Also on {article.externalPlatform} <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {others.length > 0 && (
          <aside className="rule-t mt-12 pt-8" aria-label="More writing">
            <h2 className="text-xl font-bold mb-4">More writing</h2>
            {others.map((item) => (
              <a key={item.slug} href={`/blog/${item.slug}/`} className="block mt-3 text-accent hover:underline">
                {item.title}
              </a>
            ))}
          </aside>
        )}
      </div>
    </main>
  );
}
