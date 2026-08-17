import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const bodyRoot = path.join(publicRoot, "files");

const policyLink =
  '<a class="vf-privacy-link" href="/privacy-policy" target="_blank" rel="noopener">Политикой обработки персональных данных</a>';
const consentLink =
  '<a class="vf-privacy-link" href="/personal-data-consent" target="_blank" rel="noopener">согласие на обработку персональных данных</a>';
const consentText = `Я подтверждаю ${consentLink} и ознакомление с ${policyLink}.`;

const cookieBanner = `
<div class="vf-cookie-banner" data-vf-cookie-banner hidden role="dialog" aria-label="Уведомление о cookie" aria-live="polite">
  <p class="vf-cookie-banner__text">Сайт использует файлы cookie. <a href="/privacy-policy">Подробнее</a></p>
  <div class="vf-cookie-banner__actions">
    <button class="vf-cookie-banner__button vf-cookie-banner__button--accept" type="button" data-vf-cookie-accept>Принять</button>
    <button class="vf-cookie-banner__button" type="button" data-vf-cookie-reject>Отклонить</button>
  </div>
</div>`;

function consentBlock(formId) {
  const suffix = (formId.match(/\d+/g) || ["form"])[0];
  const inputId = `vf-consent-${suffix}`;
  return `<div class="t-input-group t-input-group_cb vf-consent-group" data-input-lid="${inputId}" data-field-type="cb" data-field-name="PersonalDataConsent">
<div class="t-input-block"><label class="t-checkbox__control t-checkbox__control_flex t-text t-text_xs"><input type="checkbox" name="PersonalDataConsent" value="yes" class="t-checkbox js-tilda-rule" data-tilda-req="1" aria-required="true" aria-describedby="error_${inputId}"><div class="t-checkbox__indicator"></div><span>${consentText}</span></label>
<div class="vf-form-warning">Не указывайте в форме диагнозы, медицинские документы и иные сведения о здоровье.</div>
<div class="t-input-error" aria-live="polite" id="error_${inputId}"></div></div></div>`;
}

function updateForms(html) {
  return html.replace(/<form\b[\s\S]*?<\/form>/gi, (form) => {
    let updated = form
      .replace(
        /Я даю согласие на обработку персональных данных в соответствии с политикой конфиденциальности/gi,
        consentText,
      )
      .replace(
        /Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь c политикой конфиденциальности\./gi,
        `Перед отправкой формы подтвердите отдельное ${consentLink} и ознакомьтесь с ${policyLink}.`,
      );

    if (/согласие на обработку персональных данных/i.test(updated)) {
      if (!/vf-form-warning/i.test(updated)) {
        updated = updated.replace(
          /(<\/span><\/label>)/i,
          '$1<div class="vf-form-warning">Не указывайте в форме диагнозы, медицинские документы и иные сведения о здоровье.</div>',
        );
      }
      return updated;
    }

    const formId = updated.match(/<form\b[^>]*(?:id|name)=["']([^"']+)["']/i)?.[1] || "form";
    const block = consentBlock(formId);
    if (/<div\s+class=["']t-form__errorbox-middle/i.test(updated)) {
      return updated.replace(/(<div\s+class=["']t-form__errorbox-middle)/i, `${block} $1`);
    }
    return updated.replace(/<\/form>/i, `${block}</form>`);
  });
}

function gateOptionalServices(html) {
  html = html.replace(
    /data-youtubeid="([^"\s][^"]*)"/gi,
    'data-youtube-consent-id="$1" data-youtubeid=""',
  );
  html = html.replace(
    /<script\s+type=["']text\/javascript["']\s+data-tilda-cookie-type=["']analytics["']/gi,
    '<script type="text/plain" data-vf-consent="analytics" data-tilda-cookie-type="analytics"',
  );
  html = html.replace(
    /<noscript>\s*<div>\s*<img\s+src=["']https:\/\/mc\.yandex\.ru\/watch\/[^"']+["'][^>]*>\s*<\/div>\s*<\/noscript>/gi,
    "",
  );
  return html;
}

function replaceLegacyPolicyReferences(html) {
  return html
    .replace(/https?:\/\/clck\.ru\/3MmNdz/gi, "/privacy-policy")
    .replace(/https?:\/\/disk\.yandex\.ru\/i\/yS_S-DEt6lcttQ(?:\?[^"'\s<]*)?/gi, "/privacy-policy");
}

function addPrivacyAssets(html) {
  if (!/\/css\/privacy-consent\.css/i.test(html)) {
    html = html.replace("</head>", '<link rel="stylesheet" href="/css/privacy-consent.css"> </head>');
  }
  if (!/\/js\/privacy-consent\.js/i.test(html)) {
    html = html.replace("</head>", '<script src="/js/privacy-consent.js?v=3"></script> </head>');
  }
  html = html.replace(/\/js\/privacy-consent\.js(?:\?v=\d+)?/gi, "/js/privacy-consent.js?v=3");
  if (!/data-vf-cookie-banner/i.test(html)) {
    html = html.replace("</body>", `${cookieBanner}\n</body>`);
  }
  return html;
}

function simplifyCookieBanner(html) {
  return html
    .replace(/\s*<p class="vf-cookie-banner__title">[\s\S]*?<\/p>/gi, "")
    .replace(
      /<p class="vf-cookie-banner__text">[\s\S]*?<\/p>/gi,
      '<p class="vf-cookie-banner__text">Сайт использует файлы cookie. <a href="/privacy-policy">Подробнее</a></p>',
    )
    .replace(
      /(<button class="vf-cookie-banner__button vf-cookie-banner__button--accept"[^>]*>)[\s\S]*?<\/button>/gi,
      "$1Принять</button>",
    )
    .replace(
      /(<button class="vf-cookie-banner__button"[^>]*data-vf-cookie-reject[^>]*>)[\s\S]*?<\/button>/gi,
      "$1Отклонить</button>",
    );
}

function tidyLineEndings(html) {
  return html.replace(/[ \t]+(?=\r?$)/gm, "");
}

const topLevelHtml = (await readdir(publicRoot)).filter((filename) => filename.endsWith(".html"));
let updatedCount = 0;

for (const filename of topLevelHtml) {
  if (filename === "privacy-policy.html" || filename === "personal-data-consent.html") continue;
  const file = path.join(publicRoot, filename);
  const before = await readFile(file, "utf8");
  let after = replaceLegacyPolicyReferences(before);
  after = updateForms(after);
  after = gateOptionalServices(after);
  after = addPrivacyAssets(after);
  after = simplifyCookieBanner(after);
  after = tidyLineEndings(after);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    updatedCount += 1;
  }
}

for (const filename of await readdir(bodyRoot)) {
  if (!filename.endsWith("body.html")) continue;
  const file = path.join(bodyRoot, filename);
  const before = await readFile(file, "utf8");
  let after = replaceLegacyPolicyReferences(before);
  after = updateForms(after);
  after = gateOptionalServices(after);
  after = tidyLineEndings(after);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    updatedCount += 1;
  }
}

console.log(`Updated privacy controls in ${updatedCount} HTML files.`);
