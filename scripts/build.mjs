// 빌드: src → dist
//  1) Tailwind(3.4.17) CSS를 만들어 proto.html 안에 넣는다
//  2) index.html에 cases.js(케이스 · 변경 사항 정의)와 cases.en.js(EN 문구)를 넣는다
//  3) public/(글꼴 등)과 lucide 아이콘 스크립트를 복사한다
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const p = (...a) => join(root, ...a);

rmSync(p('dist'), { recursive: true, force: true });
mkdirSync(p('dist/vendor'), { recursive: true });

// 1) Tailwind
const twIn = p('dist/.tw-in.css');
const twOut = p('dist/.tw-out.css');
writeFileSync(twIn, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
const twCli = require.resolve('tailwindcss/lib/cli.js');
execFileSync(process.execPath, [twCli, '-c', p('tailwind.config.js'), '-i', twIn, '-o', twOut, '--minify'], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
const css = readFileSync(twOut, 'utf8');
rmSync(twIn); rmSync(twOut);

const proto = readFileSync(p('src/proto.html'), 'utf8');
if (!proto.includes('/*__TW__*/')) throw new Error('src/proto.html 에 /*__TW__*/ 자리가 없습니다');
writeFileSync(p('dist/proto.html'), proto.replace('/*__TW__*/', () => css));

// 2) 셸
const shell = readFileSync(p('src/index.html'), 'utf8');
if (!shell.includes('/*__CASES__*/')) throw new Error('src/index.html 에 /*__CASES__*/ 자리가 없습니다');
writeFileSync(p('dist/index.html'), shell.replace('/*__CASES__*/', () => readFileSync(p('src/cases.js'), 'utf8') + '\n' + readFileSync(p('src/cases.en.js'), 'utf8')));

// 3) 정적 파일
cpSync(p('public'), p('dist'), { recursive: true });
cpSync(require.resolve('lucide/dist/umd/lucide.min.js'), p('dist/vendor/lucide.min.js'));
if (existsSync(p('assets'))) cpSync(p('assets'), p('dist/assets'), { recursive: true });

console.log(`dist/ 완료 · proto.html ${(Buffer.byteLength(readFileSync(p('dist/proto.html'))) / 1024).toFixed(0)}KB · tailwind ${(css.length / 1024).toFixed(0)}KB`);
