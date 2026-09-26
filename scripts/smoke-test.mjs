#!/usr/bin/env node
/* Смоук-тест: все карточки «Наши работы» открывают лайтбокс с корректным числом фото.
   Запуск: node scripts/smoke-test.mjs  (требует запущенного сервера на :4321)
   Или:   BASE=http://localhost:4321 node scripts/smoke-test.mjs */
import { chromium } from 'playwright';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto(BASE + '/', { waitUntil: 'networkidle' });

const cards = page.locator('.project-card');
const n = await cards.count();
let fail = 0;

console.log(`Карточек на главной: ${n}`);
for (let i = 0; i < n; i++) {
  const card = cards.nth(i);
  const title = (await card.locator('h3').textContent()).trim();
  await card.locator('.project-card__media').click();
  await page.waitForTimeout(250);
  const open = await page.evaluate(() => document.getElementById('lightbox').open);
  const counter = open ? (await page.locator('#lightbox-counter').textContent()).trim() : '—';
  console.log(`${open ? 'OK  ' : 'FAIL'} | ${title} | ${counter}`);
  if (!open) fail++;

  if (open) {
    const src1 = await page.locator('#lightbox-img').getAttribute('src');
    await page.locator('[data-lightbox-next]').click();
    await page.waitForTimeout(200);
    const src2 = await page.locator('#lightbox-img').getAttribute('src');
    if (src1 === src2) {
      console.log('   ПРОБЛЕМА: фото не перелистывается');
      fail++;
    }
    await page.locator('[data-lightbox-close]').click();
    await page.waitForTimeout(150);
  }
}

if (errors.length) console.log('Ошибки JS:', errors);
console.log(fail === 0 ? '=== ВСЕ КАРТОЧКИ ОТКРЫВАЮТСЯ И ЛИСТАЮТСЯ ===' : `=== ПРОБЛЕМ: ${fail} ===`);
await browser.close();
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);