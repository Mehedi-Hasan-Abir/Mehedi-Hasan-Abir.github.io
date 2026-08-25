import { spawnSync } from "child_process";
import { readFile } from "fs/promises";
import path from "path";
import { loadEnv } from "vite";

const siteUrl = "https://mehedi-hasan-abir.github.io/";
const remoteRef = "refs/heads/gh-pages";

function run(command: string, args: string[]): string {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}.`);
  }

  return result.stdout.trim();
}

function getRemoteHash(): string | null {
  const output = run("git", ["ls-remote", "origin", remoteRef]);
  return output.split(/\s+/)[0] || null;
}

async function waitForLiveAsset(assetPath: string, gaId: string): Promise<void> {
  for (let attempt = 1; attempt <= 18; attempt += 1) {
    const cacheBuster = `deploy=${Date.now()}`;
    const response = await fetch(`${siteUrl}?${cacheBuster}`, { cache: "no-store" });
    const html = await response.text();

    if (response.ok && html.includes(assetPath)) {
      const bundleResponse = await fetch(`${siteUrl}${assetPath}?${cacheBuster}`, { cache: "no-store" });
      const bundle = await bundleResponse.text();

      if (bundleResponse.ok && bundle.includes(gaId)) {
        console.log(`live site verified: ${siteUrl}`);
        return;
      }
    }

    console.log(`waiting for GitHub Pages propagation (${attempt}/18)...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error("GitHub Pages did not serve the newly deployed analytics-enabled asset in time.");
}

async function deploy(): Promise<void> {
  const beforeHash = getRemoteHash();
  const indexHtml = await readFile("dist/public/index.html", "utf8");
  const assetMatch = indexHtml.match(/src="\/(assets\/index-[^"]+\.js)"/);
  const environment = {
    ...loadEnv("production", process.cwd(), ""),
    ...process.env,
  };
  const gaId = environment.VITE_GOOGLE_ANALYTICS_ID?.trim();

  if (!assetMatch) throw new Error("Could not locate the built JavaScript asset.");
  if (!gaId) throw new Error("VITE_GOOGLE_ANALYTICS_ID is required for deployment verification.");

  // Node >= 18 refuses to spawn .cmd shims without a shell (EINVAL) - call
  // gh-pages' JS entry with node directly instead of npx.cmd.
  const ghPagesBin = path.resolve("node_modules", "gh-pages", "bin", "gh-pages.js");
  run(process.execPath, [ghPagesBin, "-d", "dist/public", "--branch", "gh-pages"]);

  const afterHash = getRemoteHash();
  if (!afterHash || afterHash === beforeHash) {
    throw new Error("Deployment verification failed: refs/heads/gh-pages did not change.");
  }

  console.log(`gh-pages updated: ${beforeHash ?? "missing"} -> ${afterHash}`);
  await waitForLiveAsset(assetMatch[1], gaId);
}

deploy().catch((error) => {
  console.error(error);
  process.exit(1);
});
