// Оптимизация фото в public/images: даунскейл под реальные размеры на экране + перекодирование в WebP.
// Запуск: node scripts/optimize-images.mjs
// Перед перезаписью оригиналы копируются в .img-backup/ (вне public, попадёт в .gitignore).
import { mkdirSync, readdirSync, statSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const BACKUP = join(ROOT, '.img-backup');

// width — предельная ширина после учёта dpr=2: проекты 1112px, обложки 1090px, герой 1200px.
const RULES = [
  { test: (p) => p.startsWith('images/projects/'), width: 1150, quality: 76 },
  { test: (p) => p.startsWith('images/covers/'), width: 1200, quality: 75 },
  { test: (p) => p.startsWith('images/hero/'), width: 1250, quality: 76 },
];

const MAX_MAE = 8; // среднее абсолютное отклонение байта — порог отката

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (name.endsWith('.webp')) yield p;
  }
}

async function mae(file, buf, opts) {
  const a = await sharp(buf).ensureAlpha().raw().toBuffer();
  const b = await sharp(file).resize(opts).ensureAlpha().raw().toBuffer();
  const n = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.abs(a[i] - b[i]);
  return sum / n;
}

let saved = 0;
const rows = [];

for (const file of walk(PUBLIC)) {
  const rel = relative(PUBLIC, file).split('\\').join('/');
  const rule = RULES.find((r) => r.test(rel));
  if (!rule) continue;

  const before = statSync(file).size;
  const src = await sharp(file).metadata();
  const resize = { width: Math.min(rule.width, src.width ?? rule.width), withoutEnlargement: true, kernel: 'lanczos3' };

  const buf = await sharp(file).resize(resize).webp({ quality: rule.quality, effort: 6 }).toBuffer();

  if (buf.length >= before * 0.95) {
    rows.push({ rel, before, after: before, w: src.width, skipped: 'нет выгоды' });
    continue;
  }

  const diff = await mae(file, buf, resize);

  if (diff > MAX_MAE) {
    rows.push({ rel, before, after: before, w: src.width, skipped: `качество mae=${diff.toFixed(1)}` });
    continue;
  }

  const backupPath = join(BACKUP, rel);
  if (!existsSync(backupPath)) {
    mkdirSync(dirname(backupPath), { recursive: true });
    copyFileSync(file, backupPath);
  }
  writeFileSync(file, buf);
  saved += before - buf.length;
  rows.push({ rel, before, after: buf.length, w: `${src.width}→${resize.width}`, mae: diff.toFixed(1) });
}

const b = rows.reduce((s, r) => s + r.before, 0);
const a = rows.reduce((s, r) => s + r.after, 0);
console.log(`файлов: ${rows.length} | было ${(b / 1024 / 1024).toFixed(1)} МБ → стало ${(a / 1024 / 1024).toFixed(1)} МБ | экономия ${(saved / 1024 / 1024).toFixed(1)} МБ`);
const skipped = rows.filter((r) => r.skipped);
if (skipped.length) {
  console.log(`пропущено: ${skipped.length}`);
  for (const r of skipped.slice(0, 10)) console.log('  ', r.skipped, r.rel);
}
rows.sort((x, y) => (y.before - y.after) - (x.before - x.after));
console.log('топ экономии:');
for (const r of rows.slice(0, 8)) console.log(`  ${Math.round((r.before - r.after) / 1024)}KB  ${r.rel}  ${r.w}  mae=${r.mae ?? '-'}`);
console.log(`бэкап оригиналов: ${BACKUP} (удалить: rm -rf ${relative(ROOT, BACKUP)})`);
