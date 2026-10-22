import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../circuit-breaker/index.html', import.meta.url), 'utf8');
const source = html.match(/const S=\{[\s\S]*?\n\};/);
assert.ok(source);
const translations = vm.runInNewContext(`${source[0]}\nS`, {}, { timeout: 1000 });
const expected = { en: 'above the refrigerator', ja: '冷蔵庫の上', zh: '冰箱上方', ko: '냉장고 위', fr: 'au-dessus du réfrigérateur', es: 'encima del frigorífico' };
assert.deepEqual(Object.keys(translations), Object.keys(expected));
for (const [lang, location] of Object.entries(expected)) {
  assert.ok(translations[lang].cbBody.includes(location), `${lang}: refrigerator location`);
  assert.ok(translations[lang].cbTitle, `${lang}: translated heading`);
}
assert.doesNotMatch(html, /next to the sofa bed/);
assert.doesNotMatch(html, /<img[^>]+src="data:image\//);
assert.match(html, /data-i18n="cbBody">The circuit breaker box is above the refrigerator\./);
console.log('PASS: six languages, default text, and old diagram removal');
