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

test("preserves focused metadata in the legacy home archive", async () => {
  const html = await readPublic("legacy-home.html");

  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>Психолог онлайн — Валерия Фридлендер<\/title>/i);
  assert.match(html, /<meta name="description" content="Онлайн-консультации психолога:/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/valerya-fridlender\.ru\/">/i);
  assert.match(html, /<meta property="og:image" content="https:\/\/valerya-fridlender\.ru\/og\.png"/i);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/i);
  assert.match(html, /<script id="seo-structured-data" type="application\/ld\+json">/i);
  assert.doesNotMatch(html, /для женщин|женский психолог/i);
});

test("keeps the legacy first screen and expired promotion rules intact", async () => {
  const [html, overrides, fontLoader] = await Promise.all([
    readPublic("legacy-home.html"),
    readPublic("css/site-overrides.css"),
    readPublic("js/tilda-fonts.min.js"),
  ]);

  assert.match(html, /rel="preload" as="image" href="\/images\/hero-valeria\.webp"/i);
  assert.match(html, /src='images\/hero-valeria\.webp' loading='eager' fetchpriority='high'/i);
  assert.match(html, /href="\/css\/site-overrides\.css\?v=3"/i);
  assert.match(overrides, /#rec1022137526[\s\S]*#rec1022300811[\s\S]*display:\s*none\s*!important/i);
  assert.match(overrides, /\.t-records[\s\S]*opacity:\s*1\s*!important/i);
  assert.match(overrides, /\.t396__artboard\.rendering \.tn-elem[\s\S]*visibility:\s*visible\s*!important/i);
  assert.match(html, /src="js\/tilda-fonts\.min\.js\?v=2"/i);
  assert.match(html, /fonts\.googleapis\.com[^"']*&display=swap/i);
  assert.match(fontLoader, /window\.tildafontsswap\s*=\s*"y"/i);
  assert.doesNotMatch(fontLoader, /body \*\{color:transparent/i);
  assert.doesNotMatch(html, /Запись открыта до 15 августа|id="rec1022137526"|id="rec1022300811"/i);
  assert.match(html, /data-vf-cookie-banner/i);
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

test("publishes the privacy policy and separate consent as site pages", async () => {
  const [policy, consent] = await Promise.all([
    readPublic("privacy-policy.html"),
    readPublic("personal-data-consent.html"),
  ]);

  assert.match(policy, /<h1>Политика обработки персональных данных<\/h1>/i);
  assert.match(policy, /Индивидуальный предприниматель Остратова Валерия Андреевна/i);
  assert.match(policy, /ИНН: 781632346929/i);
  assert.match(policy, /Яндекс\.Метрика/i);
  assert.match(policy, /<meta name="robots" content="noindex, follow">/i);
  assert.match(policy, /href="\/personal-data-consent"/i);

  assert.match(consent, /<h1>Согласие на обработку персональных данных<\/h1>/i);
  assert.match(consent, /не более 90 дней/i);
  assert.match(consent, /href="\/privacy-policy"/i);
  assert.match(policy, /Сайт использует файлы cookie/i);
  assert.doesNotMatch(policy, /Настройки приватности|Необходимые функции работают всегда/i);
  assert.doesNotMatch(policy, /legal-toc/i);
});

test("requires separate consent in every public form and gates optional trackers", async () => {
  const filenames = [
    "legacy-home.html",
    "page61140643.html",
    "page60765633.html",
    "page60830187.html",
    "page60830221.html",
    "page60830241.html",
  ];
  const pages = await Promise.all(filenames.map(readPublic));
  let formCount = 0;

  for (const html of pages) {
    const forms = html.match(/<form\b[\s\S]*?<\/form>/gi) ?? [];
    formCount += forms.length;
    for (const form of forms) {
      assert.match(form, /href="\/personal-data-consent"/i);
      assert.match(form, /href="\/privacy-policy"/i);
      assert.match(form, /data-tilda-req="1"/i);
    }
    assert.doesNotMatch(html, /clck\.ru\/3MmNdz|disk\.yandex\.ru\/i\/yS_S-DEt6lcttQ/i);
    assert.doesNotMatch(html, /<script type="text\/javascript" data-tilda-cookie-type="analytics"/i);
  }

  assert.equal(formCount, 20);
  assert.match(pages[0], /data-vf-consent="analytics"/i);
  assert.match(pages[0], /data-youtube-consent-id=/i);
  assert.match(pages[0], /data-vf-cookie-banner/i);
  assert.match(pages[0], /href="\/css\/privacy-consent\.css\?v=4"/i);
  assert.match(pages[0], /Сайт использует файлы cookie/i);
  assert.match(pages[0], /href="\/privacy-policy">Политика конфиденциальности<\/a>/i);
  assert.doesNotMatch(pages[0], />Подробнее<\/a>/i);
  assert.match(pages[0], /data-vf-cookie-accept>Принять<\/button>/i);
  assert.match(pages[0], /data-vf-cookie-reject>Отклонить<\/button>/i);
  assert.doesNotMatch(pages[0], /Включить аналитику и видео|Нет, спасибо/i);
});

test("redirects every form to an individual non-indexable thank-you page", async () => {
  const thankYouByForm = {
    form859129714: "thank-you-session.html",
    form1022286186: "thank-you-participation.html",
    form851582095: "thank-you-diagnostic.html",
    form851585075: "thank-you-single-session.html",
    form851585325: "thank-you-three-sessions.html",
    form851585355: "thank-you-five-sessions.html",
    form851578306: "thank-you-checklist.html",
    form849469026: "thank-you-contact.html",
    form846370213: "thank-you-checklist-1.html",
    form846910234: "thank-you-checklist-2.html",
    form846910468: "thank-you-checklist-3.html",
    form846910570: "thank-you-checklist-4.html",
  };
  const formPages = await Promise.all(
    [
      "legacy-home.html",
      "page61140643.html",
      "page60765633.html",
      "page60830187.html",
      "page60830221.html",
      "page60830241.html",
    ].map(readPublic),
  );
  const thankYouPages = await Promise.all(Object.values(thankYouByForm).map(readPublic));

  for (const [formId, filename] of Object.entries(thankYouByForm)) {
    const placements = formPages.flatMap((html) =>
      html.match(new RegExp(`<form\\b(?=[^>]*(?:id|name)=["']${formId}["'])[^>]*>`, "gi")) ?? [],
    );
    assert.ok(placements.length >= 1, `${formId} must be present`);
    for (const form of placements) {
      assert.match(form, new RegExp(`data-success-url=["']${filename}["']`, "i"));
    }
  }

  for (const html of thankYouPages) {
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/i);
    assert.match(html, /<p class="thank-you__eyebrow">Форма отправлена<\/p>/i);
    assert.match(html, /href="\/">Вернуться на сайт<\/a>/i);
    assert.match(html, /href="\/privacy-policy">Политика конфиденциальности<\/a>/i);
  }

  const sitemap = await readPublic("sitemap.xml");
  assert.doesNotMatch(sitemap, /thank-you/i);
});

test("requests a fresh cookie choice after the GitHub Pages publication", async () => {
  const [script, html] = await Promise.all([
    readPublic("js/privacy-consent.js"),
    readPublic("legacy-home.html"),
  ]);

  assert.match(script, /vf_cookie_consent_v3/);
  assert.doesNotMatch(script, /vf_cookie_consent_v[12]/);
  assert.match(html, /src="\/js\/privacy-consent\.js\?v=3"/i);
});

test("serves clean legal-document routes", async () => {
  const worker = await loadWorker();
  const requestedPaths = [];
  const env = {
    ASSETS: {
      fetch: async (request) => {
        requestedPaths.push(new URL(request.url).pathname);
        return new Response("legal", { status: 200 });
      },
    },
  };

  await worker.fetch(new Request("https://preview.example/privacy-policy"), env, executionContext);
  await worker.fetch(new Request("https://preview.example/personal-data-consent"), env, executionContext);

  assert.deepEqual(requestedPaths, ["/privacy-policy.html", "/personal-data-consent.html"]);
});
