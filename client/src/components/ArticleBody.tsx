import type { ArticleBlock } from "@/data/articles";

/**
 * Renders the small block model used by data/articles.ts.
 *
 * Inline markdown is limited to what the articles actually use: `code`,
 * **bold**, ~~strike~~ and [links](href). Rendering it here instead of adding
 * a markdown dependency keeps the article payload inside the existing bundle.
 *
 * Parsing recurses into bold, strike and link labels so that a code span
 * nested inside them, such as **`SESSION.md`**, becomes a real <code> element
 * instead of showing literal backticks.
 */
function parseInline(text: string, nodes: React.ReactNode[], key: { n: number }) {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(~~[^~]+~~)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code key={key.n++} className="mono-label bg-secondary px-1.5 py-0.5 rounded text-foreground">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      const inner: React.ReactNode[] = [];
      parseInline(token.slice(2, -2), inner, key);
      nodes.push(<strong key={key.n++}>{inner}</strong>);
    } else if (token.startsWith("~~")) {
      const inner: React.ReactNode[] = [];
      parseInline(token.slice(2, -2), inner, key);
      nodes.push(<del key={key.n++} className="opacity-60">{inner}</del>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)!;
      const external = linkMatch[2].startsWith("http");
      const label: React.ReactNode[] = [];
      parseInline(linkMatch[1], label, key);
      nodes.push(
        <a
          key={key.n++}
          href={linkMatch[2]}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-accent hover:underline underline-offset-4"
        >
          {label}
        </a>,
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
}

function Inline({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  parseInline(text, nodes, { n: 0 });
  return <>{nodes}</>;
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="max-w-[68ch]">
      {blocks.map((block, index) => {
        const key = `${block.t}-${index}`;
        if (block.t === "h2") {
          return <h2 key={key} className="text-2xl font-extrabold mt-14 mb-4">{block.text}</h2>;
        }
        if (block.t === "h3") {
          return <h3 key={key} className="text-lg font-bold mt-9 mb-3">{block.text}</h3>;
        }
        if (block.t === "code") {
          return (
            <pre
              key={key}
              className="mono-label overflow-x-auto border border-border bg-card p-5 rounded-lg my-6 text-foreground/90 leading-relaxed"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.t === "note") {
          return (
            <p key={key} className="border-l-2 border-primary/60 bg-primary/5 px-5 py-4 my-7 text-muted-foreground leading-relaxed">
              <Inline text={block.text} />
            </p>
          );
        }
        if (block.t === "ul") {
          return (
            <ul key={key} className="list-disc pl-6 my-5 space-y-2.5 text-muted-foreground leading-relaxed marker:text-primary">
              {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
            </ul>
          );
        }
        if (block.t === "ol") {
          return (
            <ol key={key} className="list-decimal pl-6 my-5 space-y-2.5 text-muted-foreground leading-relaxed marker:text-primary marker:font-semibold">
              {block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}
            </ol>
          );
        }
        return (
          <p key={key} className="my-5 text-muted-foreground leading-relaxed text-[15px] md:text-base">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
