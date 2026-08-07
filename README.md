# 🎴 极简决策卡 · Minimal Decision Card

> 面向「选择困难症」用户的极简决策互动 Web 应用。核心理念是**做减法**：每次决策只给 2–6 个选项，把决定权交给随机算法，帮你从「最大化者」变成「满足者」（Satisficer）。
>
> A minimal decision-making web app for people with choice paralysis. The philosophy is **subtraction**: every decision offers only 2–6 options, and a weighted random picker makes the call — helping you go from "maximizer" to "satisficer".

![Next.js 15](https://img.shields.io/badge/Next.js%2015-000000?logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=zustand&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)

---

## ✨ 功能特性 · Features

- **预设场景卡片** — 首页 4 个开箱即用的决策场景（吃什么 / 去哪儿 / 花不花钱 / 聚会借口），新粗野主义（Neo-brutalism）风格
  _Preset scene cards_ — 4 ready-to-use decision scenes (what to eat / where to go / whether to buy / party excuse) in a neo-brutalist style.
- **自定义问题** — 「＋ 新建问题」创建自己的决策（自定义标题 + 选项）；任意问题可改标题；自定义问题可删除（预设不可删）
  _Custom questions_ — create your own decisions with a custom title and options; edit any title; delete custom questions (presets are protected).
- **本地持久化** — 所有新建 / 编辑结果自动存入 localStorage，刷新不丢失
  _Local persistence_ — all changes are saved to localStorage automatically and survive refreshes.
- **加权随机抽取** — 按选项权重成比例抽选，权重 0 = 不参与抽取
  _Weighted random pick_ — options are drawn proportionally to their weight; weight 0 excludes an option.
- **3D 翻牌揭晓** — Framer Motion `rotateY` 翻转动画（0.6s ease-out）
  _3D flip-card reveal_ — Framer Motion flip animation.
- **反后悔机制** — 每次决策仅一次「再抽一次」，触发前弹出心理提示
  _Anti-regret mechanism_ — one "reroll" per session, preceded by a gentle nudge.
- **全屏撒花** — 结果揭晓时 canvas-confetti 庆祝
  _Confetti celebration_ — full-screen canvas-confetti on reveal.
- **结果海报导出** — modern-screenshot 一键保存分享图（PNG，2x 高清）
  _Result poster export_ — one-tap shareable PNG via modern-screenshot.
- **PWA** — manifest + 三尺寸图标，可添加到手机主屏幕
  _PWA support_ — manifest + icons (192/512/maskable), installable to the home screen.
- **Android 原生打包** — Capacitor 8 把 Web 应用直接编译为 APK
  _Native Android build_ — package the web app as an APK with Capacitor 8.

## 🛠 技术栈 · Tech Stack

| 层 Layer | 选型 Choice | 说明 Notes |
| --- | --- | --- |
| 框架 Framework | Next.js 15 (App Router) + React 19 + TypeScript | 纯客户端 SPA，`output: "export"` 静态导出 Client-only SPA with static export |
| 样式 Styling | Tailwind CSS v4 | CSS-first 配置，`@theme` 新粗野主义设计 token CSS-first neo-brutalist design tokens |
| 动效 Animation | framer-motion | 3D 翻牌、提示横幅进出场 3D card flip & banner transitions |
| 状态/存储 State | zustand + localStorage | 模板库全局状态，刷新不丢失 template store, persisted locally |
| 特效 Effects | canvas-confetti | 揭晓撒花 Cannon-mode confetti |
| 海报 Poster | modern-screenshot | 分享图 PNG 导出 shareable PNG export |
| PWA | manifest + icons | 添加到主屏幕 add to home screen |
| 原生打包 Native | Capacitor 8.5 (Android) | 静态产物直接打包 APK builds APK from static export |

## 🚀 快速开始 · Getting Started

需要 Node.js ≥ 18.18（推荐 20+）。Requirements: Node.js ≥ 18.18 (20+ recommended).

```bash
npm install
npm run dev
```

打开 http://localhost:3000（建议用 DevTools 手机模拟器验证移动端布局）。
Open http://localhost:3000 (use DevTools mobile emulation or a real phone to verify the mobile layout).

**构建静态产物 / Build static export:**

```bash
npm run build   # 输出到 out/ · outputs to out/
```

> 自接入 Capacitor 起启用 `output: "export"`，`next start` 不再可用；本地预览静态产物用 `npx serve out`。
> Since Capacitor was added, `output: "export"` is enabled, so `next start` no longer works; preview the static build with `npx serve out`.

## 📱 Android 打包（Capacitor）· Android Build

`next.config.ts` 已配置 `output: "export"`（产物在 `out/`），与 `capacitor.config.json` 的 `webDir: "out"` 对应。前提：Node ≥ 20、Android Studio + Android SDK。
`next.config.ts` uses `output: "export"` (outputs to `out/`), matching `webDir: "out"` in `capacitor.config.json`. Prerequisites: Node ≥ 20, Android Studio + Android SDK.

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "极简决策卡" "com.decisioncard.app" --web-dir out   # 可选，配置文件已存在 · optional, config already exists
npm install @capacitor/android
npm run build          # 生成 out/ · generates out/
npx cap add android    # 首次生成 android/ 原生工程 · creates the android/ project
npx cap sync android   # 同步 out/ 到原生工程 · copies out/ into the native project
npx cap open android   # 在 Android Studio 中构建 · build in Android Studio
```

或命令行直接构建 / or build from the command line:

```powershell
cd android
.\gradlew.bat assembleDebug
```

- **APK 产物 / Output**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **SDK 版本 / SDK levels**: `minSdk 24 / targetSdk 36 / compileSdk 36`（Gradle 8.14.3）
- **版本号 / Version**: `versionCode 1 / versionName "1.0"` 在 `android/app/build.gradle` 中维护 · maintained in `android/app/build.gradle`

**网络说明 / Network notes**: 官方源（services.gradle.org / dl.google.com）在某些网络下会超时。项目已内置镜像方案：`android/build.gradle` 的仓库前置了阿里云 Maven 镜像；Gradle 发行版可改从腾讯云镜像（`mirrors.cloud.tencent.com/gradle/`）下载放入 `%USERPROFILE%\.gradle\wrapper\dists\gradle-8.14.3-all\`；SDK platform 缺失时可用 `mirrors.cloud.tencent.com/AndroidSDK/` 手动安装。已在本机验证构建成功。
If the official sources (services.gradle.org / dl.google.com) time out, mirrors are pre-configured: Aliyun Maven mirrors are prepended in `android/build.gradle`; the Gradle distribution can be fetched from Tencent Cloud (`mirrors.cloud.tencent.com/gradle/`) into the wrapper dists folder; missing SDK platforms can be installed from `mirrors.cloud.tencent.com/AndroidSDK/`. A debug build has been verified on this machine.

## 📁 目录结构 · Project Structure

```
minimal-decision-card/
├── package.json
├── next.config.ts          # output: "export" 静态导出 → out/
├── capacitor.config.json   # Capacitor 配置（appId / appName / webDir: out）
├── postcss.config.mjs      # Tailwind v4 PostCSS 插件 · plugin
├── tsconfig.json           # 路径别名 · path alias @/* → src/*
└── src/
    ├── app/
    │   ├── globals.css     # @theme 新粗野主义设计 token · design tokens
    │   ├── layout.tsx      # 根布局：viewport / 安全区 / 字体 · root layout
    │   ├── page.tsx        # 首页：场景卡片 + 新建问题入口 · home: scene cards
    │   └── decide/
    │       └── page.tsx    # 决策页 /decide?t=<id>：翻牌抽取流程 · decision flow
    ├── components/
    │   ├── NeoButton.tsx   # 基础按钮（硬阴影 + 按压反馈）
    │   ├── NeoCard.tsx     # 基础卡片容器 · card container
    │   ├── SceneCard.tsx   # 场景入口卡片 + ✎ 编辑入口
    │   ├── FlipCard.tsx    # 3D 翻牌组件 · 3D flip card
    │   ├── DecisionBoard.tsx # 抽取流程编排（状态机 + 反后悔 + 撒花）
    │   ├── TemplateEditorDrawer.tsx # 编辑/新建抽屉：标题 + 选项 + 权重
    │   └── ResultPoster.tsx   # 结果海报导出 · poster export
    ├── store/
    │   └── templateStore.ts # Zustand 模板库（localStorage 持久化 + 水合）
    ├── public/
    │   ├── manifest.json     # PWA manifest
    │   └── icons/            # 192 / 512 / maskable 图标 · icons
    └── lib/
        ├── cn.ts           # class 拼接工具 · classnames helper
        ├── id.ts           # 通用 id 生成 · id generator
        ├── types.ts        # DecisionTemplate / DecisionOption 类型 · types
        ├── random.ts       # 加权随机 pickWeighted · weighted random pick
        └── templates.ts    # 预设模板库 · preset templates
```

## 🗺 开发路线 · Roadmap

- [x] 阶段一 · Phase 1：项目骨架 + 新粗野主义 UI · skeleton & neo-brutalist UI
- [x] 阶段二 · Phase 2：加权随机 + Zustand 模板库（增删改 + localStorage 持久化）· weighted pick + template store with CRUD & persistence
- [x] 阶段三 · Phase 3：3D 翻牌 + 撒花（Web Audio 合成音效待接入 · synth sound effects pending）
- [x] 阶段四 · Phase 4：结果海报导出（Web Share API 分享与真实二维码待接入 · sharing & real QR code pending）
- [x] PWA：manifest + 图标 + iOS meta（离线缓存 Service Worker 待接入 · offline Service Worker pending）
- [x] Android 打包 · Android packaging：Capacitor 8 + APK 构建验证 · build verified

## 📝 备注 · Notes

- Tailwind v4 使用 CSS-first 配置（`globals.css` 的 `@theme`），无需 `tailwind.config.js`。Tailwind v4 is CSS-first (`@theme` in `globals.css`); no `tailwind.config.js` needed.
- 标题字体 Space Grotesk 本地优先，未引入 Google Fonts 网络依赖，避免离线构建失败。Fonts are local-first (Space Grotesk), no Google Fonts network dependency.
- `DecidePage` 通过 `useSearchParams` 读取模板 id（需 Suspense 边界），无效 id 自动回退第一个模板。`DecidePage` reads the template id via `useSearchParams` (inside a Suspense boundary); invalid ids fall back to the first template.
- 图标由 `scripts/gen-icons.ps1`（PowerShell + System.Drawing）生成，可重新生成。Icons are generated by `scripts/gen-icons.ps1`.

## 📄 许可证 · License

本项目暂未添加开源许可证。Currently no open-source license has been added to this project.
