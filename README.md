<div align="center">

# 🎴 极简决策卡 · Minimal Decision Card

**面向「选择困难症」的极简决策互动应用 — 把决定权交给随机算法**

**A minimal decision-making web app for choice paralysis — let the picker decide**

<br/>

![Next.js 15](https://img.shields.io/badge/Next.js%2015-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square&logo=zustand&logoColor=white)
![Capacitor 8](https://img.shields.io/badge/Capacitor%208-119EFF?style=flat-square&logo=capacitor&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Static Export](https://img.shields.io/badge/Static%20Export-000000?style=flat-square&logo=vercel&logoColor=white)
![version 0.1.0](https://img.shields.io/badge/version-0.1.0-22C55E?style=flat-square)

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvibecoding-lab-yangxijia%2Fminimal-decision-card)

**🌐 选择语言 · Choose Language** &nbsp;·&nbsp; [<code>🇬🇧 English</code>](#en) &nbsp;·&nbsp; [<code>🇨🇳 中文</code>](#zh)

</div>

<a id="en"></a>
<details>
<summary><b>🇬🇧 English</b> — 点击展开 · click to expand</summary>

## 🧭 About

**Minimal Decision Card** helps you **stop overthinking**. The core philosophy is **subtraction**:

- **Only 2–6 options per decision** — too many choices are the real source of stress
- **Weighted random pick** — give each option a weight and let the algorithm make the final call
- **One decision, one flip** — a 3D flip card reveals the result, backed by an anti-regret reroll and full-screen confetti

Go from *maximizer* to *satisficer* — decisions don't have to be perfect, they just have to be **done**.

## ✨ Features

| Icon | Feature | Description |
| :---: | :--- | :--- |
| 🏠 | Preset scene cards | 4 ready-to-use scenes: what to eat / where to go / whether to buy / party excuse |
| ➕ | Custom questions | Custom title + options + weights; edit any title; delete custom questions (presets are protected) |
| 💾 | Local persistence | Zustand + localStorage — everything survives refreshes |
| 🎲 | Weighted random pick | Options are drawn proportionally to weight; weight 0 excludes an option |
| 🃏 | 3D flip-card reveal | Framer Motion flip animation (0.6s ease-out) |
| 🛡️ | Anti-regret mechanism | One reroll per decision, preceded by a gentle psychological nudge |
| 🎉 | Full-screen confetti | canvas-confetti celebration on reveal |
| 🖼️ | Result poster export | One-tap 2x HD shareable PNG via modern-screenshot |
| 📱 | PWA | manifest + three icon sizes, installable to the home screen |
| 🤖 | Native Android | Capacitor 8 compiles the static export into an APK |

## 🛠️ Tech Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Client-only SPA, static export |
| Styling | Tailwind CSS v4 | CSS-first config, neo-brutalist design tokens |
| Animation | framer-motion | 3D card flip & banner transitions |
| State | zustand + localStorage | Global template store, persisted locally |
| Effects | canvas-confetti | Cannon-mode confetti |
| Poster | modern-screenshot | PNG shareable export |
| PWA | manifest + icons | Add to home screen |
| Native | Capacitor 8.5 (Android) | APK built from static export |

## 🚀 Getting Started

> **Requirements**: Node.js ≥ 18.18 (20+ recommended)

```bash
npm install
npm run dev        # dev mode → http://localhost:3000
```

Open http://localhost:3000 (use DevTools mobile emulation to verify the mobile layout).

**Build the static export:**

```bash
npm run build      # outputs to out/
npx serve out      # preview the static build locally
```

> Since Capacitor was added, static export is enabled, so `next start` no longer works; preview the static build with `npx serve out` (or `node scripts/serve-out.js`, which includes SPA route fallback).

## 📱 Android Build

The static export outputs to `out/`, matching `webDir: "out"` in `capacitor.config.json`.

**Prerequisites**: Node ≥ 20, Android Studio + Android SDK.

```bash
npm install @capacitor/core @capacitor/cli    # optional: config already exists
npx cap init "极简决策卡" "com.decisioncard.app" --web-dir out   # optional
npm install @capacitor/android
npm run build                                  # generates out/
npx cap add android                            # creates the android/ project
npx cap sync android                           # copies out/ into the native project
npx cap open android                           # build in Android Studio
```

Or build from the command line:

```powershell
cd android
.\gradlew.bat assembleDebug
```

- **APK output**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **SDK levels**: minSdk 24 / targetSdk 36 / compileSdk 36 (Gradle 8.14.3)
- **Version**: `versionCode 1 / versionName "1.0"` maintained in `android/app/build.gradle`

**Network notes**: official sources (services.gradle.org / dl.google.com) may time out on some networks. The project ships with mirrors: Aliyun Maven mirrors are prepended in `android/build.gradle`; the Gradle distribution can be fetched from Tencent Cloud (`mirrors.cloud.tencent.com/gradle/`) into `%USERPROFILE%\.gradle\wrapper\dists\gradle-8.14.3-all\`; missing SDK platforms can be installed from `mirrors.cloud.tencent.com/AndroidSDK/`. A debug build has been verified on this machine.

## 📡 PWA Support

- `public/manifest.json` + `public/icons/` (192 / 512 / maskable)
- iOS meta configured (viewport / theme-color in `src/app/layout.tsx`)
- Pending: offline caching Service Worker

## 📁 Project Structure

```text
minimal-decision-card/
├── package.json
├── next.config.ts            # output: "export" → out/
├── capacitor.config.json     # appId / appName / webDir: out
├── postcss.config.mjs        # Tailwind v4 PostCSS plugin
├── tsconfig.json             # path alias @/* → src/*
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # 192 / 512 / maskable icons
├── scripts/
│   ├── gen-icons.ps1         # icon generator (PowerShell + System.Drawing)
│   └── serve-out.js          # local static preview server (SPA fallback)
└── src/
    ├── app/
    │   ├── globals.css       # @theme neo-brutalist design tokens
    │   ├── layout.tsx        # root layout: viewport / safe area / fonts
    │   ├── page.tsx          # home: scene cards + create entry
    │   └── decide/
    │       └── page.tsx      # /decide?t=<id>: flip-card decision flow
    ├── components/
    │   ├── NeoButton.tsx     # base button (hard shadow + press feedback)
    │   ├── NeoCard.tsx       # base card container
    │   ├── SceneCard.tsx     # scene entry card + edit entry
    │   ├── FlipCard.tsx      # 3D flip card component
    │   ├── DecisionBoard.tsx # flow orchestration (state machine + anti-regret + confetti)
    │   ├── TemplateEditorDrawer.tsx  # create/edit drawer: title + options + weights
    │   └── ResultPoster.tsx  # result poster export
    ├── store/
    │   └── templateStore.ts  # Zustand template store (localStorage + hydration)
    └── lib/
        ├── cn.ts             # classnames helper
        ├── id.ts             # id generator
        ├── types.ts          # DecisionTemplate / DecisionOption types
        ├── random.ts         # weighted random pick (pickWeighted)
        └── templates.ts      # preset templates
```

> The `android/` directory is generated by Capacitor and is not source code.

## 🗺️ Roadmap

- [x] **Phase 1** Project skeleton + neo-brutalist UI
- [x] **Phase 2** Weighted random pick + Zustand template store (CRUD + localStorage persistence)
- [x] **Phase 3** 3D flip card + confetti (Web Audio synth sound effects pending)
- [x] **Phase 4** Result poster export (Web Share API sharing & real QR code pending)
- [x] **PWA** manifest + icons + iOS meta (offline Service Worker pending)
- [x] **Android** Capacitor 8 + verified APK build

## 📝 Notes

- Tailwind v4 is CSS-first (`@theme` in `globals.css`); no `tailwind.config.js` needed
- The heading font (Space Grotesk) is local-first — no Google Fonts network dependency, so offline builds never fail
- `DecidePage` reads the template id via `useSearchParams` (inside a Suspense boundary); invalid ids fall back to the first template
- Icons are generated by `scripts/gen-icons.ps1` (PowerShell + System.Drawing) and can be regenerated

## 🤝 Contributing

Issues and PRs are welcome! Please keep the code style consistent (Prettier + TypeScript strict) and add proper type definitions for new features.

## 📄 License

No open-source license has been added to this project yet.

</details>

<br/>

<a id="zh"></a>
## 🧭 项目简介 · About

「极简决策卡」是一张帮你**停止纠结**的卡片。核心理念是**做减法**：

- **每次只面对 2–6 个选项** —— 选择过多本身就是压力的来源
- **加权随机抽取** —— 给每个选项设置权重，把最终决定权交给随机算法
- **一次决策，一次翻牌** —— 3D 翻牌揭晓结果，配合反后悔「再抽一次」与全屏撒花

帮助你从「最大化者（Maximizer）」变成「满足者（Satisficer）」—— 决策不必完美，**完成就好**。

## ✨ 功能特性 · Features

| 图标 | 特性 | 说明 |
| :---: | :--- | :--- |
| 🏠 | 预设场景卡片 | 4 个开箱即用的场景：吃什么 / 去哪儿 / 花不花钱 / 聚会借口 |
| ➕ | 自定义问题 | 自定标题 + 选项 + 权重；可修改任意标题，自定义问题可删除（预设受保护） |
| 💾 | 本地持久化 | Zustand + localStorage，数据刷新不丢失 |
| 🎲 | 加权随机抽取 | 按权重成比例抽选；权重为 0 的选项不参与 |
| 🃏 | 3D 翻牌揭晓 | Framer Motion 翻转动画（0.6s ease-out） |
| 🛡️ | 反后悔机制 | 每次决策仅一次「再抽一次」，触发前弹出心理提示 |
| 🎉 | 全屏撒花 | canvas-confetti 庆祝揭晓 |
| 🖼️ | 结果海报导出 | modern-screenshot 一键保存 2x 高清分享图（PNG） |
| 📱 | PWA | manifest + 三尺寸图标，可添加到手机主屏幕 |
| 🤖 | Android 原生打包 | Capacitor 8 将静态产物直接编译为 APK |

## 🛠️ 技术栈 · Tech Stack

| 层 Layer | 选型 Choice | 说明 Notes |
| --- | --- | --- |
| 框架 Framework | Next.js 15（App Router）+ React 19 + TypeScript | 纯客户端 SPA，静态导出 |
| 样式 Styling | Tailwind CSS v4 | CSS-first 配置，新粗野主义设计 token |
| 动效 Animation | framer-motion | 3D 翻牌、横幅进出场动画 |
| 状态 State | zustand + localStorage | 模板库全局状态，持久化不丢失 |
| 特效 Effects | canvas-confetti | 揭晓撒花 Cannon-mode confetti |
| 海报 Poster | modern-screenshot | 分享图 PNG 导出 |
| PWA | manifest + icons | 添加到手机主屏幕 |
| 原生 Native | Capacitor 8.5（Android） | 静态产物直接打包 APK |

## 🚀 快速开始 · Getting Started

> **环境要求**：Node.js ≥ 18.18（推荐 20+）

```bash
npm install
npm run dev        # 开发模式 → http://localhost:3000
```

打开 http://localhost:3000（建议用 DevTools 手机模拟器验证移动端布局）。

**构建静态产物：**

```bash
npm run build      # 产物输出到 out/
npx serve out      # 本地预览静态产物
```

> 自接入 Capacitor 起启用了静态导出，`next start` 不再可用；本地预览静态产物用 `npx serve out`（或 `node scripts/serve-out.js`，内置 SPA 路由回退）。

## 📱 Android 打包 · Android Build

静态导出产物在 `out/`，与 `capacitor.config.json` 的 `webDir: "out"` 对应。

**环境要求**：Node ≥ 20、Android Studio + Android SDK。

```bash
npm install @capacitor/core @capacitor/cli    # 可选：配置文件已存在
npx cap init "极简决策卡" "com.decisioncard.app" --web-dir out   # 可选
npm install @capacitor/android
npm run build                                  # 生成 out/
npx cap add android                            # 首次生成 android/ 原生工程
npx cap sync android                           # 同步 out/ 到原生工程
npx cap open android                           # 在 Android Studio 中构建
```

或命令行直接构建：

```powershell
cd android
.\gradlew.bat assembleDebug
```

- **APK 产物**：`android/app/build/outputs/apk/debug/app-debug.apk`
- **SDK 版本**：minSdk 24 / targetSdk 36 / compileSdk 36（Gradle 8.14.3）
- **版本号**：`versionCode 1 / versionName "1.0"`（维护于 `android/app/build.gradle`）

**网络说明**：官方源（services.gradle.org / dl.google.com）在某些网络下会超时。项目已内置镜像方案：`android/build.gradle` 仓库前置阿里云 Maven 镜像；Gradle 发行版可从腾讯云镜像下载放入 `%USERPROFILE%\.gradle\wrapper\dists\gradle-8.14.3-all\`；缺失的 SDK platform 可用 `mirrors.cloud.tencent.com/AndroidSDK/` 手动安装。本机已验证构建成功。

## 📡 PWA 支持 · PWA Support

- `public/manifest.json` + `public/icons/`（192 / 512 / maskable 三尺寸图标）
- iOS meta 已配置（`src/app/layout.tsx` 的 viewport / theme-color）
- 待接入：离线缓存 Service Worker

## 📁 项目结构 · Project Structure

```text
minimal-decision-card/
├── package.json
├── next.config.ts            # output: "export" 静态导出 → out/
├── capacitor.config.json     # Capacitor 配置（appId / appName / webDir: out）
├── postcss.config.mjs        # Tailwind v4 PostCSS 插件
├── tsconfig.json             # 路径别名 @/* → src/*
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # 192 / 512 / maskable 图标
├── scripts/
│   ├── gen-icons.ps1         # 图标生成脚本（PowerShell + System.Drawing）
│   └── serve-out.js          # 静态产物本地预览服务器（SPA 回退）
└── src/
    ├── app/
    │   ├── globals.css       # @theme 新粗野主义设计 token
    │   ├── layout.tsx        # 根布局：viewport / 安全区 / 字体
    │   ├── page.tsx          # 首页：场景卡片 + 新建问题入口
    │   └── decide/
    │       └── page.tsx      # 决策页 /decide?t=<id>：翻牌抽取流程
    ├── components/
    │   ├── NeoButton.tsx     # 基础按钮（硬阴影 + 按压反馈）
    │   ├── NeoCard.tsx       # 基础卡片容器
    │   ├── SceneCard.tsx     # 场景入口卡片 + ✎ 编辑入口
    │   ├── FlipCard.tsx      # 3D 翻牌组件
    │   ├── DecisionBoard.tsx # 抽取流程编排（状态机 + 反后悔 + 撒花）
    │   ├── TemplateEditorDrawer.tsx  # 编辑/新建抽屉：标题 + 选项 + 权重
    │   └── ResultPoster.tsx  # 结果海报导出
    ├── store/
    │   └── templateStore.ts  # Zustand 模板库（localStorage 持久化 + 水合）
    └── lib/
        ├── cn.ts             # class 拼接工具
        ├── id.ts             # id 生成器
        ├── types.ts          # DecisionTemplate / DecisionOption 类型
        ├── random.ts         # 加权随机 pickWeighted
        └── templates.ts      # 预设模板库
```

> `android/` 目录由 Capacitor 生成，不属于源码。

## 🗺️ 开发路线 · Roadmap

- [x] **阶段一** 项目骨架 + 新粗野主义 UI
- [x] **阶段二** 加权随机 + Zustand 模板库（增删改 + localStorage 持久化）
- [x] **阶段三** 3D 翻牌 + 撒花（Web Audio 合成音效待接入）
- [x] **阶段四** 结果海报导出（Web Share API 分享与真实二维码待接入）
- [x] **PWA** manifest + 图标 + iOS meta（离线缓存 Service Worker 待接入）
- [x] **Android** Capacitor 8 + APK 构建验证

## 📝 备注 · Notes

- Tailwind v4 使用 CSS-first 配置（`globals.css` 的 `@theme`），无需 `tailwind.config.js`
- 标题字体 Space Grotesk 本地优先，未引入 Google Fonts 网络依赖，避免离线构建失败
- `DecidePage` 通过 `useSearchParams` 读取模板 id（需 Suspense 边界），无效 id 自动回退第一个模板
- 图标由 `scripts/gen-icons.ps1`（PowerShell + System.Drawing）生成，可重新生成

## 🤝 参与贡献 · Contributing

欢迎提交 Issue 与 PR！请保持代码风格统一（Prettier + TypeScript strict），并为新功能补充必要的类型定义。

## 📄 许可证 · License

本项目暂未添加开源许可证。
