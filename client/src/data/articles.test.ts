import { articles, hubArticles } from "./articles";
import { HAZARI_TOPICS } from "./hazari-hub";
import type { ArticleBlock } from "./articles";

const textOf = (block: ArticleBlock): string =>
  block.t === "ul" || block.t === "ol" ? block.items.join(" ") : block.text;
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
const bodyText = (blocks: ArticleBlock[]) => blocks.map(textOf).join(" ");
const internalLinks = (blocks: ArticleBlock[]) =>
  [...bodyText(blocks).matchAll(/\]\(\/blog\/([a-z0-9-]+)\/\)/g)].map((match) => match[1]);

describe("articles", () => {
  it("have unique slugs and titles, so no two pages compete for the same search", () => {
    const slugs = articles.map((article) => article.slug);
    const titles = articles.map((article) => article.title.toLowerCase());
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("use lowercase hyphenated slugs and real dates", () => {
    const bad = articles.filter(
      (article) =>
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || Number.isNaN(Date.parse(article.date)),
    );
    expect(bad.map((article) => article.slug)).toEqual([]);
  });

  it("have no placeholder text", () => {
    const bad = articles.filter((article) =>
      /TODO|lorem ipsum|TBD|FIXME/i.test(bodyText(article.blocks)),
    );
    expect(bad.map((article) => article.slug)).toEqual([]);
  });
});

describe("Hazari hub articles", () => {
  const hub = hubArticles("hazari");

  it("form a real set, not a handful", () => {
    expect(hub.length).toBeGreaterThanOrEqual(20);
  });

  it("each belong to a known topic", () => {
    const bad = hub.filter((article) => !(HAZARI_TOPICS as readonly string[]).includes(article.topic ?? ""));
    expect(bad.map((article) => article.slug)).toEqual([]);
  });

  it("have a summary short enough to be a search description", () => {
    const bad = hub.filter((article) => article.summary.length < 80 || article.summary.length > 175);
    expect(bad.map((article) => `${article.slug} (${article.summary.length})`)).toEqual([]);
  });

  it("are long enough to be useful on their own", () => {
    const bad = hub.filter((article) => words(bodyText(article.blocks)) < 280);
    expect(bad.map((article) => `${article.slug} (${words(bodyText(article.blocks))} words)`)).toEqual([]);
  });

  it("have a distinct opening, so no two pages start with the same text", () => {
    const openings = hub.map((article) => bodyText(article.blocks).slice(0, 120));
    expect(new Set(openings).size).toBe(openings.length);
  });

  it("only link to pages that exist", () => {
    const known = new Set(articles.map((article) => article.slug));
    const broken = hub.flatMap((article) =>
      internalLinks(article.blocks)
        .filter((slug) => !known.has(slug))
        .map((slug) => `${article.slug} -> ${slug}`),
    );
    expect(broken).toEqual([]);
  });

  it("each link to at least two other hub articles, so readers can keep going", () => {
    const hubSlugs = new Set(hub.map((article) => article.slug));
    const thin = hub.filter(
      (article) =>
        new Set(internalLinks(article.blocks).filter((slug) => hubSlugs.has(slug) && slug !== article.slug))
          .size < 2,
    );
    expect(thin.map((article) => article.slug)).toEqual([]);
  });

  it("are each linked from at least one other hub article, so none is an orphan", () => {
    const linked = new Set(hub.flatMap((article) => internalLinks(article.blocks)));
    const orphans = hub.filter((article) => !linked.has(article.slug));
    expect(orphans.map((article) => article.slug)).toEqual([]);
  });
});
