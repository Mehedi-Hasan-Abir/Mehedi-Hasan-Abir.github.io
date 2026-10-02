import { build as esbuild } from "esbuild";
import { build as viteBuild, loadEnv } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { execFileSync } from "child_process";
import { educationData, portfolioData, researchData } from "../client/src/data/portfolio-data";
import { caseStudies } from "../client/src/data/case-studies";
import { articles, type Article, type ArticleBlock } from "../client/src/data/articles";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const clientOutputDirectory = path.resolve("dist/public");
const BLOG_TITLE = "AI/ML Engineering Writing | Mehedi Hasan Abir";
const BLOG_DESCRIPTION = "Articles on LLM systems, inference, search, and practical AI engineering by Mehedi Hasan Abir.";
const BLOG_URL = "https://mhabir.dev/blog/";
const WORKS_TITLE = "Selected AI/ML Work | Mehedi Hasan Abir";
const WORKS_DESCRIPTION = "Explore AI/ML projects by Mehedi Hasan Abir, including search infrastructure, retrieval systems, computer vision, and production engineering.";
const WORKS_URL = "https://mhabir.dev/works/";
const SITE = "https://mhabir.dev";

type StaticPage = "home" | "blog" | "works" | "about" | "research" | "not-found" | `project:${string}` | `article:${string}`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

/**
 * Mirrors the Inline component in ArticleBody.tsx: `code`, **bold**, ~~strike~~
 * and [links](href). Without this the static HTML shipped literal markdown,
 * because escaping alone leaves `**` and `[text](url)` visible to crawlers.
 * Recurses into bold, strike and link labels so nested code spans render.
 */
function inlineMarkdown(value: string): string {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(~~[^~]+~~)|(\[[^\]]+\]\([^)]+\))/g;
  let out = "";
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    out += escapeHtml(value.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      out += `<code>${escapeHtml(token.slice(1, -1))}</code>`;
    } else if (token.startsWith("**")) {
      out += `<strong>${inlineMarkdown(token.slice(2, -2))}</strong>`;
    } else if (token.startsWith("~~")) {
      out += `<del>${inlineMarkdown(token.slice(2, -2))}</del>`;
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)!;
      const external = linkMatch[2].startsWith("http");
      const attrs = external ? ` target="_blank" rel="noopener noreferrer"` : "";
      out += `<a href="${escapeHtml(linkMatch[2])}"${attrs}>${inlineMarkdown(linkMatch[1])}</a>`;
    }
    last = match.index + token.length;
  }
  return out + escapeHtml(value.slice(last));
}

/** Shared by staticPageContent and articleContent, so both can cross-link. */
const link = (href: string, label: string) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

/** Serialise the same block model data/articles.ts uses, so the article stays readable without JS. */
function articleBlocksToHtml(blocks: ArticleBlock[]): string {
  const inline = (value: string) => inlineMarkdown(value);
  return blocks.map((block) => {
    if (block.t === "h2") return `<h2>${escapeHtml(block.text)}</h2>`;
    if (block.t === "h3") return `<h3>${escapeHtml(block.text)}</h3>`;
    if (block.t === "code") return `<pre><code>${escapeHtml(block.text)}</code></pre>`;
    if (block.t === "note") return `<blockquote><p>${inline(block.text)}</p></blockquote>`;
    if (block.t === "ul") return `<ul>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`;
    if (block.t === "ol") return `<ol>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</ol>`;
    return `<p>${inline(block.text)}</p>`;
  }).join("");
}

function articleContent(article: Article) {
  const published = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
  const tags = article.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
  const siblings = articles.filter((item) => item.slug !== article.slug)
    .map((item) => `<li>${link(`/blog/${item.slug}/`, item.title)}</li>`).join("");

  return `<p>${escapeHtml(article.summary)}</p>`
    + `<h2>Tags</h2><ul>${tags}</ul>`
    + `<p>Published ${escapeHtml(published)}.</p>`
    + articleBlocksToHtml(article.blocks)
    + (siblings ? `<h2>More writing</h2><ul>${siblings}</ul>` : "");
}

/**
 * Chrome shared by every generated fallback page.
 *
 * The stylesheet is a render-blocking `<link>` in the same document, so this
 * markup is styled by the real Tailwind build and the design tokens before it
 * paints. That is the whole point: the fallback has to occupy the same geometry
 * as the React tree that replaces it, otherwise visitors see a visible content
 * jump on every load while still getting the no-JS safety net.
 */
const FALLBACK_LINKS = [
  ["/works/", "Work"],
  ["/blog/", "Writing"],
  ["/about/", "About"],
  ["/research/", "Research"],
] as const;

/** Mirrors Navbar.tsx. Only Home renders the real navbar. */
function fallbackNavbar() {
  const items = FALLBACK_LINKS.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  return `<nav class="fixed top-0 left-0 right-0 z-50"><div class="max-w-6xl mx-auto px-5 md:px-8 h-[4.5rem] flex items-center justify-between gap-4">`
    + `<a href="/" class="flex items-center gap-2.5 shrink-0">`
    + `<span class="w-2.5 h-2.5 bg-primary rotate-45" aria-hidden="true"></span>`
    + `<span class="font-extrabold tracking-tight text-lg" style="font-stretch:110%">Mehedi<span class="text-accent"> / </span>Hasan</span>`
    + `</a>`
    + `<nav aria-label="Site pages" class="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">${items}</nav>`
    + `</div></nav>`;
}

/** Mirrors the portrait figure in Home.tsx, including the editorial frame. */
function fallbackPortrait(alt: string) {
  return `<figure class="justify-self-center lg:justify-self-end w-full max-w-[280px] lg:max-w-[360px] mt-4 lg:mt-0">`
    + `<div class="relative">`
    + `<span class="absolute inset-0 translate-x-3 translate-y-3 border border-primary/40" aria-hidden="true"></span>`
    + `<span class="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-primary" aria-hidden="true"></span>`
    + `<span class="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-primary" aria-hidden="true"></span>`
    + `<span class="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-primary" aria-hidden="true"></span>`
    + `<span class="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-primary" aria-hidden="true"></span>`
    + `<picture>`
    + `<source media="(max-width: 640px)" srcset="/images/profile_re-640.avif" type="image/avif">`
    + `<source srcset="/images/profile_re.avif" type="image/avif">`
    + `<img src="/images/profile_re.webp" alt="${escapeHtml(alt)}" width="800" height="800" fetchpriority="high" decoding="async" class="relative w-full aspect-square object-cover grayscale contrast-[1.04]">`
    + `</picture></div>`
    + `<figcaption class="mono-label text-muted-foreground mt-4 flex justify-between"><span>DHAKA &middot; UTC+6</span><span>EST. 2021</span></figcaption>`
    + `</figure>`;
}

/** Search engines and visitors still get useful content when the app bundle is delayed or fails. */
function staticPageContent(page: StaticPage) {
  const person = portfolioData.personalInfo;
  const projects = portfolioData.projects.map((project) =>
    `<li>${caseStudies.some((study) => study.projectId === project.id)
      ? link(`/projects/${caseStudies.find((study) => study.projectId === project.id)!.slug}/`, project.title)
      : `<strong>${escapeHtml(project.title)}</strong>`} — ${escapeHtml(project.description)}</li>`
  ).join("");
  const posts = portfolioData.blogs.map((post) => {
    const article = articles.find((item) => item.blogId === post.id);
    // Prefer the on-site copy when one exists so crawlers can reach the text
    // itself rather than only the cross-post.
    const href = article ? `/blog/${article.slug}/` : post.externalLink;
    return `<li>${link(href, post.title)} — ${escapeHtml(post.description)}</li>`;
  }).join("");

  if (page === "home") {
    // Mirrors the Home hero so the swap to the animated app is not visible.
    return `<div id="root"><div id="static-fallback" class="min-h-screen bg-background text-foreground">`
      + fallbackNavbar()
      + `<main class="max-w-6xl mx-auto px-5 md:px-8">`
      + `<section class="relative min-h-[92dvh] flex items-center pt-28 pb-16">`
      + `<div class="w-full grid lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-12 items-center">`
      + `<div>`
      + `<p class="mono-label inline-flex items-center gap-2.5 !text-[13px] md:!text-sm font-semibold text-accent border border-primary/50 bg-primary/10 rounded-full px-5 py-2.5 mb-6 tracking-wide">`
      + `<span class="w-2 h-2 rounded-full bg-accent" aria-hidden="true"></span>AI/ML ENGINEER &middot; DHAKA, BANGLADESH</p>`
      // The two display lines are separate blocks, so they need a literal
      // space between them or the accessible name reads "MehediHasan Abir".
      + `<h1 class="font-extrabold tracking-tight py-1" style="font-size:clamp(3rem,7.5vw,5.6rem);line-height:1">Mehedi <span class="block">Hasan<span class="sr-only"> Abir</span></span></h1>`
      + `<p class="mt-6 min-h-[2.2rem] font-mono text-sm md:text-base text-muted-foreground"><span class="text-accent" aria-hidden="true">&gt;&nbsp;</span>Turning complex documents into useful data<span class="text-accent" aria-hidden="true">_</span></p>`
      + `<p class="mt-5 text-muted-foreground text-base md:text-lg max-w-[58ch] leading-relaxed">${escapeHtml(person.bio)}</p>`
      + `<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-accent">`
      + `<a href="/about/" class="hover:underline underline-offset-4">About</a>`
      + `<a href="/research/" class="hover:underline underline-offset-4">Research</a></div>`
      + `<div class="flex flex-wrap gap-3 mt-9">`
      + `<a href="/works/" class="btn-push relative inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm">View my work</a>`
      + `<a href="${escapeHtml(person.resumeUrl)}" class="btn-push inline-flex items-center gap-2 px-7 py-3.5 border border-border rounded-full font-semibold text-sm">Resume</a>`
      + `</div>`
      + `<div class="flex items-center gap-1 mt-8">`
      + [[person.github, "GitHub"], [person.linkedin, "LinkedIn"], [person.medium, "Medium"]]
        .map(([href, label]) => `<a href="${escapeHtml(href ?? "#")}" aria-label="${escapeHtml(label)}" class="p-2.5 rounded-md text-muted-foreground"><span class="block w-[18px] h-[18px] rounded-full bg-current" aria-hidden="true"></span></a>`)
        .join("")
      + `<a href="mailto:${escapeHtml(person.email)}" aria-label="Email" class="p-2.5 rounded-md text-muted-foreground"><span class="block w-[18px] h-[18px] rounded-sm border-2 border-current" aria-hidden="true"></span></a>`
      + `</div>`
      + `</div>`
      + fallbackPortrait(person.name)
      + `</div></section></main>`
      + `<div class="rule-t py-8"><div class="max-w-6xl mx-auto px-5 md:px-8">`
      + `<h2 class="sr-only">${escapeHtml(person.name)} — ${escapeHtml(person.role)}</h2>`
      + `<h2 class="text-2xl font-extrabold mb-4">Selected Work</h2><ul class="space-y-2 text-muted-foreground">${projects}</ul>`
      + `<h2 class="text-2xl font-extrabold mt-10 mb-4">Writing</h2><ul class="space-y-2 text-muted-foreground">${posts}</ul>`
      + `</div></div>`
      + `</div></div>`;
  }

  let title = `${person.name} — ${person.role}`;
  let kicker = "PORTFOLIO";
  let body = `<p>${escapeHtml(person.bio)}</p><p>${link("/about/", "About")} &middot; ${link("/research/", "Research")} &middot; ${link(person.resumeUrl, "Resume")}</p><h2 class="text-2xl font-extrabold mt-10 mb-4">Selected Work</h2><ul class="space-y-2">${projects}</ul><h2 class="text-2xl font-extrabold mt-10 mb-4">Writing</h2><ul class="space-y-2">${posts}</ul>`;

  if (page === "blog") {
    title = "Blog";
    kicker = "WRITING";
    body = `<p>Sharing insights on AI, Machine Learning, and Technology. Explore my thoughts on the latest developments and practical applications.</p><ul class="space-y-3 mt-8">${posts}</ul>`;
  } else if (page === "works") {
    title = "Selected Work";
    kicker = "PORTFOLIO";
    body = `<p>AI and machine learning projects, from document intelligence and retrieval to production systems.</p><ul class="space-y-3 mt-8">${projects}</ul>`;
  } else if (page === "about") {
    title = `About ${person.name}`;
    kicker = "DHAKA &middot; AI / ML ENGINEERING";
    const roles = portfolioData.experiences.slice(0, 3).map((role) => `<li class="border-l-2 border-primary/50 pl-5"><strong>${escapeHtml(role.title)} at ${escapeHtml(role.company)}</strong> — ${escapeHtml(role.description[0])}</li>`).join("");
    body = `<p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">${escapeHtml(person.bio)}</p>`
      + `<p class="mt-7 text-muted-foreground leading-relaxed">My work spans retrieval-augmented assistants, document intelligence, search systems, and model inference. I work across the path from data and evaluation to APIs, deployment, and monitoring.</p>`
      + `<h2 class="text-2xl font-extrabold mt-16 mb-4">Experience</h2><ul class="space-y-7">${roles}</ul>`
      + `<h2 class="text-2xl font-extrabold mt-16 mb-4">Background</h2>`
      + `<p class="text-muted-foreground leading-relaxed">${escapeHtml(educationData[0].degree)} from ${escapeHtml(educationData[0].institution)}. My published research includes Bengali intent classification with generative adversarial BERT, alongside earlier work on ECG classification.</p>`
      + `<p class="mt-6 text-muted-foreground">${link("/works/", "Explore work")} &middot; ${link("/research/", "Research and publications")}</p>`;
  } else if (page === "research") {
    title = "Research";
    kicker = "PUBLICATIONS & ACADEMIC WORK";
    body = `<p class="text-lg text-muted-foreground leading-relaxed max-w-[64ch]">My research has focused on language understanding for Bengali and deep learning for ECG analysis.</p>`
      + `<h2 class="text-2xl font-extrabold mt-16 mb-4">Published paper</h2>`
      + `<p class="mono-label text-accent">2023 &middot; ICCIT &middot; IEEE Xplore</p>`
      + `<p class="text-muted-foreground mt-4 leading-relaxed">${link(researchData[0].link, researchData[0].title)} — co-authored with Mohammad Jahid Ibna Basher and Md. Tanvir Rouf Shawon. The work introduces BNIntent30, a Bengali intent-classification dataset with 30 classes, and evaluates GAN-BnBERT against other classification approaches on that dataset.</p>`
      + `<h2 class="text-2xl font-extrabold mt-16 mb-4">Undergraduate thesis</h2>`
      + `<p class="mono-label text-accent">2021 &middot; AUST</p>`
      + `<p class="text-muted-foreground mt-4 leading-relaxed">${escapeHtml(researchData[1].title)} — classifying arrhythmia from ECG beats using a two-dimensional convolutional neural network and signal preprocessing.</p>`;
  } else if (page.startsWith("project:")) {
    const study = caseStudies.find((item) => item.slug === page.slice("project:".length));
    if (!study) throw new Error(`Missing case study for ${page}`);
    const project = portfolioData.projects.find((item) => item.id === study.projectId)!;
    title = study.title;
    kicker = "PROJECT CASE STUDY";
    body = `<p class="text-lg md:text-xl text-muted-foreground leading-relaxed">${escapeHtml(study.summary)}</p>`
      + `<h2 class="text-2xl font-extrabold mt-16 mb-4">The problem</h2><p class="text-muted-foreground leading-relaxed">${escapeHtml(study.challenge)}</p>`
      + `<h2 class="text-2xl font-extrabold mt-12 mb-4">How it works</h2>${study.approach.map((paragraph) => `<p class="mt-4 text-muted-foreground leading-relaxed">${escapeHtml(paragraph)}</p>`).join("")}`
      + `<h2 class="text-2xl font-extrabold mt-12 mb-4">Results and limits</h2><p class="text-muted-foreground leading-relaxed">${escapeHtml(study.outcome)}</p>`
      + `<p class="mt-4 text-muted-foreground leading-relaxed">${escapeHtml(study.caveat)}</p>`
      + `<p class="mt-8">${link(project.link, "View source and evidence")} &middot; ${link("/works/", "All work")}</p>`;
  } else if (page === "not-found") {
    title = "404 Page Not Found";
    kicker = "NOT FOUND";
    body = `<p class="text-muted-foreground">That page is unavailable. You can continue with the portfolio or browse the projects.</p>`
      + `<nav aria-label="Useful pages" class="mt-6 flex gap-5 text-sm font-semibold text-accent">${link("/", "Home")}${link("/works/", "Selected Work")}${link("/about/", "About")}</nav>`;
  } else if (page.startsWith("article:")) {
    const article = articles.find((item) => item.slug === page.slice("article:".length));
    if (!article) throw new Error(`Missing article for ${page}`);
    title = article.title;
    kicker = "ARTICLE";
    body = articleContent(article);
  }

  // Content pages have no navbar in the React app either, so the fallback
  // mirrors their breadcrumb + display heading layout instead.
  return `<div id="root"><main id="static-fallback" class="min-h-screen bg-background text-foreground">`
    + `<div class="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">`
    + `<nav aria-label="Breadcrumb" class="mono-label text-muted-foreground mb-10"><a href="/">Home</a> / ${escapeHtml(title)}</nav>`
    + `<p class="mono-label text-accent mb-4">${kicker}</p>`
    + `<h1 class="display-lg max-w-[26ch]">${escapeHtml(title)}</h1>`
    + `<div class="mt-7">${body}</div>`
    + `</div></main></div>`;
}

function withStaticContent(html: string, page: StaticPage) {
  return replaceRequired(html, /<div id="root"><\/div>/, staticPageContent(page), `${page} static content`);
}

function replaceRequired(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) {
    throw new Error(`Could not update ${label} in the generated HTML.`);
  }

  return html.replace(pattern, replacement);
}

function createBlogHtml(homeHtml: string) {
  let blogHtml = replaceRequired(
    homeHtml,
    /<title>.*?<\/title>/,
    `<title>${BLOG_TITLE}</title>`,
    "blog title",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${BLOG_DESCRIPTION}" />`,
    "blog description",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${BLOG_TITLE}" />`,
    "blog Open Graph title",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${BLOG_DESCRIPTION}" />`,
    "blog Open Graph description",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${BLOG_URL}" />`,
    "blog Open Graph URL",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${BLOG_TITLE}" />`,
    "blog Twitter title",
  );
  blogHtml = replaceRequired(
    blogHtml,
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${BLOG_DESCRIPTION}" />`,
    "blog Twitter description",
  );
  return replaceRequired(
    blogHtml,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${BLOG_URL}" />`,
    "blog canonical URL",
  );
}

async function createStaticRouteFallbacks() {
  const indexPath = path.join(clientOutputDirectory, "index.html");
  const homeHtml = await readFile(indexPath, "utf8");
  const withMeta = (title: string, description: string, url: string, label: string) => {
    let html = replaceRequired(homeHtml, /<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`, `${label} title`);
    html = replaceRequired(
      html,
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      `${label} description`,
    );
    html = replaceRequired(
      html,
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `${label} Open Graph title`,
    );
    html = replaceRequired(
      html,
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `${label} Open Graph description`,
    );
    html = replaceRequired(
      html,
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${url}" />`,
      `${label} Open Graph URL`,
    );
    html = replaceRequired(
      html,
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `${label} Twitter title`,
    );
    html = replaceRequired(
      html,
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      `${label} Twitter description`,
    );
    return replaceRequired(
      html,
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${url}" />`,
      `${label} canonical URL`,
    );
  };
  const addSchema = (html: string, schema: object) => html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`,
  );
  const routes: Array<{ file: string; page: StaticPage; html: string }> = [
    { file: "index.html", page: "home", html: homeHtml },
    { file: "blog/index.html", page: "blog", html: createBlogHtml(homeHtml) },
    { file: "works/index.html", page: "works", html: withMeta(WORKS_TITLE, WORKS_DESCRIPTION, WORKS_URL, "works") },
    {
      file: "about/index.html",
      page: "about",
      html: addSchema(
        withMeta("About Mehedi Hasan Abir | AI/ML Engineer", `Learn about Mehedi Hasan Abir's AI/ML engineering work, experience, education, and research.`, `${SITE}/about/`, "about"),
        { "@context": "https://schema.org", "@type": "ProfilePage", "mainEntity": { "@id": `${SITE}/#person` } },
      ),
    },
    {
      file: "research/index.html",
      page: "research",
      html: withMeta("Research and Publications | Mehedi Hasan Abir", "Bengali intent classification research, an IEEE publication, and earlier ECG analysis work by Mehedi Hasan Abir.", `${SITE}/research/`, "research"),
    },
  ];

  for (const study of caseStudies) {
    const url = `${SITE}/projects/${study.slug}/`;
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Work", "item": `${SITE}/works/` },
        { "@type": "ListItem", "position": 3, "name": study.title, "item": url },
      ],
    };
    routes.push({
      file: `projects/${study.slug}/index.html`,
      page: `project:${study.slug}`,
      html: addSchema(withMeta(`${study.title} | Mehedi Hasan Abir`, study.summary, url, study.slug), breadcrumb),
    });
  }

  for (const article of articles) {
    const url = `${SITE}/blog/${article.slug}/`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.summary,
      datePublished: article.date,
      dateModified: article.updated ?? article.date,
      inLanguage: "en",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@id": `${SITE}/#person` },
      publisher: { "@id": `${SITE}/#person` },
      image: `${SITE}/images/og-image.jpg`,
      keywords: article.tags.join(", "),
    };
    routes.push({
      file: `blog/${article.slug}/index.html`,
      page: `article:${article.slug}`,
      html: addSchema(
        withMeta(`${article.title} | Mehedi Hasan Abir`, article.summary, url, article.slug),
        schema,
      ),
    });
  }

  const notFoundHtml = replaceRequired(
    replaceRequired(
      replaceRequired(homeHtml, /<title>.*?<\/title>/, "<title>Page Not Found | Mehedi Hasan Abir</title>", "404 title"),
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      "",
      "404 canonical",
    ),
    /<\/head>/,
    '<meta name="robots" content="noindex" /></head>',
    "404 noindex",
  );
  routes.push({ file: "404.html", page: "not-found", html: notFoundHtml });

  await Promise.all(routes.map(async ({ file, page, html }) => {
    const destination = path.join(clientOutputDirectory, file);
    await mkdir(path.dirname(destination), { recursive: true });
    // Every route starts from the home template, but only home renders the portrait.
    const pageHtml = page === "home" ? html : html.replace(
      /<link rel="preload" as="image" href="\/images\/profile_re(?:-640)?\.avif"[^>]*>\s*/g,
      "",
    );
    await writeFile(destination, withStaticContent(pageHtml, page));
  }));

  return homeHtml;
}

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  const loadedEnv = loadEnv("production", process.cwd(), "");
  const environment = { ...loadedEnv, ...process.env };
  const gaId = environment.VITE_GOOGLE_ANALYTICS_ID?.trim() ?? "";

  // Vite resolves .env from its own root (client/), but our .env lives in the
  // repo root. Bridge VITE_* vars into process.env so the client build's
  // import.meta.env replacement picks them up (Google Analytics needs this).
  for (const [key, value] of Object.entries(loadedEnv)) {
    if (key.startsWith("VITE_") && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  if (!GA_ID_PATTERN.test(gaId)) {
    throw new Error(
      "VITE_GOOGLE_ANALYTICS_ID is required for production builds. Configure it in .env.local before building.",
    );
  }

  if (!process.env.VITE_APP_VERSION) {
    try {
      process.env.VITE_APP_VERSION = execFileSync(
        "git",
        ["rev-parse", "--short", "HEAD"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
    } catch {
      process.env.VITE_APP_VERSION = "local";
    }
  }

  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();
  const indexHtml = await createStaticRouteFallbacks();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  const mainBundleMatch = indexHtml.match(/src="\/(assets\/index-[^"]+\.js)"/);

  if (!mainBundleMatch) {
    throw new Error("Could not locate the production JavaScript bundle in dist/public/index.html.");
  }

  const mainBundle = await readFile(
    path.join(clientOutputDirectory, mainBundleMatch[1]),
    "utf8",
  );

  if (!mainBundle.includes(gaId)) {
    throw new Error("Production build validation failed: the Google Analytics ID is missing from the bundle.");
  }

  if (mainBundle.includes("gtag/js?id=\"") || mainBundle.includes("gtag('config', '')")) {
    throw new Error("Production build validation failed: an empty Google Analytics ID was emitted.");
  }

  console.log("validated client analytics configuration");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
