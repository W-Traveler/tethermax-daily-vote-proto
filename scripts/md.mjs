// 문서용 간단 Markdown → HTML 변환 (build.mjs에서 사용)
// 지원: # ~ ### 제목, 문단, - 목록 · 1. 목록(한 단계 중첩), | 표 |, ``` 코드 블록(mermaid는 <pre class="mermaid">), `코드`, **굵게**
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

export function mdToHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    const fence = l.match(/^```(\w*)/);
    if (fence) {
      const buf = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      i++;
      out.push(fence[1] === 'mermaid' ? `<pre class="mermaid">${esc(buf.join('\n'))}</pre>` : `<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    const h = l.match(/^(#{1,3}) (.+)/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (l.trim().startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++]);
      const head = cells(rows[0]); const body = rows.slice(rows[1] && /^\s*\|[\s:|-]+\|\s*$/.test(rows[1]) ? 2 : 1);
      out.push(`<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const li = l.match(/^(- |\d+\. )(.*)/);
    if (li) {
      const ordered = /\d/.test(li[1][0]); const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(- |\d+\. )(.*)/); const sub = lines[i].match(/^\s{2,}- (.*)/);
        if (m && ((/\d/.test(m[1][0])) === ordered)) { items.push({ t: m[2], sub: [] }); i++; }
        else if (sub && items.length) { items[items.length - 1].sub.push(sub[1]); i++; }
        else break;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map((it) => `<li>${inline(it.t)}${it.sub.length ? `<ul>${it.sub.map((s) => `<li>${inline(s)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3} |```|\||- |\d+\. )/.test(lines[i].trim())) buf.push(lines[i++].trim());
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }
  return out.join('\n');
}
