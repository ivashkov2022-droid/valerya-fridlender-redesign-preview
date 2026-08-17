import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const siteUrl = "https://valerya-fridlender.ru";
const socialImage = `${siteUrl}/og.png`;

const pages = {
  "index.html": {
    title: "Психолог онлайн — Валерия Фридлендер",
    description:
      "Онлайн-консультации психолога: работа с тревогой, травматическим опытом, самооценкой и внутренними конфликтами. Валерия Фридлендер.",
    canonical: `${siteUrl}/`,
    image: socialImage,
    structuredData: true,
    mainPage: true,
  },
  "page61140643.html": {
    title: "Психолог онлайн — Валерия Фридлендер",
    description:
      "Онлайн-консультации психолога: работа с тревогой, травматическим опытом, самооценкой и внутренними конфликтами. Валерия Фридлендер.",
    canonical: `${siteUrl}/`,
    image: socialImage,
    structuredData: true,
    mainPage: true,
  },
  "page59763139.html": {
    title: "Психолог онлайн — Валерия Фридлендер",
    description:
      "Онлайн-консультации психолога Валерии Фридлендер. Актуальная версия страницы доступна на главной сайта.",
    canonical: `${siteUrl}/`,
    image: socialImage,
    noindex: true,
  },
  "page60743599.html": {
    title: "Внутренние конфликты: причины и способы решения",
    description:
      "Почему внутри сталкиваются желания, ценности и обязательства. Как распознать внутренний конфликт, понять его причины и найти опору для решения.",
    canonical: `${siteUrl}/storyone`,
    h1Class: "t203__title",
  },
  "page60743735.html": {
    title: "Как понять, что пора обратиться к психологу",
    description:
      "Тревога, апатия, выгорание, повторяющиеся трудности и последствия тяжёлых событий: признаки, при которых стоит обратиться за помощью к психологу.",
    canonical: `${siteUrl}/storytwo`,
    h1Class: "t203__title",
  },
  "page60743815.html": {
    title: "Куда двигаться дальше?",
    description: "Материал готовится к содержательному обновлению.",
    canonical: `${siteUrl}/storythree`,
    noindex: true,
  },
  "page60744055.html": {
    title: "Внутренние конфликты",
    description: "Материал готовится к содержательному обновлению.",
    canonical: `${siteUrl}/storyfour`,
    noindex: true,
  },
  "page60744079.html": {
    title: "Как понять себя и свои реакции",
    description: "Материал готовится к содержательному обновлению.",
    canonical: `${siteUrl}/storyfive`,
    noindex: true,
  },
  "page60744097.html": {
    title: "Как разобраться в своих чувствах",
    description: "Материал готовится к содержательному обновлению.",
    canonical: `${siteUrl}/storysix`,
    noindex: true,
  },
  "page60745107.html": {
    title: "IFS-терапия: работа с внутренними частями личности",
    description:
      "Как устроена терапия IFS, что такое внутренние части и Self и при каких запросах применяется метод. Объясняет психолог Валерия Фридлендер.",
    canonical: `${siteUrl}/ifs-therapy`,
    h1Class: "t203__title",
  },
  "page60745125.html": {
    title: "EMDR-терапия: работа с травматическим опытом",
    description:
      "Что такое EMDR-терапия, как проходит переработка травматического опыта и при каких запросах применяется метод. Объясняет психолог Валерия Фридлендер.",
    canonical: `${siteUrl}/emdr_method`,
    h1Class: "t203__title",
  },
  "page60745131.html": {
    title: "IMTT-терапия: трансформация травматических образов",
    description:
      "Как IMTT помогает работать с травматическими образами, тревогой и страхами без повторного погружения в болезненный опыт. Описание метода и этапов.",
    canonical: `${siteUrl}/imtt_method`,
    h1Class: "t203__title",
  },
  "page60746837.html": {
    title: "Контакты психолога Валерии Фридлендер",
    description:
      "Запись на онлайн-консультацию психолога Валерии Фридлендер. Контакты и способы связи для согласования времени первой встречи.",
    canonical: `${siteUrl}/contact`,
    h1Class: "t911__title",
    h1Text: "Контакты психолога Валерии Фридлендер",
  },
  "page60765633.html": {
    title: "Чек-лист психолога — материал готовится",
    description: "Материал готовится к публикации.",
    canonical: `${siteUrl}/check-list-1`,
    noindex: true,
  },
  "page60828957.html": {
    title: "Чек-листы психолога — материалы готовятся",
    description: "Раздел бесплатных материалов готовится к публикации.",
    canonical: `${siteUrl}/check-lists`,
    noindex: true,
  },
  "page60830187.html": {
    title: "Чек-лист психолога — материал готовится",
    description: "Материал готовится к публикации.",
    canonical: `${siteUrl}/check-list-2`,
    noindex: true,
  },
  "page60830221.html": {
    title: "Чек-лист психолога — материал готовится",
    description: "Материал готовится к публикации.",
    canonical: `${siteUrl}/check-list-3`,
    noindex: true,
  },
  "page60830241.html": {
    title: "Чек-лист психолога — материал готовится",
    description: "Материал готовится к публикации.",
    canonical: `${siteUrl}/check-list-4`,
    noindex: true,
  },
  "page61113071.html": {
    title: "Блог психолога Валерии Фридлендер",
    description:
      "Статьи психолога Валерии Фридлендер о тревоге, эмоциях, отношениях с собой, личных границах и внутренних конфликтах.",
    canonical: `${siteUrl}/blog`,
    noindex: true,
    h1Class: "t015__title",
    h1Text: "Блог психолога Валерии Фридлендер",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Валерия Фридлендер",
      jobTitle: "Психолог",
      url: `${siteUrl}/`,
      image: `${siteUrl}/images/tild6231-3037-4133-b263-383032396239___3.jpg`,
      knowsAbout: [
        "Психологическое консультирование",
        "IFS-терапия",
        "EMDR-терапия",
        "IMTT-терапия",
        "Тревога",
        "Внутренние конфликты",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Психолог Валерия Фридлендер",
      inLanguage: "ru-RU",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, key, content) {
  const escaped = escapeHtml(content);
  const pattern = new RegExp(
    `<meta\\s+${attribute}=["']${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["'][^>]*>`,
    "i",
  );
  const replacement = `<meta ${attribute}="${key}" content="${escaped}" />`;
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `${replacement} </head>`);
}

function replaceCanonical(html, canonical) {
  const replacement = `<link rel="canonical" href="${escapeHtml(canonical)}">`;
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/i;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace("</head>", `${replacement} </head>`);
}

function extractImage(html) {
  const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["'][^>]*>/i);
  if (!match) return socialImage;
  if (/^https?:\/\//i.test(match[1])) return match[1];
  return `${siteUrl}/${match[1].replace(/^\//, "")}`;
}

function replaceHeading(html, className, replacementText) {
  const pattern = new RegExp(
    `<div([^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*)>([\\s\\S]*?)<\\/div>`,
    "i",
  );
  return html.replace(pattern, (_match, attributes, content) => {
    const body = replacementText ? escapeHtml(replacementText) : content;
    return `<h1${attributes}>${body}</h1>`;
  });
}

function setMainImageAlts(html) {
  const altBySource = new Map([
    ["tild6231-3037-4133-b263-383032396239___3.jpg", "Психолог Валерия Фридлендер"],
    ["tild6264-6136-4833-b566-376534633133___1_4.png", "Валерия Фридлендер — психолог онлайн"],
    ["tild3565-3136-4331-a634-333337646461__frame_427321480.png", "Валерия Фридлендер в кабинете"],
    ["tild3431-3338-4232-b665-643661343066___whatsapp_2025-01-31.jpg", "Отзыв клиента о работе с психологом Валерией Фридлендер"],
    ["tild3161-3239-4633-b838-323435663561___whatsapp_2025-01-31.jpg", "Отзыв о консультации Валерии Фридлендер"],
    ["tild3939-6464-4135-b133-386636626161___whatsapp_2025-01-31.jpg", "Отзыв клиента об онлайн-сессии с психологом"],
    ["tild3963-6537-4335-b430-613962383163___whatsapp_2025-01-31.jpg", "Отзыв клиента о психологической консультации"],
  ]);

  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const source = [...altBySource.keys()].find((name) => tag.includes(name));
    if (!source) return tag;
    const alt = escapeHtml(altBySource.get(source));
    return /\balt=["'][^"']*["']/i.test(tag)
      ? tag.replace(/\balt=["'][^"']*["']/i, `alt="${alt}"`)
      : tag.replace(/\s*\/>$|>$/, (ending) => ` alt="${alt}"${ending}`);
  });
}

function neutralizeAudiencePositioning(html) {
  return html
    .replaceAll("Валерия Фридлендер Женский Психолог Онлайн", "Валерия Фридлендер — психолог онлайн")
    .replaceAll("VALERYA FRIDLENDER - ЖЕНСКИЙ ПСИХОЛОГ", "VALERYA FRIDLENDER — ПСИХОЛОГ ОНЛАЙН")
    .replaceAll("Женский Психолог Валерия", "Психолог Валерия")
    .replaceAll("Блог Женского Психолога", "Блог психолога Валерии Фридлендер")
    .replace(/женский психолог/giu, (match) => {
      if (match === match.toUpperCase()) return "ПСИХОЛОГ ОНЛАЙН";
      if (/^[А-ЯЁ]/u.test(match)) return "Психолог онлайн";
      return "психолог онлайн";
    })
    .replace(/женского психолога/giu, "психолога")
    .replace(
      "я стремлюсь создавать безопасное пространство для женщин, где они могут раскрыть свой потенциал и справиться с любыми трудностями",
      "я стремлюсь создавать безопасное пространство, где каждый человек может раскрыть свой потенциал и справиться с трудностями",
    )
    .replaceAll("групповые программы для женщин", "групповые программы");
}

function updateHtml(html, config) {
  html = neutralizeAudiencePositioning(html);
  html = html.replace(/<html(?:\s+[^>]*)?>/i, '<html lang="ru">');
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(config.title)}</title>`);
  html = replaceMeta(html, "name", "description", config.description);
  html = replaceMeta(html, "property", "og:url", config.canonical);
  html = replaceMeta(html, "property", "og:title", config.title);
  html = replaceMeta(html, "property", "og:description", config.description);
  html = replaceMeta(html, "property", "og:site_name", "Психолог Валерия Фридлендер");
  html = replaceMeta(html, "property", "og:type", "website");

  const image = config.image ?? extractImage(html);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "name", "twitter:card", "summary_large_image");
  html = replaceMeta(html, "name", "twitter:title", config.title);
  html = replaceMeta(html, "name", "twitter:description", config.description);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = replaceCanonical(html, config.canonical);

  html = html.replace(/<meta\s+name=["']keywords["'][^>]*>\s*/i, "");
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>\s*/i, "");
  if (config.noindex) {
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex, follow" /> </head>',
    );
  }

  html = html.replace(
    /<script\s+id=["']seo-structured-data["'][\s\S]*?<\/script>\s*/i,
    "",
  );
  if (config.structuredData) {
    const json = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
    html = html.replace(
      "</head>",
      `<script id="seo-structured-data" type="application/ld+json">${json}</script> </head>`,
    );
  }

  if (config.h1Class) {
    html = replaceHeading(html, config.h1Class, config.h1Text);
  }
  if (config.mainPage) html = setMainImageAlts(html);
  return html;
}

for (const [filename, config] of Object.entries(pages)) {
  const file = path.join(publicRoot, filename);
  const before = await readFile(file, "utf8");
  const after = updateHtml(before, config);
  await writeFile(file, after, "utf8");
}

const bodyRoot = path.join(publicRoot, "files");
for (const filename of await (await import("node:fs/promises")).readdir(bodyRoot)) {
  if (!filename.endsWith("body.html")) continue;
  const file = path.join(bodyRoot, filename);
  const before = await readFile(file, "utf8");
  const after = neutralizeAudiencePositioning(before);
  if (after !== before) await writeFile(file, after, "utf8");
}

console.log(`Updated SEO metadata in ${Object.keys(pages).length} HTML files.`);
