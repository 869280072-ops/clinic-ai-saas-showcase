import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
import { assertShowcaseRoot, documents, slug, walk } from './shared.mjs';

await assertShowcaseRoot();
const sources = (await walk('.', new Set(['node_modules', 'dist', 'work', '.git']))).map(file => file.replace(/^\.\//, ''));
const required = ['README.md', ...documents.map(([source]) => source), 'site/index.html', 'site/styles.css', 'package.json', 'package-lock.json', '.github/workflows/pages.yml'];
for (const file of required) await access(file);
const sensitiveNames = /(?:^|\/)(?:\.env(?:\..*)?|\.git)(?:$|\/)|\.(?:db|sqlite|sqlite3)(?:-|$)|\.(?:pem|key|p12|pfx)$|\.(?:prisma|sql|tsx|ts)$/i;
const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['GitHub credential', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['API credential', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{30,}\b/],
  ['cloud credential', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['credential URL', /https?:\/\/[^\s/@:]+:[^\s/@]+@/],
  ['private repository link', /https?:\/\/github\.com\/869280072-ops\/clinic-ai-saas(?:\/|[\s)"']|$)/],
  ['internal absolute path', /\/(?:workspace|workspaces|home)\/[^\s"'`]+/],
];
const findings = [];
for (const file of sources) {
  if (sensitiveNames.test(file)) findings.push({ file, kind: 'sensitive or private implementation filename' });
  const content = await readFile(file, 'utf8');
  for (const [kind, pattern] of patterns) if (pattern.test(content)) findings.push({ file, kind });
}
if (sources.some(file => /^LICENSE(?:\.|$)/i.test(path.basename(file)))) findings.push({ file: 'LICENSE', kind: 'project license requires separate confirmation' });
if (findings.length) throw new Error(JSON.stringify({ findings }, null, 2));

let markdownLinks = 0;
for (const file of sources.filter(file => file.endsWith('.md'))) {
  const text = await readFile(file, 'utf8');
  for (const match of text.matchAll(/!?\[[^\]]+\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:)/.test(href)) continue;
    const [target, fragment] = href.split('#');
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(target || path.posix.basename(file))));
    if (!sources.includes(resolved)) throw new Error(`Markdown 链接不存在：${file} -> ${href}`);
    if (fragment && resolved.endsWith('.md')) {
      const targetText = await readFile(resolved, 'utf8');
      const ids = [...targetText.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match => slug(match[1]));
      if (!ids.includes(decodeURIComponent(fragment))) throw new Error(`Markdown 锚点不存在：${file} -> ${href}`);
    }
    markdownLinks++;
  }
}
for (const file of ['README.md', 'docs/ai-roadmap.md', 'site/index.html']) {
  const content = await readFile(file, 'utf8');
  if (!/(?:尚未实现|未实现|未接入|没有接入)/.test(content)) throw new Error(`${file} 必须明确 AI 未实现`);
}
const screenshotFiles = sources.filter(file => /^assets\/screenshots\//.test(file) && !file.endsWith('.md'));
if (screenshotFiles.length) throw new Error('新增截图需要逐张人工脱敏与公开确认；当前清单约定没有截图。');

const built = [];
if (process.argv.includes('--built')) {
  const outputFiles = (await walk('dist')).map(file => file.replace(/^dist\//, ''));
  let localLinks = 0;
  const parsed = new Map();
  for (const file of outputFiles.filter(file => file.endsWith('.html'))) parsed.set(file, new JSDOM(await readFile(path.join('dist', file), 'utf8')));
  for (const [file, dom] of parsed) {
    if (dom.window.document.querySelector('form')) throw new Error('展示网站不能包含患者输入表单');
    for (const element of dom.window.document.querySelectorAll('[href],[src]')) {
      const href = element.getAttribute('href') ?? element.getAttribute('src');
      if (!href || href === '#') throw new Error(`无效按钮或链接：${file}`);
      if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
      if (/^\//.test(href)) throw new Error(`Pages 子路径不兼容：${file} -> ${href}`);
      const [target, fragment] = href.split('#');
      const resolved = target ? path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(target))) : file;
      if (!outputFiles.includes(resolved)) throw new Error(`静态链接不存在：${file} -> ${href}`);
      if (fragment && parsed.has(resolved) && !parsed.get(resolved).window.document.getElementById(decodeURIComponent(fragment))) throw new Error(`静态锚点不存在：${file} -> ${href}`);
      localLinks++;
    }
  }
  for (const dom of parsed.values()) dom.window.close();
  for (const file of outputFiles) {
    const content = await readFile(path.join('dist', file));
    for (const [kind, pattern] of patterns) if (pattern.test(content.toString())) throw new Error(`生成站点包含敏感内容 ${kind}: ${file}`);
    built.push({ file, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex') });
  }
  console.log(`静态站点检查通过：${parsed.size} 页、${localLinks} 个本地链接/锚点。`);
}

const manifest = [];
for (const file of sources) {
  const buffer = await readFile(file);
  manifest.push({ file, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex') });
}
await mkdir('work', { recursive: true });
const report = { sourceFiles: manifest, generatedSiteFiles: built, sensitiveFindings: [], markdownLinksChecked: markdownLinks, screenshotFiles: 0, projectLicenseAdded: false, publicationApproved: false, published: false, reviewLimit: 'Static/DOM/link and pattern checks only; separate browser review is recorded in docs/verification.md; no proof of clinical efficacy.' };
await writeFile('work/publication-manifest.json', JSON.stringify(report, null, 2));
console.log(`公开候选检查通过：${sources.length} 个源文件，${markdownLinks} 个 Markdown 内部链接；未发现已识别敏感格式。尚未公开。`);
