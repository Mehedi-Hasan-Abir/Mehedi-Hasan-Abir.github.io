import { motion } from "framer-motion";
import { useBlogs } from "@/hooks/use-portfolio";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  externalLink: string;
  platform: string;
  date: string;
  tags: string[];
}

export function BlogSection() {
  const { data: blogs, isLoading } = useBlogs();

  if (isLoading) {
    return (
      <section id="blog" className="py-24 md:py-32 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Blog</h2>
            <p className="text-lg text-muted-foreground">Loading blog posts...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border/50 animate-pulse">
                <div className="h-48 bg-secondary rounded-lg mb-4"></div>
                <div className="h-6 bg-secondary rounded mb-2"></div>
                <div className="h-4 bg-secondary rounded mb-4"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-secondary rounded-full w-16"></div>
                  ))}
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

  // Get first 3 blog posts for the homepage section
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <section id="blog" className="py-24 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Blog
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Thoughts on AI, Machine Learning, and Technology
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog: BlogPost, index: number) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
            >
              {/* Blog Thumbnail */}
              <div className="relative overflow-hidden aspect-video bg-secondary">
                {blog.thumbnail ? (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback for missing images - show gradient placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.classList.add('bg-gradient-to-br', 'from-primary/20', 'to-secondary');
                    }}
                  />
                ) : null}
                {/* Always show fallback gradient if image fails or is missing */}
                {!blog.thumbnail && (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/50">Blog</span>
                  </div>
                )}
                {/* Platform badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {blog.platform}
                  </Badge>
                </div>
                {/* Platform overlay gradient for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>{blog.platform}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {blog.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Read More Button */}
                <a
                  href={blog.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  Read on {blog.platform}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="/blog/"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-lg shadow-primary/25 inline-flex items-center gap-2 mx-auto"
          >
            View All Blog Posts <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
