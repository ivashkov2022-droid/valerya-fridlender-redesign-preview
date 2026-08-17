import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const bodyRoot = path.join(publicRoot, "files");

const pages = [
  {
    formId: "form859129714",
    filename: "thank-you-session.html",
    title: "Заявка на сессию принята",
    text: "Спасибо! Я получила вашу заявку и свяжусь с вами лично, чтобы уточнить запрос и подобрать удобное время встречи.",
  },
  {
    formId: "form1022286186",
    filename: "thank-you-participation.html",
    title: "Заявка на участие принята",
    text: "Спасибо! Я свяжусь с вами, чтобы подтвердить выбранный формат участия и ответить на вопросы.",
  },
  {
    formId: "form851582095",
    filename: "thank-you-diagnostic.html",
    title: "Заявка на диагностику принята",
    text: "Спасибо! Я свяжусь с вами, чтобы согласовать время диагностической встречи и коротко уточнить ваш запрос.",
  },
  {
    formId: "form851585075",
    filename: "thank-you-single-session.html",
    title: "Заявка на сессию принята",
    text: "Спасибо! Я свяжусь с вами, чтобы согласовать дату и время индивидуальной сессии.",
  },
  {
    formId: "form851585325",
    filename: "thank-you-three-sessions.html",
    title: "Заявка на три сессии принята",
    text: "Спасибо! Я свяжусь с вами, чтобы обсудить запрос и подобрать расписание для трёх встреч.",
  },
  {
    formId: "form851585355",
    filename: "thank-you-five-sessions.html",
    title: "Заявка на пять сессий принята",
    text: "Спасибо! Я свяжусь с вами, чтобы обсудить запрос и подобрать расписание для системной работы.",
  },
  {
    formId: "form851578306",
    filename: "thank-you-checklist.html",
    title: "Заявка на материал принята",
    text: "Спасибо! Выбранный чек-лист будет отправлен по указанным вами контактам.",
  },
  {
    formId: "form849469026",
    filename: "thank-you-contact.html",
    title: "Контакты получены",
    text: "Спасибо! Я свяжусь с вами лично, чтобы уточнить запрос и подобрать удобное время встречи.",
  },
  {
    formId: "form846370213",
    filename: "thank-you-checklist-1.html",
    title: "Спасибо за ответы",
    text: "Ваши ответы отправлены. Вы можете вернуться на сайт и продолжить знакомство с материалами.",
  },
  {
    formId: "form846910234",
    filename: "thank-you-checklist-2.html",
    title: "Спасибо за ответы",
    text: "Ваши ответы отправлены. Вы можете вернуться на сайт и продолжить знакомство с материалами.",
  },
  {
    formId: "form846910468",
    filename: "thank-you-checklist-3.html",
    title: "Спасибо за ответы",
    text: "Ваши ответы отправлены. Вы можете вернуться на сайт и продолжить знакомство с материалами.",
  },
  {
    formId: "form846910570",
    filename: "thank-you-checklist-4.html",
    title: "Спасибо за ответы",
    text: "Ваши ответы отправлены. Вы можете вернуться на сайт и продолжить знакомство с материалами.",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderPage(page) {
  const title = escapeHtml(page.title);
  const text = escapeHtml(page.text);
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Валерия Фридлендер</title>
  <meta name="description" content="${title}.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="/css/thank-you.css?v=1">
  <link rel="stylesheet" href="/css/privacy-consent.css?v=4">
  <script src="/js/privacy-consent.js?v=3"></script>
</head>
<body>
  <main class="thank-you">
    <p class="thank-you__brand">Валерия Фридлендер · психолог</p>
    <p class="thank-you__eyebrow">Форма отправлена</p>
    <h1>${title}</h1>
    <p class="thank-you__text">${text}</p>
    <div class="thank-you__actions">
      <a class="thank-you__button" href="/">Вернуться на сайт</a>
      <a class="thank-you__policy" href="/privacy-policy">Политика конфиденциальности</a>
    </div>
  </main>
  <div class="vf-cookie-banner" data-vf-cookie-banner hidden role="dialog" aria-label="Уведомление о cookie" aria-live="polite">
    <p class="vf-cookie-banner__text">Сайт использует файлы cookie. <a href="/privacy-policy">Политика конфиденциальности</a></p>
    <div class="vf-cookie-banner__actions">
      <button class="vf-cookie-banner__button vf-cookie-banner__button--accept" type="button" data-vf-cookie-accept>Принять</button>
      <button class="vf-cookie-banner__button" type="button" data-vf-cookie-reject>Отклонить</button>
    </div>
  </div>
</body>
</html>
`;
}

function setSuccessUrl(html, formId, filename) {
  const pattern = new RegExp(
    `<form\\b(?=[^>]*(?:id|name)=["']${formId}["'])[^>]*>`,
    "gi",
  );
  return html.replace(pattern, (tag) => {
    if (/data-success-url=["'][^"']*["']/i.test(tag)) {
      return tag.replace(/data-success-url=["'][^"']*["']/i, `data-success-url="${filename}"`);
    }
    return tag.replace(/>$/, ` data-success-url="${filename}">`);
  });
}

const sourceFiles = [];
for (const root of [publicRoot, bodyRoot]) {
  for (const filename of await readdir(root)) {
    if (filename.endsWith(".html")) sourceFiles.push(path.join(root, filename));
  }
}

let updatedForms = 0;
for (const file of sourceFiles) {
  const before = await readFile(file, "utf8");
  let after = before;
  for (const page of pages) {
    const next = setSuccessUrl(after, page.formId, page.filename);
    if (next !== after) updatedForms += 1;
    after = next;
  }
  if (after !== before) await writeFile(file, after, "utf8");
}

for (const page of pages) {
  await writeFile(path.join(publicRoot, page.filename), renderPage(page), "utf8");
}

console.log(`Prepared ${pages.length} thank-you pages and updated ${updatedForms} form placements.`);
