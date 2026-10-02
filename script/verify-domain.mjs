import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("dist/public");
const site = "https://mhabir.dev";
const oldHost = /mehedi-hasan-abir\.github\.io/i;

/** Every generated page, so a check can cover all of them and not just one URL. */
async function walkHtmlFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await walkHtmlFiles(path.join(directory, entry.name), relative)));
    } else if (entry.name.endsWith(".html")) {
      found.push(relative);
    }
  }
  return found;
}

async function readBuilt(relativePath) {
  const content = await readFile(path.join(output, relativePath), "utf8");
  if (oldHost.test(content)) {
    throw new Error(`${relativePath} still contains the old portfolio domain`);
  }
  return content;
}

const sitemap = await readBuilt("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(https:\/\/mhabir\.dev\/[^<]*)<\/loc>/g)].map((match) => match[1]);
const requiredPages = [
  "/",
  "/blog/",
  "/works/",
  "/about/",
  "/research/",
  "/projects/search-microservice/",
  "/projects/outlet-fraud-detection/",
  "/blog/llm-in-production/",
  "/blog/ai-coding-harness/",
];
if (urls.length !== requiredPages.length || new Set(urls).size !== urls.length) {
  throw new Error(`sitemap.xml must contain ${requiredPages.length} distinct canonical pages`);
}
for (const pathname of requiredPages) {
  if (!urls.includes(`${site}${pathname}`)) throw new Error(`sitemap.xml is missing ${pathname}`);
}

for (const url of urls) {
  const page = new URL(url).pathname.slice(1) + "index.html";
  const html = await readBuilt(page);
  if (!html.includes(`<link rel="canonical" href="${url}"`)) {
    throw new Error(`${page} has no canonical link to ${url}`);
  }
  if (!html.includes(`<meta property="og:url" content="${url}"`)) {
    throw new Error(`${page} has no Open Graph URL for ${url}`);
  }
  // Matches the wrapper tag rather than a specific element: Home's fallback is
  // a div that contains a <main>, while content pages use <main> directly.
  if (!html.includes('id="static-fallback"') || !html.includes("<h1")) {
    throw new Error(`${page} has no readable fallback when JavaScript is unavailable`);
  }
}

const missingPage = await readBuilt("404.html");
if (!missingPage.includes('<meta name="robots" content="noindex"') || !missingPage.includes('href="/works/"')) {
  throw new Error("404.html needs noindex and useful navigation");
}

// Social preview image: JPEG keeps LinkedIn/Facebook/X previews working, which
// a WebP source image silently breaks on older scrapers.
const home = await readBuilt("index.html");
if (!home.includes('<meta property="og:image" content="https://mhabir.dev/images/og-image.jpg"')) {
  throw new Error("index.html must point og:image at the JPEG social card");
}
if (!home.includes('<meta property="og:image:width" content="1200"') || !home.includes('<meta property="og:image:height" content="630"')) {
  throw new Error("og:image must declare its 1200x630 dimensions");
}
if (!home.includes('<meta name="twitter:image" content="https://mhabir.dev/images/og-image.jpg"')) {
  throw new Error("index.html must point twitter:image at the JPEG social card");
}
const socialCard = await readFile(path.join(output, "images", "og-image.jpg"));
if (socialCard[0] !== 0xff || socialCard[1] !== 0xd8) {
  throw new Error("images/og-image.jpg is missing or is not a JPEG");
}

// The article must be readable as static HTML, not only after React mounts.
const article = await readBuilt("blog/llm-in-production/index.html");
if (!article.includes("<h2>The three-layer mental model</h2>")) {
  throw new Error("The article page is missing its crawlable body content");
}
if (!article.includes('"@type":"Article"')) {
  throw new Error("The article page is missing Article structured data");
}

const robots = await readBuilt("robots.txt");
if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) {
  throw new Error("robots.txt points to the wrong sitemap");
}

const cname = await readBuilt("CNAME");
if (cname.trim() !== "mhabir.dev") {
  throw new Error("CNAME must contain only mhabir.dev");
}

// A schema.org property repeated inside one node is invalid. Google reported
// "Duplicate unique property" for https://mhabir.dev/ on 2026-10-02 because
// `alternateName` was declared twice on the Person node. JSON.parse cannot
// catch this, because it silently keeps only the last value for a repeated key,
// so count these keys in the raw text instead. Only properties that are
// single-valued and never appear on a nested node here are listed; `name`,
// `url`, `description` and `@type` are excluded because nesting makes them
// legitimately repeat.
const SINGLE_VALUED_PERSON_KEYS = [
  "alternateName", "givenName", "familyName", "jobTitle",
  "telephone", "email", "honorificPrefix", "honorificSuffix",
];
const jsonLdPattern = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
let structuredDataBlocks = 0;
for (const htmlPath of await walkHtmlFiles(output)) {
  const html = await readBuilt(htmlPath);
  for (const [, block] of html.matchAll(jsonLdPattern)) {
    structuredDataBlocks += 1;
    for (const key of SINGLE_VALUED_PERSON_KEYS) {
      const occurrences = block.split(`"${key}"`).length - 1;
      if (occurrences > 1) {
        throw new Error(
          `${htmlPath} declares "${key}" ${occurrences} times in one ld+json block; ` +
            "Google rejects the whole item as a duplicate unique property",
        );
      }
    }
  }
}

const resume = await readFile(path.join(output, "images/resume.pdf"));
if (resume.subarray(0, 4).toString("ascii") !== "%PDF") {
  throw new Error("The hosted resume is missing or is not a PDF");
}
if (!resume.includes(Buffer.from("mhabir.dev")) || resume.includes(Buffer.from("mehedi-hasan-abir.github.io"))) {
  throw new Error("The hosted CV PDF does not link to mhabir.dev");
}

console.log(
  `Generated pages, sitemap, robots.txt, CNAME, and resume are ready for ${site}. ` +
    `Checked ${structuredDataBlocks} ld+json blocks for duplicate keys.`,
);
