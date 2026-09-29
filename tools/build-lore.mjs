// Собирает официальный лор предметов и умений из файлов локализации Dota 2 (зеркало dotabuff/d2vpkr)
// и оставляет только то, что есть в игре сейчас (по данным odota/dotaconstants):
// предметы из лавки и актуальные нейтральные, умения из текущих списков героев.
// Запуск: node tools/build-lore.mjs   (Node 18+). В репо его запускает GitHub Action «Обновить лор из игры».
import { writeFileSync } from 'node:fs';

const LOC = 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/';
const CONST = 'https://raw.githubusercontent.com/odota/dotaconstants/master/build/';
const LANGS = { en: 'english', ru: 'russian', de: 'german' };

async function get(url, json) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Не скачалось ${url}: ${r.status}`);
  return json ? r.json() : r.text();
}
function parse(txt) {
  const out = {};
  const re = /"([^"]+)"\s+"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(txt))) out[m[1].toLowerCase()] = m[2];
  return out;
}
const clean = (s) => (s || '')
  .replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  .replace(/<[^>]+>/g, '').replace(/%[a-z_]*%/gi, '').replace(/\s+/g, ' ').trim();

const items = await get(CONST + 'items.json', true);
const heroAbilities = await get(CONST + 'hero_abilities.json', true);
const abilityHero = {};
for (const [hero, v] of Object.entries(heroAbilities)) {
  for (const a of v.abilities || []) abilityHero[a] = hero.replace('npc_dota_hero_', '');
}
const itemOk = (k) => {
  const it = items[k];
  if (!it) return false;
  return (it.cost || 0) > 0 || it.tier != null || k === 'ward_observer';
};

const t = {};
for (const [code, name] of Object.entries(LANGS)) {
  t[code] = parse((await get(`${LOC}abilities_${name}.txt`)).replace(/^\uFEFF/, ''));
}

const entries = {};
const PRE = 'dota_tooltip_ability_';
for (const k of Object.keys(t.en)) {
  if (!k.startsWith(PRE) || !k.endsWith('_lore')) continue;
  const key = k.slice(PRE.length, -5);
  const isItem = key.startsWith('item_');
  if (isItem ? !itemOk(key.slice(5)) : !abilityHero[key]) continue;
  const e = { type: isItem ? 'item' : 'ability', name: {} };
  if (!isItem) e.hero = abilityHero[key];
  let ok = true;
  for (const code of Object.keys(LANGS)) {
    const lore = clean(t[code][k]);
    const name = clean(t[code][PRE + key]);
    if (!lore || lore.length < 25 || lore.length > 280 || !name) { ok = false; break; }
    e[code] = lore;
    e.name[code] = name;
  }
  if (ok && e.en !== e.de) entries[key] = e;
}

writeFileSync('lore.json', JSON.stringify({ updated: new Date().toISOString(), entries }));
const n = Object.values(entries);
console.log(`Готово: ${n.length} текстов лора (предметы: ${n.filter((e) => e.type === 'item').length}, умения: ${n.filter((e) => e.type === 'ability').length})`);
