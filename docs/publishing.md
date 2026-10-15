# 展示材料、本地构建与公开发布

这是一套独立的公开作品集资料。网站用于说明产品，不提供患者管理、模型调用或医疗服务。没有复制业务源码、数据、内部环境配置或私有 Git 历史。

## 仓库结构

```text
README.md
docs/                     产品、流程、架构、AI 规划、决策、验证与求职介绍
assets/screenshots/       截图规范；当前没有截图
site/                     静态首页、样式、图标和文档图表脚本
scripts/                  独立展示材料的构建与检查工具
.github/workflows/        GitHub Pages 构建及部署流程
package.json
package-lock.json
```

`node_modules/`、`dist/`、`work/` 为本地依赖、生成输出或审核中间文件，已忽略，不进入源文件提交。GitHub Pages 的部署产物由 `dist/` 单独上传，不需要公开运行环境或业务数据库。

## 本地构建

在这个**展示仓库**的根目录使用 Node.js 24：

```bash
npm ci
npm run check
npm run build
npm test
```

构建将静态首页与文档阅读页输出到 `dist/`。首页使用本地资源，没有外部字体或分析追踪；仅含图表的文档阅读页加载本地打包的 Mermaid。第三方工具的许可声明随构建产物保留，不代表为整个作品集指定开源许可证。

如需在自己的电脑预览，可运行 `python3 -m http.server 8080 --directory dist`，再打开本机对应地址；云端应使用所在平台提供的端口转发入口。本仓库尚未部署，不把本机 localhost 写成在线 Demo。

## 当前发布边界

公开展示仓库已由作者创建：[869280072-ops/clinic-ai-saas-showcase](https://github.com/869280072-ops/clinic-ai-saas-showcase)。本轮复用上一轮已检查的 23 个源文件，按作者授权补充说明与 PR 构建检查；通过 `codex/portfolio-showcase` 分支提交审核，不直接更新或合并到 main。

业务开发仓库始终保持 Private，不复制其源码、配置、数据库或 Git 历史。只向展示仓库提交明确列入清单的文件，不上传 `node_modules/`、`dist/`、`work/`、压缩包、凭据或系统运行日志。不操作无关仓库。

## 提交审核

在展示仓库中检查变更、运行上述构建命令，将审核后的源文件提交到功能分支，并创建以 main 为目标的 Pull Request。若分支已存在，应先核对远端内容，不使用 force 或镜像推送。

本次授权范围为上传与创建 PR，**不会自动合并 PR，也不会在审核前启用或执行 Pages 发布**。有权限创建分支不等于一定有权限写入工作流、创建 PR 或管理 Pages，各项结果分别核对。

## 审核合并后：GitHub Pages

1. 审核 PR 中的文件和构建检查；只在作者确认后合并到 main。
2. 在展示仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 查看 **Actions → Showcase Pages**：PR 只做检查与构建，不上传 Pages 产物、不执行部署；main 推送或 main 上手动触发才允许部署。
4. 若 main 首次运行发生在 Pages 启用之前，启用后在 main 上使用 **Run workflow** 重新执行。需要 Pages 配置或环境审批时，由仓库管理员按 GitHub 提示处理。
5. 确认 build 与 deploy 均成功，再从 Pages 设置或成功部署记录取得真实 HTTPS 地址并打开验证；随后才加入 README、简历或 LinkedIn。

当前未正式部署，没有经过验证的公开网站或业务 Demo 地址。Pages 站点仅展示作品资料，不承载 Next.js、患者数据库或诊疗操作。

## License 与后续截图

当前不添加项目开源许可证，package 标记为 `UNLICENSED` 以避免误发布 npm 包。若作者之后希望开放复用，需要先讨论授权范围并确认 License；第三方声明仅用于相关构建工具的合规归属。

后续截图按 [截图规范](../assets/screenshots/README.md) 检查，使用虚构资料、去除元数据并逐张审核。新增截图、联系方式或站点地址都属于公开材料变更，应更新清单，不自动继承之前的确认。
