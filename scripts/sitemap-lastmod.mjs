// Добавляет <lastmod> в sitemap после сборки — по mtime исходников страницы.
// Исходный public/sitemap.xml не изменяется, правится только dist/client/sitemap.xml.
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_URL = 'https://rsk-garant.ru';
const DIST = join(process.cwd(), 'dist', 'client');
const sitemapPath = join(DIST, 'sitemap.xml');

if (!existsSync(sitemapPath)) {
  console.error('[sitemap-lastmod] dist/client/sitemap.xml не найден');
  process.exit(1);
}

const sharedSources = [
  'src/layouts/BaseLayout.astro',
  'src/data/company.ts',
  'src/data/services.ts',
];

function routeSources(route) {
  const path = route.replace(SITE_URL, '').replace(/\/$/, '');
  const candidates =
    path === ''
      ? ['src/pages/index.astro']
      : [`src/pages${path}/index.astro`, `src/pages${path}.astro`];
  return [...candidates, ...sharedSources].filter((f) => existsSync(f));
}

function lastmod(sources) {
  const times = sources.map((f) => statSync(f).mtimeMs);
  if (times.length === 0) return null;
  return new Date(Math.max(...times)).toISOString().slice(0, 10);
}

const xml = readFileSync(sitemapPath, 'utf8');
let missing = 0;

const out = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block, inner) => {
  const loc = inner.match(/<loc>([^<]+)<\/loc>/);
  if (!loc) return block;
  const date = lastmod(routeSources(loc[1]));
  if (!date) {
    missing++;
    return block;
  }
  if (/<lastmod>/.test(inner)) return block;
  return `<url>${inner.replace(/<\/loc>/, `</loc>\n    <lastmod>${date}</lastmod>`)}</url>`;
});

writeFileSync(sitemapPath, out);
const count = (out.match(/<lastmod>/g) || []).length;
console.log(`[sitemap-lastmod] lastmod добавлен в ${count} URL`);
if (missing > 0) console.warn(`[sitemap-lastmod] источник не найден для ${missing} URL`);
