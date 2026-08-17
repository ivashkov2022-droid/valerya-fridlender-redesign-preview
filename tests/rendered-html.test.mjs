import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readPublic(filename) {
  return readFile(new URL(`public/${filename}`, projectRoot), "utf8");
}

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const executionContext = {
  waitUntil() {},
  passThroughOnException() {},
};

test("publishes focused metadata for the home page", async () => {
  const html = await readPublic("index.html");

  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>Психолог онлайн — Валерия Фридлендер<\/title>/i);
  assert.match(html, /<meta name="description" content="Онлайн-консультации психолога:/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/valerya-fridlender\.ru\/">/i);
  assert.match(html, /<meta property="og:image" content="https:\/\/valerya-fridlender\.ru\/og\.png"/i);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /<script id="seo-structured-data" type="application\/ld\+json">/i);
  assert.doesNotMatch(html, /для женщин|женский психолог/i);
});

test("keeps indexable pages unique and draft pages out of the index", async () => {
  const [story, method, blog, checklist, sitemap] = await Promise.all([
    readPublic("page60743599.html"),
    readPublic("page60745125.html"),
    readPublic("page61113071.html"),
    readPublic("page60765633.html"),
    readPublic("sitemap.xml"),
  ]);

  assert.match(story, /<title>Внутренние конфликты: причины и способы решения<\/title>/i);
  assert.match(story, /<h1[^>]*class=["'][^"']*t203__title/i);
  assert.doesNotMatch(story, /name="robots" content="noindex/i);

  assert.match(method, /<title>EMDR-терапия: работа с травматическим опытом<\/title>/i);
  assert.match(method, /<h1[^>]*class=["'][^"']*t203__title/i);

  assert.match(blog, /<meta name="robots" content="noindex, follow"/i);
  assert.match(checklist, /<meta name="robots" content="noindex, follow"/i);
  assert.doesNotMatch(sitemap, /blog|check-list|storythree|page59763139/i);
  assert.match(sitemap, /storyone/);
  assert.match(sitemap, /emdr_method/);
});

test("serves clean routes and blocks preview indexing", async () => {
  const worker = await loadWorker();
  let requestedPath = "";
  const env = {
    ASSETS: {
      fetch: async (request) => {
        requestedPath = new URL(request.url).pathname;
        return new Response("article", {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  };

  const response = await worker.fetch(
    new Request("https://preview.example/storyone"),
    env,
    executionContext,
  );

  assert.equal(response.status, 200);
  assert.equal(requestedPath, "/page60743599.html");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
});

test("redirects duplicate home-page URLs", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("https://preview.example/page61140643.html"),
    { ASSETS: { fetch: async () => new Response("unused") } },
    executionContext,
  );

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "https://preview.example/");
});
