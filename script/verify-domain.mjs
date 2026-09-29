import { readFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("dist/public");
const site = "https://mhabir.dev";
const oldHost = /mehedi-hasan-abir\.github\.io/i;

async function readBuilt(relativePath) {
  const content = await readFile(path.join(output, relativePath), "utf8");
  if (oldHost.test(content)) {
    throw new Error(`${relativePath} still contains the old portfolio domain`);
  }
  return content;
}

const sitemap = await readBuilt("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(https:\/\/mhabir\.dev\/[^<]*)<\/loc>/g)].map((match) => match[1]);
if (urls.length !== 7 || new Set(urls).size !== urls.length) {
  throw new Error("sitemap.xml must contain seven distinct canonical pages");
}
for (const pathname of ["/", "/blog/", "/works/", "/about/", "/research/", "/projects/search-microservice/", "/projects/outlet-fraud-detection/"]) {
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
  if (!html.includes('<main id="static-fallback"') || !html.includes("<h1>")) {
    throw new Error(`${page} has no readable fallback when JavaScript is unavailable`);
  }
}

const missingPage = await readBuilt("404.html");
if (!missingPage.includes('<meta name="robots" content="noindex"') || !missingPage.includes('href="/works/"')) {
  throw new Error("404.html needs noindex and useful navigation");
}

const robots = await readBuilt("robots.txt");
if (!robots.includes(`Sitemap: ${site}/sitemap.xml`)) {
  throw new Error("robots.txt points to the wrong sitemap");
}

const cname = await readBuilt("CNAME");
if (cname.trim() !== "mhabir.dev") {
  throw new Error("CNAME must contain only mhabir.dev");
}

const resume = await readFile(path.join(output, "images/resume.pdf"));
if (resume.subarray(0, 4).toString("ascii") !== "%PDF") {
  throw new Error("The hosted resume is missing or is not a PDF");
}
if (!resume.includes(Buffer.from("mhabir.dev")) || resume.includes(Buffer.from("mehedi-hasan-abir.github.io"))) {
  throw new Error("The hosted CV PDF does not link to mhabir.dev");
}

console.log("Generated pages, sitemap, robots.txt, CNAME, and resume are ready for mhabir.dev");
