import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.resolve(process.argv[2] || "public");
const target = path.resolve(process.argv[3] || "_site");

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

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
