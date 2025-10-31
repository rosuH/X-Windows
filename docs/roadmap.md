# X-Windows 开发路线图

## 里程碑

### M0 · 项目奠基（第 0-1 周）

- [x] 初始化 Next.js 16 + TypeScript + Tailwind 工程，配置 ESLint、Prettier、Husky。
- [x] 搭建基础路由结构：`/` 帖子容器、`/theme/[id]` 动态路由。
- [x] 实现主题注册中心与示例主题（SwiftUI/Compose/Meme）。
- [x] 接入 Vercel Analytics，补充 `.env.example`、`vercel.json` 与一键部署按钮。

### M1 · 核心体验（第 2-3 周）

- [ ] 完成 SwiftUI 代码主题：EditorChrome、代码高亮、平台自适应内容。
- [ ] 完成 Compose 代码主题：Android Studio 视觉、代码段切换。
- [ ] 实现主题列表 UI、平台自动识别与手动切换逻辑。
- [ ] 引入 Framer Motion，模拟 X iOS “页面下沉 + Web 面板” 动画。

### M2 · 多媒体与分享（第 4-5 周）

- [ ] 新增 Meme、Lottie、视频主题，抽象 MediaFrame。
- [ ] 设计分享路由（`?theme=...&platform=...`）与 OG 图生成。
- [ ] 集成简单的主题访问统计面板。
- [ ] 完善响应式布局，优化桌面端体验。

### M3 · 社区协作（第 6+ 周）

- [ ] 发布贡献指南、PR 模板、主题投稿说明。
- [ ] 上线主题请求/投票流程，支持外部数据源（Sheet、Notion）。
- [ ] 规划原生嵌入实验（Capacitor/Expo 或 iOS Swift 桥接）。
- [ ] 推出官方主题精选，定期在社区分享。

## 开发任务拆解

- **工程初始化**：`pnpm` 管理、Git Hooks、环境变量模板。
- **主题系统**：定义 `ThemeDefinition` 接口、注册表、渲染器。
- **UI Shell**：构建 X 风格帖子框架、顶部状态栏、操作栏。
- **动画层**：封装页面过渡、主题切换动画。
- **分析与日志**：统一事件上报 API、隐私合规策略。
- **部署脚本**：Vercel/Cloudflare 配置、GitHub Actions 自动化。

## 协作流程

- **Issue 标签建议**
  - `type:feature`：功能开发需求
  - `type:bug`：缺陷反馈
  - `type:theme`：主题投稿/迭代
  - `good first issue`：适合新人上手的小任务

- **模板草案**
  - `Bug Report`：复现步骤、期望行为、截图/日志。
  - `Feature Request`：问题动机、提议方案、备选方案。
  - `Theme Proposal`：主题名称、目标平台、展示素材、互动设计。

- **贡献指南**
  - 统一在 `CONTRIBUTING.md` 中说明分支策略、代码规范、测试要求。
  - 提供主题开发教程：创建文件、引入资源、测试与提交。
  - 鼓励提交 Demo 截图或屏幕录制，便于审核。

## 推广行动

- 发布项目博客/推文介绍灵感、演示视频。
- 设计开源社交卡片、在 README 嵌入 Star/Fork 徽章。
- 规划 Hackathon/社区活动，邀请开发者提交主题。

