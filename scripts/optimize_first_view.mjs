import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fullPages = ["public/index.html", "public/page61140643.html"];
const sourcePages = [...fullPages, "public/files/page61140643body.html"];

const priorityHead =
  '<link rel="preload" as="image" href="/images/hero-valeria.webp" type="image/webp" fetchpriority="high"> ' +
  '<link rel="preload" as="image" href="/images/tild3935-3361-4935-b936-353131646335__432_1_02_1_03_008_02.jpg" fetchpriority="high"> ' +
  '<link rel="stylesheet" href="/css/site-overrides.css?v=2"> ';

const originalHeroPattern =
  /<img class='tn-atom__img t-img' data-original='images\/tild6231-3037-4133-b263-383032396239___3\.jpg'\s*src='images\/tild6231-3037-4133-b263-383032396239__-__resize__20x___3\.jpg'\s*alt="Психолог Валерия Фридлендер" imgfield='tn_img_1736512040643'\s*\/>/g;
const eagerHero =
  "<img class='tn-atom__img t-img' src='images/hero-valeria.webp' loading='eager' fetchpriority='high' decoding='async' alt=\"Психолог Валерия Фридлендер\" imgfield='tn_img_1736512040643' />";

function removeExpiredPromotion(html) {
  const start = html.indexOf('<div id="rec1022137526"');
  if (start === -1) return html;

  const nextRecord = html.indexOf('<div id="rec1022286186"', start);
  if (nextRecord === -1) {
    throw new Error("Could not find the record following the expired promotion.");
  }

  return `${html.slice(0, start)}${html.slice(nextRecord)}`;
}

for (const relativeFile of sourcePages) {
  const file = path.join(projectRoot, relativeFile);
  const before = await readFile(file, "utf8");
  let after = removeExpiredPromotion(before).replace(originalHeroPattern, eagerHero);

  if (fullPages.includes(relativeFile) && !after.includes("/css/site-overrides.css")) {
    after = after.replace(
      '<link rel="stylesheet" href="/css/privacy-consent.css">',
      `${priorityHead}<link rel="stylesheet" href="/css/privacy-consent.css">`,
    );
  }
  if (fullPages.includes(relativeFile)) {
    after = after.replace(
      /\/css\/site-overrides\.css(?:\?v=\d+)?/gi,
      "/css/site-overrides.css?v=2",
    );
    after = after.replace(
      /js\/tilda-fonts\.min\.js(?:\?v=\d+)?/gi,
      "js/tilda-fonts.min.js?v=2",
    );
    after = after.replace(
      /(fonts\.googleapis\.com\/css2\?family=Oswald[^"']*?)(?:&display=[^&"']+)?(["'])/gi,
      "$1&display=swap$2",
    );
    if (!/rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/i.test(after)) {
      after = after.replace(
        '<link rel="preconnect" href="https://fonts.gstatic.com">',
        '<link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      );
    }
  }

  if (after !== before) await writeFile(file, after, "utf8");
}

console.log("Optimized the first screen and disabled the expired promotion.");
