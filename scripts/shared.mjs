import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const documents = [
  ['README.md', 'docs/overview.html', '项目总览'],
  ['docs/product-features.md', 'docs/product-features.html', '产品功能'],
  ['docs/workflow.md', 'docs/workflow.html', '业务流程'],
  ['docs/architecture.md', 'docs/architecture.html', '产品与技术架构'],
  ['docs/product-decisions.md', 'docs/product-decisions.html', '产品决策与 FDE'],
  ['docs/ai-roadmap.md', 'docs/ai-roadmap.html', 'AI 产品规划（未实现）'],
  ['docs/verification.md', 'docs/verification.html', '验证记录'],
  ['docs/recruitment-summary.md', 'docs/recruitment-summary.html', '求职项目介绍'],
  ['docs/publishing.md', 'docs/publishing.html', '展示与发布说明'],
  ['assets/screenshots/README.md', 'docs/screenshots.html', '截图规范与占位'],
];
export const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const slug = value => value.replace(/<[^>]+>/g, '').replace(/[*`_]/g, '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
export async function walk(root, ignored = new Set()) {
  const result = [];
  for (const item of await readdir(root, { withFileTypes: true })) {
    if (ignored.has(item.name)) continue;
    const file = path.join(root, item.name);
    if (item.isSymbolicLink()) throw new Error(`不允许符号链接：${file}`);
    if (item.isDirectory()) result.push(...await walk(file, ignored));
    else result.push(file.split(path.sep).join('/'));
  }
  return result.sort();
}
export async function assertShowcaseRoot() {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  if (pkg.name !== 'clinic-ai-saas-showcase') throw new Error('请在独立 showcase 目录运行，不能在业务仓库运行。');
}
