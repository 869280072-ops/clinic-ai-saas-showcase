import { readFile, writeFile, mkdir, rm, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { Marked } from 'marked';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { assertShowcaseRoot, documents, escapeHtml, slug } from './shared.mjs';

await assertShowcaseRoot();
await mkdir('work', { recursive: true });
// This DOM is for parsing Mermaid syntax, not a browser screenshot or render test.
const dom = new JSDOM('<!doctype html><body></body>');
Object.assign(globalThis, { window: dom.window, document: dom.window.document });
const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
const contents = new Map();
let diagramCount = 0;
for (const [source] of documents) {
  const markdown = await readFile(source, 'utf8'); contents.set(source, markdown);
  for (const match of markdown.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
    await mermaid.parse(match[1]); diagramCount++;
  }
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await mkdir('dist/docs', { recursive: true });
for (const [source, target] of [['site/index.html', 'dist/index.html'], ['site/styles.css', 'dist/assets/styles.css'], ['site/mark.svg', 'dist/assets/mark.svg'], ['site/main.js', 'dist/assets/main.js']]) await copyFile(source, target);
await writeFile('dist/.nojekyll', '');

const bundle = await build({ entryPoints: ['site/diagrams.js'], outdir: 'dist/assets', entryNames: 'diagrams', chunkNames: 'diagram-chunks/[name]-[hash]', splitting: true, bundle: true, minify: true, format: 'esm', platform: 'browser', target: ['es2022'], legalComments: 'linked', metafile: true, write: true, logLevel: 'silent' });
// Preserve third-party notices without assigning their licenses to this project.
const packages = new Set();
for (const input of Object.keys(bundle.metafile.inputs)) {
  if (!input.includes('node_modules/')) continue;
  let folder = path.dirname(path.resolve(input));
  while (folder !== path.dirname(folder)) {
    try {
      const pkg = JSON.parse(await readFile(path.join(folder, 'package.json'), 'utf8'));
      if (pkg.name) { packages.add(folder); break; }
    } catch {}
    folder = path.dirname(folder);
  }
}
const notices = ['Third-party notices for the bundled documentation diagram tool.\nThese licenses cover the named dependencies only, not the portfolio as a whole.\n'];
const missingLicenses = [];
for (const folder of [...packages].sort()) {
  const pkg = JSON.parse(await readFile(path.join(folder, 'package.json'), 'utf8'));
  const { readdir } = await import('node:fs/promises');
  const licenseFiles = (await readdir(folder)).filter(name => /^(?:licen[sc]e|copying|notice)(?:\.|$)/i.test(name));
  if (!licenseFiles.length) missingLicenses.push(pkg.name);
  notices.push(`\n===== ${pkg.name} ${pkg.version ?? ''} (${typeof pkg.license === 'string' ? pkg.license : 'see notice'}) =====\n`);
  for (const file of licenseFiles) notices.push(await readFile(path.join(folder, file), 'utf8'));
}
if (missingLicenses.length) throw new Error(`打包依赖缺少许可文件，发布前必须补齐：${missingLicenses.join(', ')}`);
await writeFile('dist/THIRD-PARTY-NOTICES.txt', notices.join('\n'));

const outputBySource = new Map(documents.map(([source, output]) => [source, output]));
let renderedDiagrams = 0;
for (const [source, output, label] of documents) {
  const headings = []; let pageDiagrams = 0;
  const marked = new Marked({ gfm: true });
  const renderer = {
    heading(token) {
      const text = this.parser.parseInline(token.tokens);
      const id = slug(token.text);
      if (token.depth === 2) headings.push([id, token.text]);
      return `<h${token.depth} id="${escapeHtml(id)}">${text}</h${token.depth}>\n`;
    },
    link(token) {
      let href = token.href;
      if (!/^(?:[a-z]+:|\/\/|#)/i.test(href)) {
        const [file, fragment] = href.split('#');
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(source), decodeURIComponent(file)));
        if (outputBySource.has(target)) href = path.posix.relative(path.posix.dirname(output), outputBySource.get(target)) + (fragment ? `#${fragment}` : '');
      }
      if (/^(?:javascript|data):/i.test(href)) throw new Error('不允许不安全链接');
      const external = /^https?:\/\//i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(href)}"${external}>${this.parser.parseInline(token.tokens)}</a>`;
    },
    code(token) {
      if (token.lang === 'mermaid') {
        pageDiagrams++; renderedDiagrams++;
        return `<figure><pre class="mermaid" id="diagram-${renderedDiagrams}">${escapeHtml(token.text)}</pre><details class="mermaid-source"><summary>查看 Mermaid 定义</summary><pre><code>${escapeHtml(token.text)}</code></pre></details></figure>`;
      }
      return `<pre><code>${escapeHtml(token.text)}</code></pre>`;
    },
  };
  marked.use({ renderer });
  let body = marked.parse(contents.get(source));
  body = body.replaceAll('<table>', '<div class="doc-table"><table>').replaceAll('</table>', '</table></div>');
  const sidebar = documents.map(([, target, title]) => `<a href="${escapeHtml(path.posix.relative(path.posix.dirname(output), target))}"${target === output ? ' aria-current="page"' : ''}>${escapeHtml(title)}</a>`).join('');
  const toc = headings.length ? `<details><summary>本页目录</summary><ul>${headings.map(([id, title]) => `<li><a href="#${escapeHtml(id)}">${escapeHtml(title)}</a></li>`).join('')}</ul></details>` : '';
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="本草云作品集：${escapeHtml(label)}。区分已实现、已验证及未来 AI 规划。"><title>${escapeHtml(label)}｜本草云作品集</title><link rel="icon" href="../assets/mark.svg"><link rel="stylesheet" href="../assets/styles.css">${pageDiagrams ? '<script type="module" src="../assets/diagrams.js"></script>' : ''}</head><body><a class="skip-link" href="#main">跳到正文</a><header class="site-header"><div class="header-inner wrap"><a class="brand" href="../index.html"><img src="../assets/mark.svg" width="34" height="38" alt=""><span>本草云<small>PROJECT NOTES</small></span></a><a class="inline-link" href="../index.html#documents">返回作品展示 ↗</a></div></header><main class="doc-layout wrap" id="main"><nav class="doc-sidebar" aria-label="文档导航"><p>PROJECT DOCUMENTS</p>${sidebar}</nav><article class="doc-article">${toc}${pageDiagrams ? '<p class="diagram-note" id="diagram-notice" hidden>图表渲染暂不可用，可展开 Mermaid 定义查看。</p>' : ''}${body}<p class="doc-footer-note">个人作品集 · 当前未接入 AI 模型 · 不包含真实患者资料 · <a href="../THIRD-PARTY-NOTICES.txt">图表工具许可声明</a></p></article></main></body></html>`;
  await writeFile(path.join('dist', output), html);
}

await writeFile('work/build-report.json', JSON.stringify({ checkedMermaidBlocks: diagramCount, builtHtmlPages: documents.length + 1, diagramDependencyPackages: packages.size, screenshotCount: 0, browserVisualQA: 'not performed by this build; see docs/verification.md for separate review', published: false }, null, 2));
dom.window.close();
console.log(`构建通过：${documents.length + 1} 个 HTML 页面，${diagramCount} 个 Mermaid 定义通过语法检查。没有部署或生成系统截图。`);
