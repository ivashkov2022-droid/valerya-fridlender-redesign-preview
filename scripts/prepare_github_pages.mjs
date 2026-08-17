import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const source = path.resolve(process.argv[2] || "dist/client");
const target = path.resolve(process.argv[3] || "_site");
const serverEntry = path.resolve(process.argv[4] || "dist/server/index.js");

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const workerUrl = pathToFileURL(serverEntry);
workerUrl.searchParams.set("pages", Date.now().toString());
const worker = (await import(workerUrl.href)).default;
const response = await worker.fetch(
  new Request("https://preview.example/"),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Could not render the redesigned home page: ${response.status}`);
}

const renderedHome = (await response.text())
  .replaceAll("/_next/", "_next/")
  .replaceAll("/images/", "images/")
  .replaceAll("/og-v2.png", "og-v2.png")
  .replace(/href="\/privacy-policy(?=([#"]))/gi, 'href="privacy-policy.html')
  .replace(/href="\/personal-data-consent(?=([#"]))/gi, 'href="personal-data-consent.html')
  .replace(/href="\/"/gi, 'href="index.html"');

await writeFile(path.join(target, "index.html"), renderedHome, "utf8");

async function rewriteBuiltCss(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteBuiltCss(file);
    } else if (entry.name.endsWith(".css")) {
      const before = await readFile(file, "utf8");
      const after = before.replaceAll("url(/images/", "url(../../../images/");
      if (after !== before) await writeFile(file, after, "utf8");
    }
  }
}

await rewriteBuiltCss(path.join(target, "_next", "static", "css"));

const topLevelFiles = await readdir(target);
for (const filename of topLevelFiles) {
  if (!filename.endsWith(".html")) continue;

  const file = path.join(target, filename);
  const before = await readFile(file, "utf8");
  const after = before
    .replace(/href="\/css\//gi, 'href="css/')
    .replace(/src="\/js\//gi, 'src="js/')
    .replace(/href="\/privacy-policy(?=([#"]))/gi, 'href="privacy-policy.html')
    .replace(/href="\/personal-data-consent(?=([#"]))/gi, 'href="personal-data-consent.html')
    .replace(/href="\/"/gi, 'href="index.html"');

  if (after !== before) await writeFile(file, after, "utf8");
}

await writeFile(path.join(target, ".nojekyll"), "", "utf8");
console.log(`Prepared GitHub Pages site in ${target}`);
