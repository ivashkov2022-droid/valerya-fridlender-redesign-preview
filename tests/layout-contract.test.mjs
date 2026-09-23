import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

test("keeps the approved desktop intro and formats geometry stable", async () => {
  const [page, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(css, /\.intro-split\s*\{[\s\S]*?grid-template-columns:\s*52%\s+48%\s*;/);
  assert.match(css, /\.intro-copy\s*\{[\s\S]*?padding:\s*46px\s+clamp\(42px,\s*5vw,\s*72px\)\s*;/);
  assert.match(css, /\.intro-copy h2\s*\{[\s\S]*?font-size:\s*clamp\(42px,\s*4\.5vw,\s*65px\)\s*;/);

  assert.match(
    page,
    /<h2 aria-label="Онлайн-сессии">[\s\S]*?<span className="formats-title-line">[\s\S]*?Онлайн<span className="formats-straight-hyphen" aria-hidden="true" \/>[\s\S]*?<span className="formats-title-line">сессии<\/span>[\s\S]*?<\/h2>/,
  );
  assert.doesNotMatch(page, /formats-title-line">\s*Онлайн-/);
  assert.match(css, /@media\s*\(min-width:\s*821px\)\s*\{[\s\S]*?\.formats-title-line\s*\{\s*display:\s*block\s*;/);
  assert.match(css, /\.formats-straight-hyphen\s*\{[^}]*display:\s*inline-block\s*;[^}]*width:\s*0\.3em\s*;[^}]*height:\s*0\.045em\s*;[^}]*background:\s*currentColor\s*;[^}]*vertical-align:\s*0\.19em\s*;/);
  const straightHyphenRule = css.match(/\.formats-straight-hyphen\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.doesNotMatch(straightHyphenRule, /(?:rotate|skew|transform)\s*:/);
});

test("uses only the approved local production fonts and preserves the approved services cards", async () => {
  const [page, css, serverRelease, pagesRelease] = await Promise.all([
    read("app/page.tsx"),
    read("app/globals.css"),
    read("scripts/prepare_redesign_server.mjs"),
    read("scripts/prepare_redesign_github_pages.mjs"),
  ]);

  assert.match(css, /cormorant-garamond-cyrillic\.woff2/);
  assert.match(css, /cormorant-garamond-italic-cyrillic\.woff2/);
  assert.match(css, /montserrat-cyrillic\.woff2/);
  assert.doesNotMatch(css, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.doesNotMatch(page, /FontLab|font-lab/i);
  assert.doesNotMatch(css, /font-lab|font-option/i);
  assert.doesNotMatch(pagesRelease, /font-lab/i);
  assert.match(serverRelease, /url\\\(\(\['"\]\?\)\\\/_next\\\/static\\\/media\\\//);
  assert.match(pagesRelease, /url\\\(\(\['"\]\?\)\\\/_next\\\/static\\\/media\\\//);

  assert.match(css, /\.service-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*1fr\)\s*;[^}]*gap:\s*10px\s*;/);
  assert.match(css, /\.service-card\s*>\s*img\s*\{[^}]*height:\s*258px\s*;/);
  assert.match(css, /\.service-card\s*>\s*div\s*\{[^}]*min-height:\s*308px\s*;[^}]*padding:\s*25px\s+20px\s+24px\s*;/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.service-grid\s*\{[^}]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.service-grid\s*\{[^}]*minmax\(0,\s*1fr\)/);
});

test("keeps every external social link in a separate browser tab", async () => {
  const page = await read("app/page.tsx");
  const externalLinks = [...page.matchAll(/<a\b[^>]*href="https?:\/\/[^"]+"[^>]*>/g)].map(([tag]) => tag);

  assert.equal(externalLinks.length, 3);
  for (const link of externalLinks) {
    assert.match(link, /\btarget="_blank"/);
    assert.match(link, /\brel="noopener noreferrer"/);
  }
});

test("adds mobile breathing room only around the lead-form consent and submit action", async () => {
  const css = await read("app/globals.css");

  assert.match(
    css,
    /@media\s*\(max-width:\s*560px\)[\s\S]*?\.lead-consent\s*\{[^}]*margin-top:\s*5px\s*;[^}]*\}[\s\S]*?\.lead-submit\s*\{[^}]*margin-top:\s*5px\s*;[^}]*\}/,
  );
});

test("activates one mobile format on scroll while keeping the entire row clickable", async () => {
  const [page, css] = await Promise.all([read("app/page.tsx"), read("app/globals.css")]);

  assert.match(page, /window\.matchMedia\("\(max-width: 560px\)"\)/);
  assert.match(page, /window\.requestAnimationFrame\(updateMobileFormat\)/);
  assert.match(page, /window\.addEventListener\("scroll", scheduleMobileFormatUpdate, \{ passive: true \}\)/);
  assert.match(page, /visibleOptions\.reduce/);
  assert.match(page, /className=\{`format-option\$\{activeMobileFormat === format\.key \? " is-scroll-active" : ""\}`\}/);
  assert.match(page, /data-format-key=\{format\.key\}/);
  assert.match(css, /\.format-select\s*\{[^}]*position:\s*absolute\s*;[^}]*inset:\s*0\s*;/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*?\.format-option\.is-scroll-active[\s\S]*?\.format-select::after/);
});

test("groups the FAQ so opening a question closes the previous one", async () => {
  const page = await read("app/page.tsx");

  assert.match(page, /const \[activeFaq, setActiveFaq\] = useState\(0\)/);
  assert.match(page, /<details key=\{question\} name="before-first-session" open=\{activeFaq === index\}>/);
  assert.match(page, /event\.preventDefault\(\); setActiveFaq\(index\)/);
});

test("offers three transparent twig previews without changing the default eyebrow rule", async () => {
  const [page, css] = await Promise.all([read("app/page.tsx"), read("app/globals.css")]);

  assert.match(page, /new URLSearchParams\(window\.location\.search\)\.get\("marker"\)/);
  assert.match(page, /marker !== "twig-a" && marker !== "twig-b" && marker !== "twig-c"/);
  assert.match(page, /root\.dataset\.markerPreview = marker/);
  assert.match(page, /<main ref=\{pageRoot\}>/);
  assert.match(page, /<section className="faq-section section-shell" id="faq">/);

  assert.match(css, /\.eyebrow::before\s*\{[^}]*width:\s*32px\s*;[^}]*height:\s*1px\s*;[^}]*margin-right:\s*11px\s*;[^}]*background:\s*currentColor\s*;[^}]*opacity:\s*0\.5\s*;/);
  assert.match(css, /main\[data-marker-preview\] \.eyebrow::before\s*\{[^}]*height:\s*12px\s*;[^}]*mask:\s*var\(--eyebrow-marker-mask\)/);
  for (const variant of ["twig-a", "twig-b", "twig-c"]) {
    assert.match(css, new RegExp(`main\\[data-marker-preview="${variant}"\\]`));
  }
  assert.match(css, /stroke-width%3D'1'/);
  assert.doesNotMatch(css, /main\[data-marker-preview[^}]*background-color\s*:/);
});
