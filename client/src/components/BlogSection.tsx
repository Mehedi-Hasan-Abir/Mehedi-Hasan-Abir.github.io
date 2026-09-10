import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { motion } from "framer-motion";
import { useBlogs } from "@/hooks/use-portfolio";
import { ArrowLeft, ArrowRight, ExternalLink, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { useCanAnimate, useInView } from "@/lib/use-anime";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  externalLink: string;
  platform: string;
  date: string;
  tags: string[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export function BlogSection() {
  const { data: blogs, isLoading } = useBlogs();
  const canAnimate = useCanAnimate();
  const { ref: gridRef, inView } = useInView<HTMLDivElement>(0.08);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ index: 0, atStart: true, atEnd: false });

  useEffect(() => {
    if (!canAnimate || !inView || !gridRef.current) return;
    // Replays on every viewport entry (owner preference)
    // Diagonal clip-wipe reveal per card, then content settles upward
    const cards = gridRef.current.querySelectorAll("[data-card]");
    animate(cards, {
      clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
      duration: 850,
      ease: "outExpo",
      delay: stagger(130),
    });
    animate(gridRef.current.querySelectorAll("[data-thumb]"), {
      scale: [1.15, 1],
      duration: 1100,
      ease: "outExpo",
      delay: stagger(130),
    });
  }, [canAnimate, inView, gridRef]);

  if (isLoading) {
    return (
      <section id="blog" className="rule-t py-20 md:py-28 cv-auto">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="mb-12 md:mb-16" data-testid="section-heading">
            <h2 className="display-lg">Writing</h2>
            <p className="mt-3 text-muted-foreground">Loading posts...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-border bg-card animate-pulse">
                <div className="aspect-video bg-secondary" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-secondary rounded w-4/5" />
                  <div className="h-3.5 bg-secondary rounded w-full" />
                  <div className="h-3.5 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Carousel window: up to 6 posts so the track travels on every viewport
  const featuredBlogs = blogs.slice(0, 6);

  const updatePos = () => {
    const el = trackRef.current;
    if (!el || !featuredBlogs.length) return;
    const max = el.scrollWidth - el.clientWidth;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth;
    setPos({
      index: Math.min(featuredBlogs.length - 1, Math.round(el.scrollLeft / step)),
      atStart: el.scrollLeft <= 8,
      atEnd: el.scrollLeft >= max - 8,
    });
  };

  const nudge = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section id="blog" className="rule-t py-20 md:py-28 cv-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading title="Writing" subtitle="Thoughts on AI, Machine Learning, and Technology" />

        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="mono-label text-muted-foreground" aria-live="polite">
            {String(pos.index + 1).padStart(2, "0")} / {String(featuredBlogs.length).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={pos.atStart}
              aria-label="Previous posts"
              className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={pos.atEnd}
              aria-label="Next posts"
              className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={(el) => {
            gridRef.current = el;
            trackRef.current = el;
          }}
          onScroll={updatePos}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured posts"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-5 px-5 md:mx-0 md:px-0"
        >
          {featuredBlogs.map((blog: BlogPost, index: number) => (
            <motion.article
              key={blog.id}
              data-card
              initial={canAnimate ? { clipPath: "inset(0% 100% 0% 0%)" } : false}
              className="group border border-border bg-card hover:border-primary/60 transition-colors flex flex-col cursor-pointer overflow-hidden snap-start shrink-0 w-[82%] sm:w-[47%] lg:w-[31.8%]"
              onClick={() => window.open(blog.externalLink, "_blank", "noopener,noreferrer")}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-secondary overflow-hidden">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    width={blog.thumbnailWidth}
                    height={blog.thumbnailHeight}
                    loading="lazy"
                    decoding="async"
                    data-thumb
                    className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : null}
                {!blog.thumbnail && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="mono-label text-muted-foreground">{blog.platform.toUpperCase()}</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 mono-label text-[10px] bg-background/85 backdrop-blur px-2.5 py-1 border border-border">
                  {blog.platform.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mono-label text-muted-foreground mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold tracking-tight leading-snug group-hover:text-accent transition-colors line-clamp-2" style={{ fontStretch: "106%" }}>
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-2.5 line-clamp-3 leading-relaxed flex-1">
                  {blog.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 mono-label text-[10.5px] text-muted-foreground/80">
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span>+{blog.tags.length - 3} more</span>
                  )}
                </div>

                <a
                  href={blog.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm mt-5 hover:underline underline-offset-4"
                >
                  Read on {blog.platform}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/blog/"
            className="btn-push inline-flex items-center gap-2 px-8 py-3.5 border border-border rounded-full font-semibold text-sm hover:border-foreground transition-colors"
          >
            View All Blog Posts
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
