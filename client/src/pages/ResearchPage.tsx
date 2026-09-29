import { ArrowUpRight } from "lucide-react";
import { researchData } from "@/data/portfolio-data";

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mono-label text-muted-foreground mb-10">
          <a href="/" className="hover:text-accent">Home</a> / Research
        </nav>
        <p className="mono-label text-accent mb-4">PUBLICATIONS & ACADEMIC WORK</p>
        <h1 className="display-lg">Research</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[64ch]">
          My research has focused on language understanding for Bengali and deep learning
          for ECG analysis. This page links to the published paper and identifies the
          undergraduate thesis separately.
        </p>

        <section className="rule-t mt-16 pt-10" aria-labelledby="publication-heading">
          <h2 id="publication-heading" className="text-2xl font-extrabold">Published paper</h2>
          <article className="mt-7 border border-border bg-card p-6 md:p-8">
            <p className="mono-label text-accent">2023 · ICCIT · IEEE Xplore</p>
            <h3 className="text-xl md:text-2xl font-bold mt-3">{researchData[0].title}</h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Co-authored with Mohammad Jahid Ibna Basher and Md. Tanvir Rouf Shawon.
              The work introduces BNIntent30, a Bengali intent-classification dataset
              with 30 classes, and evaluates GAN-BnBERT against other classification
              approaches on that dataset.
            </p>
            <a href={researchData[0].link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-semibold mt-6 hover:underline">
              Read the paper on IEEE Xplore <ArrowUpRight className="w-4 h-4" />
            </a>
          </article>
        </section>

        <section className="rule-t mt-16 pt-10" aria-labelledby="thesis-heading">
          <h2 id="thesis-heading" className="text-2xl font-extrabold">Undergraduate thesis</h2>
          <article className="mt-7 border border-border bg-card p-6 md:p-8">
            <p className="mono-label text-accent">2021 · AUST</p>
            <h3 className="text-xl md:text-2xl font-bold mt-3">{researchData[1].title}</h3>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Undergraduate work on classifying arrhythmia from ECG beats using a
              two-dimensional convolutional neural network and signal preprocessing.
              The related public code is listed in <a href="/works/" className="text-accent hover:underline">Selected Work</a>.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
