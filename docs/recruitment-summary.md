# 求职项目成果说明

以下可用于简历、BOSS 直聘项目介绍或 LinkedIn。内容基于个人项目事实；不声称已有企业客户、医院部署、商业收入或真实临床效果。联系方式由作者自行补充。

## A. AI 医疗产品经理版本

**简历项目描述**  
本草云 · 基层中医诊所管理 SaaS MVP｜个人项目。基于中医学背景和基层门诊经验，拆解患者建档、初诊、复诊与随访中的信息连续性问题，定义核心业务闭环、MVP 范围和验收标准。使用 Codex 辅助落地中文 Web 产品与持久化流程，完成第一版核心操作的浏览器验收。下一阶段规划以有来源的病历整理和症状比较为入口，设计医生审核与 AI 质量评测；目前尚未接入模型。

**可展示的能力**

- 从临床流程提出产品假设，控制 MVP 范围，并区分交付、人工验收和规划状态。
- 将随访状态、复诊前序记录、日期一致性转为产品规则和验收用例。
- 在 AI 规划中定义 Golden Case、Bad Case、证据引用与审核机制，不把生成文字当成医疗有效性。

**面试展开**：为什么先做连续记录？为什么不直接做自动诊疗？如何决定 AI 输出何时可采用？

## B. 医疗 AI 解决方案版本

**简历项目描述**  
围绕基层诊所资料分散与复诊追踪需求，将业务操作映射为患者、就诊和随访关系，使用 Next.js、Prisma 与 SQLite 形成可运行 MVP。使用 Codex 辅助实现并检查数据读写、跨页面关联和重启持久化；针对连续提交、重复编号和日期问题迭代交互与写入保护。项目具备自动回归和 CI 记录，展示从需求到可验证技术方案的转译过程，尚未开展真实客户部署。

**可展示的能力**

- 说明业务层、API 与持久化边界，而不是仅列出技术名称。
- 将“刷新后还在”“复诊能找到上次记录”等用户要求转为可执行验证。
- 对客户化部署前的权限、多租户、备份、隐私和数据授权缺口保持明确记录。

**面试展开**：哪些问题是产品设计，哪些是运行环境？从单空间 MVP 到真实诊所试点还缺什么？

## C. AI FDE 版本

**简历项目描述**  
以基层门诊场景为起点，独立组织需求、验收和迭代，使用 Codex 辅助开发本草云管理 MVP。推进中文表单、真实数据库读写、初复诊关联、随访状态及持久化验证；通过日志、HTTP 检查、DOM 与数据库回归定位问题，并建立 CI。最新 v0.1 修复包含提交锁、友好冲突、旧数据保留及日期一致性。当前项目展示场景发现、原型实现、调试和交付的能力，不等同于已拥有客户现场 FDE 落地经历。

**可展示的能力**

- 在业务约束下选择可交付的技术范围，使用 AI 编程工具推进实现并承担结果检查。
- 从错误复现到兼容修复，保留测试证据与未完成项。
- 以 Codex 编程 Agent 辅助开发、以 GitHub Actions 组织自动验证；可说明任务约束、检查和失败反馈，当前没有交付自主医疗 Agent 或多 Agent 系统。
- 清楚说明 AI 只是未来规划，后续需要数据契约、评测集、医生审核和失败回退。

**面试展开**：如何复现重复提交？为什么保留旧重复档案？如何界定自动测试和人工验收各自的责任？

## 可直接使用的短介绍

我有中医学背景和基层门诊工作经验，目前向 AI 医疗产品、医疗 AI 解决方案与 AI FDE 方向转型。我基于患者建档、复诊和随访的实际业务流程设计本草云 MVP，并使用 Codex 辅助开发和验证，重点展示从临床问题到产品规则、技术实现和测试交付的能力。项目已有可运行的业务闭环，AI 辅助复诊仍处于产品规划阶段。

## English summary

I bring a Traditional Chinese Medicine background and primary-care clinical experience, and I am transitioning toward AI healthcare product, solutions and forward-deployed engineering roles. In Bencao Cloud, I define the MVP scope and workflows, use Codex for assisted implementation, and validate patient registration, visits, follow-up tracking and persistence. The project demonstrates clinical workflow translation, product judgment and delivery iteration. It is a personal portfolio MVP, not a commercial deployment; model-based AI assistance is not implemented yet.

## 使用前核对

最新质量修复已有 11 项自动回归和成功 CI，仍需完成 Codespaces 全部人工回归。不要将其改写为“全部浏览器验收完成”，也不要添加未经核实的效率、用户量、营收或客户名单。
