# X-Windows

X-Windows 是一个借鉴 X iOS 客户端“帖子下沉 + Web 内嵌”交互的开源实验，让访问者在帖子界面里打开迷你 IDE 或惊喜主题，实现“打开源码编辑器”的错位体验。

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000` 即可体验。通过 `?theme=swiftui` 等参数可直接指定主题。

## 主要特性

- SwiftUI / Compose 代码主题：主页采用仿窗口展示，独立路由则呈现真实的编辑器布局。
- Meme 等多媒体主题：支持趣味图片、动画等惊喜内容。
- 平台识别：根据 UA 推荐默认主题，独立路由强制展示移动端视觉。
- 快速分享：独立路由底部提供主题切换、分享按钮和 GitHub 链接。

## 路由说明

- `/`：帖子壳 + 主题列表，可在页面顶部切换主题。
- `/theme/[id]`：仅呈现主题内容，适合嵌入 X 帖子或分享。

## 贡献

欢迎 Fork 仓库（https://github.com/rosuH/X-Windows）并提交主题或改进体验的 PR！
