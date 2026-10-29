// 전 케이스 자동 점검: dist/를 띄우고 케이스를 하나씩 열어
//  - 화면 스크립트 오류가 없는지
//  - 화면이 뜨는지(9초 안)
//  - 오른쪽 변경 사항 번호가 화면에 모두 붙는지
// 를 확인한다. 실패하면 종료 코드 1.
// 처음 한 번: npx playwright install chromium
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    const body = await readFile(join(dist, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto(base + '/index.html');
const ids = await page.evaluate(() => CASES.flatMap((c) => (c.states ? c.states.map(([s]) => c.id + '@' + s) : [c.id])));
let fail = 0;
// EN 문구 빠짐 점검: 케이스 · 묶음 · 상태값 · 변경 사항 · 범위 밖 문구가 cases.en.js에 모두 있어야 한다
const noEn = await page.evaluate(() => {
  const all = [...GROUPS.map((g) => g.name), ...CASES.flatMap((c) => [c.t, ...(c.states || []).map((x) => x[1]), ...(c.look || []).map((l) => l[0]), ...(c.note || [])])];
  return [...new Set(all)].filter((t) => !CASES_EN[t]);
});
if (noEn.length) { fail += 1; console.log('✗ EN 문구 없음:', noEn.join(' | ')); }
for (const id of ids) {
  errs.length = 0;
  await page.evaluate((i) => { location.hash = i; }, id);
  const ok = await page.waitForFunction(() => document.getElementById('dev').hasAttribute('data-ready'), null, { timeout: 9000 }).then(() => true, () => false);
  await page.waitForTimeout(1200);
  const want = await page.$$eval('ol.look li[data-go]', (l) => l.map((x) => +x.dataset.go));
  const fr = page.frames().find((f) => /proto\.html/.test(f.url()));
  const got = fr ? await fr.evaluate(() => [...document.querySelectorAll('.dev-mk')].filter((d) => d.style.display !== 'none').map((d) => +d.dataset.n)) : [];
  const miss = want.filter((n) => !got.includes(n));
  const bad = !ok || errs.length || miss.length;
  if (bad) fail += 1;
  console.log(bad ? '✗' : '✓', id, !ok ? '화면 안 뜸' : '', errs.join(' | '), miss.length ? '번호 없음: ' + miss.join(',') : '');
}
await browser.close();
server.close();
console.log(fail ? `실패 ${fail}건` : `전체 ${ids.length}건 통과`);
process.exit(fail ? 1 : 0);
