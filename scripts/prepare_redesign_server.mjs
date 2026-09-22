import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.resolve(process.argv[2] || "dist/client");
const renderUrl = process.argv[3] || "http://127.0.0.1:3217/";
const target = path.resolve(process.argv[4] || "_server-site");

const response = await fetch(renderUrl, { headers: { Accept: "text/html" } });
if (!response.ok) {
  throw new Error(`Could not render the redesign at ${renderUrl}: HTTP ${response.status}`);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

let home = await response.text();
home = home
  .replace(/href="\/privacy-policy(?=([#"]))/gi, 'href="privacy-policy.html')
  .replace(/href="\/personal-data-consent(?=([#"]))/gi, 'href="personal-data-consent.html')
  .replace(/\b(src|href)="\/(?!\/)/gi, '$1="')
  .replace(/\\"\/_next\//g, '\\"_next/');

await writeFile(path.join(target, "index.html"), home, "utf8");
await writeFile(path.join(target, ".nojekyll"), "", "utf8");
console.log(`Prepared interactive server release in ${target}`);

