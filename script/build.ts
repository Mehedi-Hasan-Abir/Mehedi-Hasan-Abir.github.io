import { build as esbuild } from "esbuild";
import { build as viteBuild, loadEnv } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { execFileSync } from "child_process";
import { educationData, portfolioData, researchData } from "../client/src/data/portfolio-data";
import { caseStudies } from "../client/src/data/case-studies";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const clientOutputDirectory = path.resolve("dist/public");
const BLOG_TITLE = "AI/ML Engineering Writing | Mehedi Hasan Abir";
const BLOG_DESCRIPTION = "Articles on LLM systems, inference, search, and practical AI engineering by Mehedi Hasan Abir.";
const BLOG_URL = "https://mhabir.dev/blog/";
const WORKS_TITLE = "Selected AI/ML Work | Mehedi Hasan Abir";
const WORKS_DESCRIPTION = "Explore AI/ML projects by Mehedi Hasan Abir, including search infrastructure, retrieval systems, computer vision, and production engineering.";
const WORKS_URL = "https://mhabir.dev/works/";
const SITE = "https://mhabir.dev";

type StaticPage = "home" | "blog" | "works" | "about" | "research" | "not-found" | `project:${string}`;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]!);

/** Search engines and visitors still get useful content when the app bundle is delayed or fails. */
function staticPageContent(page: StaticPage) {
  const person = portfolioData.personalInfo;
  const link = (href: string, label: string) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
  const projects = portfolioData.projects.map((project) =>
    `<li>${caseStudies.some((study) => study.projectId === project.id)
      ? link(`/projects/${caseStudies.find((study) => study.projectId === project.id)!.slug}/`, project.title)
      : `<strong>${escapeHtml(project.title)}</strong>`} — ${escapeHtml(project.description)}</li>`
  ).join("");
  const posts = portfolioData.blogs.map((post) =>
    `<li>${link(post.externalLink, post.title)} — ${escapeHtml(post.description)}</li>`
  ).join("");
  let title = `${person.name} — ${person.role}`;
  let body = `<p>${escapeHtml(person.bio)}</p><p>${link("/about/", "About")} · ${link("/research/", "Research")} · ${link(person.resumeUrl, "Resume")}</p><h2>Selected Work</h2><ul>${projects}</ul><h2>Writing</h2><ul>${posts}</ul>`;

  if (page === "blog") {
    title = "Writing";
    body = `<p>Technical writing on AI, machine learning, LLM systems, and production engineering.</p><ul>${posts}</ul>`;
  } else if (page === "works") {
    title = "Selected Work";
    body = `<p>AI and machine learning projects, from document intelligence and retrieval to production systems.</p><ul>${projects}</ul>`;
  } else if (page === "about") {
    title = `About ${person.name}`;
    const roles = portfolioData.experiences.slice(0, 3).map((role) => `<li><strong>${escapeHtml(role.title)} at ${escapeHtml(role.company)}</strong> — ${escapeHtml(role.description[0])}</li>`).join("");
    body = `<p>${escapeHtml(person.bio)}</p><p>My work spans retrieval-augmented assistants, document intelligence, search systems, and model inference.</p><h2>Experience</h2><ul>${roles}</ul><h2>Background</h2><p>${escapeHtml(educationData[0].degree)} from ${escapeHtml(educationData[0].institution)}.</p><p>${link("/works/", "Explore work")} · ${link("/research/", "Research and publications")}</p>`;
  } else if (page === "research") {
    title = "Research";
    body = `<p>Academic work on Bengali intent classification and ECG analysis.</p><h2>Published paper</h2><p>${link(researchData[0].link, researchData[0].title)} — 2023 ICCIT / IEEE Xplore. The paper introduces the 30-class BNIntent30 dataset and evaluates GAN-BnBERT.</p><h2>Undergraduate thesis</h2><p>${escapeHtml(researchData[1].title)} — AUST, 2021.</p>`;
  } else if (page.startsWith("project:")) {
    const study = caseStudies.find((item) => item.slug === page.slice("project:".length));
    if (!study) throw new Error(`Missing case study for ${page}`);
    const project = portfolioData.projects.find((item) => item.id === study.projectId)!;
    title = study.title;
    body = `<p>${escapeHtml(study.summary)}</p><h2>The problem</h2><p>${escapeHtml(study.challenge)}</p><h2>How it works</h2>${study.approach.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}<h2>Results and limits</h2><p>${escapeHtml(study.outcome)}</p><p>${escapeHtml(study.caveat)}</p><p>${link(project.link, "View source and evidence")} · ${link("/works/", "All work")}</p>`;
  } else if (page === "not-found") {
    title = "404 Page Not Found";
    body = `<p>That page is unavailable. ${link("/", "Home")} · ${link("/works/", "Selected Work")} · ${link("/about/", "About")}</p>`;
  }

  return `<div id="root"><main id="static-fallback" style="min-height:100vh;background:#111210;color:#e9e9e5;padding:4rem max(1.25rem,calc((100vw - 70rem)/2));font:1rem/1.6 Arial,sans-serif"><nav aria-label="Site pages">${link("/", "Home")} · ${link("/works/", "Work")} · ${link("/blog/", "Writing")} · ${link("/about/", "About")} · ${link("/research/", "Research")}</nav><h1>${escapeHtml(title)}</h1>${body}</main></div>`;
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
  // import.meta.env replacement picks them up (GA + Sentry depend on this).
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
