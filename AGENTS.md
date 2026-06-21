<!-- BEGIN:nextjs-agent-rules -->
# 项目背景与 Next.js 版本提示

本项目使用 **Next.js 16**，它与你训练数据中的 Next.js 可能存在破坏性差异。编写代码前请查阅 `node_modules/next/dist/docs/` 中的相关指南，并留意废弃（deprecation）提示。
<!-- END:nextjs-agent-rules -->

# AGENTS.md —— 荒野乱斗 Brawl Stars 资料站

> 本文件面向 AI 编码助手。若你第一次接触本项目，请先阅读本节，再修改任何代码。

---

## 1. 项目概述

这是一个以 Supercell 手游《荒野乱斗》（Brawl Stars）为主题的资料展示站，采用 Next.js App Router 构建，主要面向中文用户。项目定位是“图鉴 + 赛事”站点：

- **英雄图鉴**：展示英雄列表、分类筛选、英雄详情页（技能、背景故事）。
- **游戏模式**：展示游戏模式卡片、实时轮换（rotation）倒计时、模式详情页。
- **对战地图**：展示地图列表，可按模式 / 是否在实时天梯池中筛选。
- **赛事中心**：赛事（tournaments）、战队（teams）、选手（players）、赛程（schedule）、数据统计（stats）。

项目没有后端数据库，静态数据集中在 `lib/data.ts` 和 `lib/data/esports.ts`。动态数据通过 Next.js API Route 代理，默认使用 Supercell 官方 API `https://api.brawlstars.com/v1`（需要配置 `BRAWL_API_TOKEN` 且部署 IP 在白名单内）；未配置 token 时部分接口将返回空数据或 503。

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js `16.2.6`（App Router） |
| UI 库 | React `19.2.4` |
| 语言 | TypeScript `^5` |
| 样式 | Tailwind CSS `v4`（`@tailwindcss/postcss`） |
| 代码规范 | ESLint `9`（Flat Config）+ `eslint-config-next` |
| 包管理 | npm（`package-lock.json` 存在） |
| 运行时 | Node.js（本地开发 / Vercel 等 Node 部署环境） |

---

## 3. 关键配置文件

| 文件 | 作用 |
|------|------|
| `package.json` | 依赖与脚本入口。 |
| `next.config.ts` | Next.js 配置（当前为默认空配置，未启用静态导出）。 |
| `tsconfig.json` | TypeScript 配置，`paths` 中定义 `@/*` 映射到项目根目录。 |
| `eslint.config.mjs` | ESLint Flat Config，继承 `eslint-config-next/core-web-vitals` 与 `eslint-config-next/typescript`。 |
| `postcss.config.mjs` | 注册 `@tailwindcss/postcss` 插件。 |
| `app/globals.css` | Tailwind v4 入口，含自定义 `@theme` / `@utility`、动画 keyframes、滚动吸附、视差辅助样式。 |

---

## 4. 目录结构与模块划分

```
app/                    # Next.js App Router 页面与 API
├── api/
│   ├── brawl-data/route.ts    # 代理 Supercell 官方 API 的 maps + events，缓存 60s
│   └── rotation/route.ts      # 代理 Supercell 官方 API 的 events rotation，缓存 5min
├── events/                    # 赛事中心页面（列表、详情、战队、选手、赛程、数据）
├── heroes/[id]/page.tsx       # 英雄详情页
├── modes/[id]/page.tsx        # 模式详情页
├── esports.ts                 # 与 lib/data/esports.ts 部分重复的赛事静态数据
├── globals.css
├── layout.tsx
├── page.tsx                   # 首页（4 个滚动吸附 section）

components/             # React 组件
├── section_hero/
│   └── HeroSection.tsx        # 英雄图鉴板块
├── section_map/
│   └── MapSection.tsx         # 对战地图板块
├── section_mode/
│   └── ModeSection.tsx        # 游戏模式板块
├── BannerCarousel.tsx         # 首页轮播容器
├── Footer.tsx
├── Navbar.tsx
├── ScrollIndicator.tsx        # 右侧滚动进度导航
└── Swiper.tsx                 # 通用图片轮播

hooks/
└── useScrollSnapTransition.ts # 滚动吸附视差 + 内容淡入淡出 Hook

lib/
├── data.ts                    # 核心静态数据：导航、英雄、模式、地图
└── data/
    ├── esports.ts             # 赛事静态数据：赛事、战队、选手、赛程、统计
    └── heroDetails.ts         # 英雄详细数据（含属性、技能、星辉、妙具、皮肤、表情、芭菲等）

public/                 # 静态资源
├── HeroAvatars/             # 英雄头像
├── PromoArt/                # 首页轮播图
├── Usedinheroes/            # 英雄详情图、背景、技能图标
├── Usedinmode/              # 模式图片
├── buffies/、gadgets/、pins/、starpowers/  # 英雄相关素材
├── glo/                     # 通用装饰图 / logo
└── players/、teams/         # 赛事相关素材
```

---

## 5. 构建、开发与测试命令

```bash
# 安装依赖
npm install

# 本地开发服务器（默认 http://localhost:3000）
npm run dev

# 生产构建
npm run build

# 启动生产服务器（需先 build）
npm run start

# 代码检查
npm run lint          # 运行 ESLint
```

> 注意：当前项目 **没有配置测试框架**，`package.json` 中也没有测试脚本。如需新增测试，请自行引入 Vitest / Jest / Playwright 等，并遵循现有目录约定放在项目根目录或 `__tests__` 目录。

---

## 6. 运行时架构与数据流

1. **路由**：基于 Next.js App Router。所有交互页面几乎都是 Client Component（`'use client'`），原因是需要大量 DOM 监听、滚动吸附与本地状态。
2. **静态数据**：
   - 英雄、模式、地图 → `lib/data.ts`
   - 赛事 → `lib/data/esports.ts`
3. **动态数据**：
   - `/api/brawl-data` 并发请求 `api.brawlstars.com/v1/maps` 与 `/v1/events/rotation`，服务端缓存 60 秒。
   - `/api/rotation` 请求 `api.brawlstars.com/v1/events/rotation`，服务端缓存 5 分钟，并把原始 mode 名称映射为站内 `modeId`。
   - 调用官方 API 需要 `BRAWL_API_TOKEN`，且服务器出口 IP 必须在 Supercell 开发者后台白名单中。
4. **首页数据获取**：`ModeSection` 和 `MapSection` 在客户端请求上述 API，渲染实时轮换与地图列表。
5. **详情页**：直接读取 `lib/data/heroDetails.ts`（V2）中的静态记录，无额外请求。页面已按 Brawl Insights Stats 页风格拆分为属性、普攻&大招、随身妙具、星辉之力、极限充能、随身秒具、皮肤、表情&芭菲、模式/地图表现等可折叠区块。

---

## 7. 代码风格与约定

### 7.1 语言

- UI 文本与注释主要使用 **简体中文**。
- 类型 / 变量命名以英文为主（如 `Hero`、`Skill`、`ModeData`）。

### 7.2 组件规范

- 需要 DOM 操作或 state 的页面/组件使用 `'use client'` 指令。
- 组件文件名使用 PascalCase（如 `HeroSection.tsx`）。
- 普通工具/数据文件使用 camelCase（如 `data.ts`、`useScrollSnapTransition.ts`）。
- 路由目录使用 kebab-case（如 `heroes/[id]`、`brawl-data`）。

### 7.3 导入路径

- 统一使用路径别名 `@/`，例如：
  ```ts
  import Navbar from '@/components/Navbar';
  import { heroList } from '@/lib/data';
  ```
- `@/` 在 `tsconfig.json` 中映射为项目根目录 `./*`。

### 7.4 样式

- 使用 Tailwind CSS v4。入口文件 `app/globals.css` 中：
  - `@import "tailwindcss"` 引入 Tailwind；
  - `@theme` 注册自定义缓动与动画延迟变量；
  - `@utility` 注册自定义动画类（如 `animate-val-skew-reveal`）。
- 组件内大量混用 Tailwind utility、arbitrary values（如 `bg-[#FFD500]`）与内联 `style={{}}`。
- 保持 `globals.css` 作为全局动画与滚动行为的唯一来源，新增全局动画请优先在此注册 `@utility`。

### 7.5 类型

- 数据模型优先使用 `interface` 并导出，集中在 `lib/data.ts` / `lib/data/esports.ts`。
- API 解析处存在少量 `any`，修改时建议逐步收紧类型。

### 7.6 静态资源

- 图片资源放在 `public/` 下，通过根路径引用（如 `/HeroAvatars/xueli.png`）。
- 项目中同时存在 Next.js `<Image />` 与原生 `<img />`，新增页面时推荐使用 Next.js `<Image />` 以优化性能，但若需要复杂的 CSS clip/gradient 效果，可沿用现有 `<img />` 模式。

---

## 8. 测试说明

- 当前项目 **没有测试用例、测试脚本或测试配置文件**。
- `.gitignore` 中已包含 `/coverage`，为将来引入测试工具预留。
- 若需要验证改动，通常做法：
  1. `npm run lint` 检查代码规范；
  2. `npm run build` 检查 TypeScript 编译与构建是否通过；
  3. `npm run start` 在本地预览生产构建。

---

## 9. 安全与部署注意事项

1. **第三方 API 代理**：
   - 不要在 API Route 中暴露任何私有 token。
   - `/api/brawl-data` 与 `/api/rotation` 目前调用 Supercell 官方 API，通过服务端 `Authorization: Bearer <BRAWL_API_TOKEN>` 鉴权，并设置 `revalidate` 缓存降低请求频率。
2. **环境变量**：
   - 项目使用 `BRAWL_API_TOKEN` 调用 Supercell 官方 API。请写入 `.env.local`（已在 `.gitignore` 中排除 `.env*`）。本地开发时若 IP 不在白名单，请求会被拒绝；生产环境必须部署到白名单内的服务器公网 IP。
   - 参考 `.env.local.example` 进行配置。
3. **部署**：
   - 默认输出为 Next.js SSR/ISR，可直接部署到 Vercel。
   - 当前 `next.config.ts` 未设置 `output: 'export'`，不要按纯静态站点方式部署。
4. **资源路径**：
   - 静态资源较多且体积可能较大，部署前建议检查 `public/` 中无用图片，避免构建产物过大。
5. **无障碍与动效**：
   - `globals.css` 已包含 `@media (prefers-reduced-motion: reduce)` 降级。
   - 新增动画时，请同时补充该媒体查询下的禁用/简化逻辑。

---

## 10. 已知问题与注意事项

- `app/esports.ts` 与 `lib/data/esports.ts` 内容不同（`app/esports.ts` 行数更少），疑似重复或历史遗留文件。修改赛事数据时建议确认引用的是 `lib/data/esports.ts`，并考虑清理重复文件。
- `app/api/rotation/route.ts` 已按 Next.js App Router 约定使用单数 `route.ts`。
- 项目使用了 Next.js 16 和 React 19 的实验性/新特性，引入第三方库时请确认其兼容性。
