import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

function parseFrontendFormKeys(source) {
  const declaration = source.match(/export type LeadFormKey\s*=([\s\S]*?);/);
  assert.ok(declaration, "LeadFormKey declaration is missing");
  return [...declaration[1].matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]);
}

function parsePhpDefinitions(source) {
  return new Map(
    [...source.matchAll(/^\s*'([a-z0-9-]+)'\s*=>\s*\[[^\n]*?'slug'\s*=>\s*'([a-z0-9-]+)'/gm)].map(
      (match) => [match[1], match[2]],
    ),
  );
}

test("every frontend form has one server conversion and one thank-you endpoint", async () => {
  const [frontend, config, thankFiles] = await Promise.all([
    read("app/lead-funnels.tsx"),
    read("public/api/lead-config.php"),
    readdir(path.join(root, "public", "thanks")),
  ]);

  const frontendKeys = parseFrontendFormKeys(frontend);
  const definitions = parsePhpDefinitions(config);
  assert.equal(new Set(frontendKeys).size, frontendKeys.length, "frontend form keys must be unique");
  assert.equal(definitions.size, frontendKeys.length, "frontend and backend form counts must match");
  assert.deepEqual([...definitions.keys()].sort(), [...frontendKeys].sort());

  const expectedThankFiles = [...definitions.values()].map((slug) => `${slug}.php`).sort();
  assert.deepEqual(thankFiles.filter((name) => name.endsWith(".php")).sort(), expectedThankFiles);

  for (const [formKey, slug] of definitions) {
    const wrapper = await read(`public/thanks/${slug}.php`);
    assert.match(wrapper, new RegExp(`vf_render_thank_you\\('${formKey.replaceAll("-", "\\-")}\\'\\);`));
  }
});

test("lead handling stays in observation mode and delivers to the approved mailbox", async () => {
  const [config, security, delivery, handler, frontend] = await Promise.all([
    read("public/api/lead-config.php"),
    read("public/api/form-security.php"),
    read("public/api/mail-delivery.php"),
    read("public/api/lead-request.php"),
    read("app/lead-funnels.tsx"),
  ]);

  assert.match(config, /VF_NOTIFICATION_RECIPIENT\s*=\s*'ivv2@mail\.ru'/);
  assert.match(security, /'blocked'\s*=>\s*\$honeypot\s*!==\s*''/);
  assert.match(delivery, /Режим: наблюдение/);
  assert.doesNotMatch(security, /'blocked'\s*=>\s*\$score/);
  assert.match(handler, /vf_send_notification/);
  assert.match(handler, /vf_grant_thank_you_access/);
  assert.match(frontend, /new URL\("api\/form-token\.php"/);
  assert.match(frontend, /api\/lead-request\.php/);
});
