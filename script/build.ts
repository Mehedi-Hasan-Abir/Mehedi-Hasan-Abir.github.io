import { build as esbuild } from "esbuild";
import { build as viteBuild, loadEnv } from "vite";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { execFileSync } from "child_process";

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const clientOutputDirectory = path.resolve("dist/public");
const BLOG_TITLE = "AI/ML Engineering Blog — Mehedi Hasan";
const BLOG_DESCRIPTION = "Insights on AI, machine learning, LLM systems, and practical production engineering from Mehedi Hasan.";
const BLOG_URL = "https://mehedi-hasan-abir.github.io/blog/";

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
  const blogDirectory = path.join(clientOutputDirectory, "blog");

  await mkdir(blogDirectory, { recursive: true });
  await Promise.all([
    writeFile(path.join(blogDirectory, "index.html"), createBlogHtml(homeHtml)),
    writeFile(path.join(clientOutputDirectory, "404.html"), homeHtml),
  ]);

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
        { encoding: "utf8" },
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

  console.log(`validated client analytics configuration (${gaId})`);
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
