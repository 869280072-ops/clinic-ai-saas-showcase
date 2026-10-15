# 求职项目成果说明

以下可用于简历、BOSS 直聘项目介绍或 LinkedIn。内容基于个人项目事实；不声称已有企业客户、医院部署、商业收入或真实临床效果。联系方式由作者自行补充。

**可直接体验交付成果：** [Railway SaaS Demo](https://melodious-nurturing-production-d07f.up.railway.app/demo) · [GitHub Pages 作品集](https://869280072-ops.github.io/clinic-ai-saas-showcase/)。无需 GitHub 登录，仅限虚构资料；访客独立空间约 4 小时有效，不得输入真实患者信息。AI 模型尚未接入，不用于真实诊疗或正式商用。公开仓库只含展示资料，不含 SaaS 业务源码。

## A. AI 医疗产品经理版本

**简历项目描述**  
本草云 · 基层中医诊所管理 SaaS MVP｜个人项目。基于中医学背景和基层门诊经验，拆解患者建档、初诊、复诊与随访中的信息连续性问题，定义核心业务闭环、MVP 范围和验收标准。使用 Codex 辅助落地中文 Web 产品，推进独立演示环境部署，并人工验收公网核心流程、刷新保留与基础双向访客隔离。下一阶段规划有来源的病历整理、症状比较、医生审核与质量评测；目前没有接入 AI 模型。

**可展示的能力**

- 从临床流程提出产品假设，控制 MVP 范围，并区分交付、人工验收和规划状态。
- 将随访状态、复诊前序记录、日期一致性转为产品规则和验收用例。
- 在 AI 规划中定义 Golden Case、Bad Case、证据引用与审核机制，不把生成文字当成医疗有效性。

**面试展开**：为什么先做连续记录？为什么不直接做自动诊疗？如何决定 AI 输出何时可采用？

## B. 医疗 AI 解决方案版本

**简历项目描述**  
围绕基层诊所资料分散与复诊追踪需求，将业务操作映射为患者、就诊和随访关系，使用 Codex 辅助实现 Next.js、Prisma 与 SQLite MVP，并在 Railway 部署独立演示环境。人工核对公网建档、初诊、历史、复诊、随访结果与状态、刷新保留和基础双向隔离；针对重复提交、编号和日期问题保留自动回归及专项待办。展示从需求到可体验技术方案的转译过程，尚未开展真实客户部署。

**可展示的能力**

- 说明业务层、API 与持久化边界，而不是仅列出技术名称。
- 将“刷新后还在”“复诊能找到上次记录”等用户要求转为可执行验证。
- 对客户化部署前的权限、多租户、备份、隐私和数据授权缺口保持明确记录。

**面试展开**：哪些问题是产品设计，哪些是运行环境？从单空间 MVP 到真实诊所试点还缺什么？

## C. AI FDE 版本

**简历项目描述**  
以基层门诊场景为起点，独立组织需求、验收和迭代，使用 Codex 辅助开发本草云管理 MVP，通过 HTTP、DOM、数据库回归与 CI 检查交付结果。推进独立 Railway Demo 部署及公网人工验收，让访问者无需 GitHub 登录即可操作虚构患者、初复诊与随访。既有 v0.1 修复包含提交锁、友好冲突、旧数据保留及日期一致性。展示场景发现、调试验证与云端交付能力，不声称独立手写全部代码或拥有真实客户现场 FDE 经历。

**可展示的能力**

- 在业务约束下选择可交付的技术范围，使用 AI 编程工具推进实现并承担结果检查。
- 从错误复现到兼容修复，保留测试证据与未完成项。
- 以 Codex 编程 Agent 辅助开发、以 GitHub Actions 组织自动验证；可说明任务约束、检查和失败反馈，当前没有交付自主医疗 Agent 或多 Agent 系统。
- 清楚说明 AI 只是未来规划，后续需要数据契约、评测集、医生审核和失败回退。

**面试展开**：如何复现重复提交？为什么保留旧重复档案？如何界定自动测试和人工验收各自的责任？

## 可直接使用的短介绍

我有中医学背景和基层门诊工作经验，目前向 AI 医疗产品、医疗 AI 解决方案与 AI FDE 方向转型。我基于真实门诊流程定义本草云 MVP，使用 Codex 辅助开发、检查与迭代，并推进云端演示部署和人工验收。招聘方可在线使用虚构资料体验建档、初诊、复诊和随访，查看从临床需求到可交付产品的过程。AI 辅助复诊仍处于规划阶段，我不将其描述为模型研发或已上线医疗 AI 能力。

## English summary

I bring a Traditional Chinese Medicine background and primary-care experience. In Bencao Cloud, I define the MVP scope and workflows, use Codex for assisted implementation, and deliver a separate Railway demo for fictional-data walkthroughs without a GitHub login. I have manually verified public core flows, refresh retention and basic visitor isolation. This demonstrates clinical workflow translation, product judgment, validation and delivery iteration, not commercial deployment or full security certification. Model-based AI assistance is not implemented.

## 使用前核对

公网核心流程的人工验收不等于全部浏览器路径验收。约四小时到期清理、公网服务重启后的持久化、长期稳定性、完整安全审计与真实诊所使用效果仍未完全验证；既有公开摘要的 11 项自动回归与 CI 记录不代表本轮重新核定了私有代码。质量修复专项人工回归仍需补全，不添加未经核实的效率、用户量、营收或客户名单。
