import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.resolve(process.argv[2] || "dist/client");
const renderedHome = path.resolve(process.argv[3] || ".github-pages-home.html");
const target = path.resolve(process.argv[4] || "_site");

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const rewriteLocalPaths = (html) => html
  .replace(/href="\/privacy-policy(?=([#"]))/gi, 'href="privacy-policy.html')
  .replace(/href="\/personal-data-consent(?=([#"]))/gi, 'href="personal-data-consent.html')
  .replace(/\b(src|href)="\/(?!\/)/gi, '$1="');

let home = await readFile(renderedHome, "utf8");
home = home
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*rel="modulepreload"[^>]*\/?\s*>/gi, "")
  .replace(/<aside class="font-lab"[\s\S]*?<\/aside>/i, '<aside class="font-lab" aria-label="Примерочная шрифтов"><button class="font-lab-trigger" type="button" aria-expanded="false"><span aria-hidden="true">Aa</span> Шрифты</button></aside>')
  .replace("</body>", '<script src="js/font-lab-static.js"></script></body>');
home = rewriteLocalPaths(home);
await writeFile(path.join(target, "index.html"), home, "utf8");

for (const filename of await readdir(target)) {
  if (!filename.endsWith(".html") || filename === "index.html") continue;
  const file = path.join(target, filename);
  const before = await readFile(file, "utf8");
  const after = rewriteLocalPaths(before).replace(/href="index\.html"/gi, 'href="./"');
  if (after !== before) await writeFile(file, after, "utf8");
}

await writeFile(path.join(target, ".nojekyll"), "", "utf8");
console.log(`Prepared static redesign in ${target}`);
